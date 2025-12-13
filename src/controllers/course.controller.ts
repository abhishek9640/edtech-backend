import { Response } from 'express';
import { Course } from '../models/Course.model';
import { Lesson } from '../models/Lesson.model';
import { Enrollment } from '../models/Enrollment.model';
import { ApiResponse } from '../utils/response.utils';
import { AuthRequest } from '../middlewares/auth.middleware';

export class CourseController {
  // Create course
  static async createCourse(req: AuthRequest, res: Response) {
    try {
      const courseData = {
        ...req.body,
        instructor: req.user.id,
      };

      const course = await Course.create(courseData);

      return ApiResponse.success(res, 201, 'Course created successfully', {
        course,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Get all courses (with filters)
  static async getCourses(req: AuthRequest, res: Response) {
    try {
      const { category, level, status, search, page = 1, limit = 10 } = req.query;

      // Build query
      const query: any = {};

      if (category) query.category = category;
      if (level) query.level = level;
      
      // Only show published courses for non-instructors/admins
      if (!req.user || (req.user.role !== 'instructor' && req.user.role !== 'admin')) {
        query.status = 'published';
      } else if (status) {
        query.status = status;
      }

      // Search functionality
      if (search) {
        query.$text = { $search: search as string };
      }

      // Pagination
      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const skip = (pageNum - 1) * limitNum;

      const courses = await Course.find(query)
        .populate('instructor', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

      const total = await Course.countDocuments(query);

      return ApiResponse.success(res, 200, 'Courses retrieved successfully', {
        courses,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Get single course
  static async getCourse(req: AuthRequest, res: Response) {
    try {
      const course = await Course.findById(req.params.id)
        .populate('instructor', 'name email avatar bio')
        .populate({
          path: 'reviews.user',
          select: 'name avatar',
        });

      if (!course) {
        return ApiResponse.error(res, 404, 'Course not found');
      }

      // Check authorization for unpublished courses
      if (course.status !== 'published') {
        if (!req.user || 
            (course.instructor._id.toString() !== req.user.id && 
             req.user.role !== 'admin')) {
          return ApiResponse.error(res, 403, 'Not authorized to view this course');
        }
      }

      // Get lessons for the course
      const lessons = await Lesson.find({ course: course._id })
        .sort({ order: 1 })
        .select('title duration order');

      return ApiResponse.success(res, 200, 'Course retrieved successfully', {
        course,
        lessons,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Update course
  static async updateCourse(req: AuthRequest, res: Response) {
    try {
      let course = await Course.findById(req.params.id);

      if (!course) {
        return ApiResponse.error(res, 404, 'Course not found');
      }

      // Check authorization
      if (
        course.instructor.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return ApiResponse.error(res, 403, 'Not authorized to update this course');
      }

      course = await Course.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      return ApiResponse.success(res, 200, 'Course updated successfully', {
        course,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Delete course
  static async deleteCourse(req: AuthRequest, res: Response) {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return ApiResponse.error(res, 404, 'Course not found');
      }

      // Check authorization
      if (
        course.instructor.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return ApiResponse.error(res, 403, 'Not authorized to delete this course');
      }

      // Delete related data
      await Lesson.deleteMany({ course: course._id });
      await Enrollment.deleteMany({ course: course._id });
      await course.deleteOne();

      return ApiResponse.success(res, 200, 'Course deleted successfully', null);
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Get instructor's courses
  static async getInstructorCourses(req: AuthRequest, res: Response) {
    try {
      const courses = await Course.find({ instructor: req.user.id })
        .sort({ createdAt: -1 });

      return ApiResponse.success(res, 200, 'Instructor courses retrieved successfully', {
        courses,
        count: courses.length,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Add review to course
  static async addReview(req: AuthRequest, res: Response) {
    try {
      const { rating, comment } = req.body;
      const course = await Course.findById(req.params.id);

      if (!course) {
        return ApiResponse.error(res, 404, 'Course not found');
      }

      // Check if user is enrolled
      const enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: course._id,
      });

      if (!enrollment) {
        return ApiResponse.error(res, 403, 'You must be enrolled to review this course');
      }

      // Check if user already reviewed
      const alreadyReviewed = course.reviews.find(
        (r: any) => r.user.toString() === req.user.id
      );

      if (alreadyReviewed) {
        return ApiResponse.error(res, 400, 'You have already reviewed this course');
      }

      // Add review
      course.reviews.push({
        user: req.user.id,
        rating,
        comment,
        createdAt: new Date(),
      } as any);

      // Calculate new average rating
      course.calculateAverageRating();
      await course.save();

      return ApiResponse.success(res, 201, 'Review added successfully', {
        course,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Publish/Unpublish course
  static async togglePublish(req: AuthRequest, res: Response) {
    try {
      const course = await Course.findById(req.params.id);

      if (!course) {
        return ApiResponse.error(res, 404, 'Course not found');
      }

      // Check authorization
      if (
        course.instructor.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return ApiResponse.error(res, 403, 'Not authorized');
      }

      course.status = course.status === 'published' ? 'draft' : 'published';
      await course.save();

      return ApiResponse.success(res, 200, `Course ${course.status} successfully`, {
        course,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }
}

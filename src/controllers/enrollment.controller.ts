import { Response } from 'express';
import { Enrollment } from '../models/Enrollment.model';
import { Course } from '../models/Course.model';
import { Lesson } from '../models/Lesson.model';
import { ApiResponse } from '../utils/response.utils';
import { AuthRequest } from '../middlewares/auth.middleware';

export class EnrollmentController {
  // Enroll in course
  static async enrollCourse(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;

      // Check if course exists and is published
      const course = await Course.findOne({
        _id: courseId,
        status: 'published',
      });

      if (!course) {
        return ApiResponse.error(res, 404, 'Course not found or not available');
      }

      // Check if already enrolled
      const existingEnrollment = await Enrollment.findOne({
        user: req.user.id,
        course: courseId,
      });

      if (existingEnrollment) {
        return ApiResponse.error(res, 400, 'You are already enrolled in this course');
      }

      // Create enrollment
      const enrollment = await Enrollment.create({
        user: req.user.id,
        course: courseId,
      });

      // Increment enrollment count
      course.enrollmentCount += 1;
      await course.save();

      return ApiResponse.success(res, 201, 'Successfully enrolled in course', {
        enrollment,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Get user's enrollments
  static async getMyEnrollments(req: AuthRequest, res: Response) {
    try {
      const enrollments = await Enrollment.find({ user: req.user.id })
        .populate({
          path: 'course',
          populate: {
            path: 'instructor',
            select: 'name avatar',
          },
        })
        .sort({ enrolledAt: -1 });

      return ApiResponse.success(res, 200, 'Enrollments retrieved successfully', {
        enrollments,
        count: enrollments.length,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Get enrollment details
  static async getEnrollment(req: AuthRequest, res: Response) {
    try {
      const enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: req.params.courseId,
      }).populate('course');

      if (!enrollment) {
        return ApiResponse.error(res, 404, 'Enrollment not found');
      }

      // Get all lessons for progress tracking
      const lessons = await Lesson.find({ course: req.params.courseId })
        .sort({ order: 1 });

      return ApiResponse.success(res, 200, 'Enrollment details retrieved successfully', {
        enrollment,
        lessons,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Update lesson progress
  static async updateProgress(req: AuthRequest, res: Response) {
    try {
      const { courseId, lessonId } = req.params;

      const enrollment = await Enrollment.findOne({
        user: req.user.id,
        course: courseId,
      });

      if (!enrollment) {
        return ApiResponse.error(res, 404, 'Enrollment not found');
      }

      // Check if lesson belongs to course
      const lesson = await Lesson.findOne({
        _id: lessonId,
        course: courseId,
      });

      if (!lesson) {
        return ApiResponse.error(res, 404, 'Lesson not found');
      }

      // Add lesson to completed if not already there
      if (!enrollment.completedLessons.includes(lesson._id as any)) {
        enrollment.completedLessons.push(lesson._id as any);

        // Calculate progress
        const totalLessons = await Lesson.countDocuments({ course: courseId });
        enrollment.progress = Math.round(
          (enrollment.completedLessons.length / totalLessons) * 100
        );

        // Check if course is completed
        if (enrollment.progress === 100) {
          enrollment.completedAt = new Date();
        }

        enrollment.lastAccessedAt = new Date();
        await enrollment.save();
      }

      return ApiResponse.success(res, 200, 'Progress updated successfully', {
        enrollment,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Unenroll from course
  static async unenrollCourse(req: AuthRequest, res: Response) {
    try {
      const enrollment = await Enrollment.findOneAndDelete({
        user: req.user.id,
        course: req.params.courseId,
      });

      if (!enrollment) {
        return ApiResponse.error(res, 404, 'Enrollment not found');
      }

      // Decrement enrollment count
      await Course.findByIdAndUpdate(req.params.courseId, {
        $inc: { enrollmentCount: -1 },
      });

      return ApiResponse.success(res, 200, 'Successfully unenrolled from course', null);
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }
}

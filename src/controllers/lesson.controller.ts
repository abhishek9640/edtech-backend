import { Response } from 'express';
import { Lesson } from '../models/Lesson.model';
import { Course } from '../models/Course.model';
import { ApiResponse } from '../utils/response.utils';
import { AuthRequest } from '../middlewares/auth.middleware';

export class LessonController {
  // Create lesson
  static async createLesson(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;

      // Check if course exists
      const course = await Course.findById(courseId);

      if (!course) {
        return ApiResponse.error(res, 404, 'Course not found');
      }

      // Check authorization
      if (
        course.instructor.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return ApiResponse.error(res, 403, 'Not authorized to add lessons to this course');
      }

      const lesson = await Lesson.create({
        ...req.body,
        course: courseId,
      });

      return ApiResponse.success(res, 201, 'Lesson created successfully', {
        lesson,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Get all lessons for a course
  static async getLessons(req: AuthRequest, res: Response) {
    try {
      const lessons = await Lesson.find({ course: req.params.courseId })
        .sort({ order: 1 });

      return ApiResponse.success(res, 200, 'Lessons retrieved successfully', {
        lessons,
        count: lessons.length,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Get single lesson
  static async getLesson(req: AuthRequest, res: Response) {
    try {
      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return ApiResponse.error(res, 404, 'Lesson not found');
      }

      return ApiResponse.success(res, 200, 'Lesson retrieved successfully', {
        lesson,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Update lesson
  static async updateLesson(req: AuthRequest, res: Response) {
    try {
      let lesson = await Lesson.findById(req.params.id).populate('course');

      if (!lesson) {
        return ApiResponse.error(res, 404, 'Lesson not found');
      }

      const course = await Course.findById(lesson.course);

      // Check authorization
      if (
        course?.instructor.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return ApiResponse.error(res, 403, 'Not authorized to update this lesson');
      }

      lesson = await Lesson.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      return ApiResponse.success(res, 200, 'Lesson updated successfully', {
        lesson,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Delete lesson
  static async deleteLesson(req: AuthRequest, res: Response) {
    try {
      const lesson = await Lesson.findById(req.params.id);

      if (!lesson) {
        return ApiResponse.error(res, 404, 'Lesson not found');
      }

      const course = await Course.findById(lesson.course);

      // Check authorization
      if (
        course?.instructor.toString() !== req.user.id &&
        req.user.role !== 'admin'
      ) {
        return ApiResponse.error(res, 403, 'Not authorized to delete this lesson');
      }

      await lesson.deleteOne();

      return ApiResponse.success(res, 200, 'Lesson deleted successfully', null);
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }
}

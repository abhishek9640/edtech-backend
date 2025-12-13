import { Response } from 'express';
import { User } from '../models/User.model';
import { Course } from '../models/Course.model';
import { ApiResponse } from '../utils/response.utils';
import { AuthRequest } from '../middlewares/auth.middleware';

export class UserController {
  // Get user profile
  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.params.id).select('-password');

      if (!user) {
        return ApiResponse.error(res, 404, 'User not found');
      }

      // If instructor, get their courses
      let courses = null;
      if (user.role === 'instructor') {
        courses = await Course.find({ instructor: user._id })
          .select('title thumbnail rating enrollmentCount');
      }

      return ApiResponse.success(res, 200, 'User profile retrieved successfully', {
        user,
        courses,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Update user profile
  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const fieldsToUpdate: any = {
        name: req.body.name,
        bio: req.body.bio,
        avatar: req.body.avatar,
      };

      // Remove undefined fields
      Object.keys(fieldsToUpdate).forEach(
        (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
      );

      const user = await User.findByIdAndUpdate(
        req.user.id,
        fieldsToUpdate,
        { new: true, runValidators: true }
      ).select('-password');

      return ApiResponse.success(res, 200, 'Profile updated successfully', {
        user,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Get all users (admin only)
  static async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const users = await User.find().select('-password');

      return ApiResponse.success(res, 200, 'Users retrieved successfully', {
        users,
        count: users.length,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Delete user (admin only)
  static async deleteUser(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return ApiResponse.error(res, 404, 'User not found');
      }

      await user.deleteOne();

      return ApiResponse.success(res, 200, 'User deleted successfully', null);
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }
}

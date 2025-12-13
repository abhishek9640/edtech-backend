import { Request, Response } from 'express';
import { User } from '../models/User.model';
import { ApiResponse } from '../utils/response.utils';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.utils';

export class AuthController {
  // Register user
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return ApiResponse.error(res, 400, 'User already exists');
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        role: role || 'user',
      });

      // Generate tokens
      const accessToken = generateAccessToken(user._id.toString(), user.role);
      const refreshToken = generateRefreshToken(user._id.toString());

      return ApiResponse.success(res, 201, 'User registered successfully', {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Login user
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return ApiResponse.error(res, 400, 'Please provide email and password');
      }

      // Check if user exists
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return ApiResponse.error(res, 401, 'Invalid credentials');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return ApiResponse.error(res, 401, 'Invalid credentials');
      }

      // Generate tokens
      const accessToken = generateAccessToken(user._id.toString(), user.role);
      const refreshToken = generateRefreshToken(user._id.toString());

      return ApiResponse.success(res, 200, 'Login successful', {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }

  // Get current user
  static async getMe(req: any, res: Response) {
    try {
      const user = await User.findById(req.user.id);

      return ApiResponse.success(res, 200, 'User retrieved successfully', {
        user,
      });
    } catch (error: any) {
      return ApiResponse.error(res, 500, error.message);
    }
  }
}

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ApiResponse } from '../utils/response.utils';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.error(res, 401, 'Not authorized');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.error(
        res,
        403,
        `User role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
};

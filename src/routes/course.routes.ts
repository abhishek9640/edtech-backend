import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';
import { protect, AuthRequest } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/roleCheck.middleware';

const router = Router();

// Public routes
router.get('/', CourseController.getCourses as any);
router.get('/:id', CourseController.getCourse as any);

// Protected routes
router.post(
  '/',
  protect,
  authorize('instructor', 'admin'),
  CourseController.createCourse
);

router.put(
  '/:id',
  protect,
  authorize('instructor', 'admin'),
  CourseController.updateCourse
);

router.delete(
  '/:id',
  protect,
  authorize('instructor', 'admin'),
  CourseController.deleteCourse
);

router.get(
  '/instructor/my-courses',
  protect,
  authorize('instructor', 'admin'),
  CourseController.getInstructorCourses
);

router.post('/:id/reviews', protect, CourseController.addReview);

router.patch(
  '/:id/publish',
  protect,
  authorize('instructor', 'admin'),
  CourseController.togglePublish
);

export default router;

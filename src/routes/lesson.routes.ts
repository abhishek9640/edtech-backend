import { Router } from 'express';
import { LessonController } from '../controllers/lesson.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/roleCheck.middleware';

const router = Router();

router.post(
  '/courses/:courseId/lessons',
  protect,
  authorize('instructor', 'admin'),
  LessonController.createLesson
);

router.get('/courses/:courseId/lessons', LessonController.getLessons as any);
router.get('/:id', LessonController.getLesson as any);

router.put(
  '/:id',
  protect,
  authorize('instructor', 'admin'),
  LessonController.updateLesson
);

router.delete(
  '/:id',
  protect,
  authorize('instructor', 'admin'),
  LessonController.deleteLesson
);

export default router;

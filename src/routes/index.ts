import { Router } from 'express';
import authRoutes from './auth.routes';
import courseRoutes from './course.routes';
import enrollmentRoutes from './enrollment.routes';
import lessonRoutes from './lesson.routes';
import userRoutes from './user.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/courses', courseRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/lessons', lessonRoutes);
router.use('/users', userRoutes);

export default router;

import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.post('/:courseId/enroll', protect, EnrollmentController.enrollCourse);
router.get('/my-enrollments', protect, EnrollmentController.getMyEnrollments);
router.get('/:courseId', protect, EnrollmentController.getEnrollment);
router.post('/:courseId/lessons/:lessonId/complete', protect, EnrollmentController.updateProgress);
router.delete('/:courseId/unenroll', protect, EnrollmentController.unenrollCourse);

export default router;

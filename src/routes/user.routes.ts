import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { protect } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/roleCheck.middleware';

const router = Router();

router.get('/:id', UserController.getProfile as any);
router.put('/profile', protect, UserController.updateProfile);
router.get('/', protect, authorize('admin'), UserController.getAllUsers);
router.delete('/:id', protect, authorize('admin'), UserController.deleteUser);

export default router;

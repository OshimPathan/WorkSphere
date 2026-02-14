import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { getUsers, getUserById, createUser } from '../controllers/userController';

const router = Router();

router.use(authenticate);

router.post('/', authorize(['ADMIN', 'HR']), createUser);

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router;

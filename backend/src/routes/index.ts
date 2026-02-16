import { Router } from 'express';
import authRoutes from './authRoutes';
import departmentRoutes from './departmentRoutes';
import teamRoutes from './teamRoutes';
import taskRoutes from './taskRoutes';
import projectRoutes from './projectRoutes';
import userRoutes from './userRoutes';
import ticketRoutes from './ticketRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/departments', departmentRoutes);
router.use('/teams', teamRoutes);
router.use('/tasks', taskRoutes);
router.use('/projects', projectRoutes);
router.use('/users', userRoutes);
router.use('/tickets', ticketRoutes);

export default router;

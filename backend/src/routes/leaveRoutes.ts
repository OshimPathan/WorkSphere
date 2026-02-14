import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { createLeaveRequest, getLeaveRequests, updateLeaveStatus } from '../controllers/leaveController';

const router = Router();

router.use(authenticate);

router.post('/', createLeaveRequest);
router.get('/', getLeaveRequests);
router.patch('/:id/status', authorize(['ADMIN', 'HR']), updateLeaveStatus);

export default router;

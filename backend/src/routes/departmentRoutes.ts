import { Router } from 'express';
import { createDepartment, getDepartments, deleteDepartment } from '../controllers/departmentController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/', authorize(['ADMIN']), createDepartment);
router.get('/', getDepartments);
router.delete('/:id', authorize(['ADMIN']), deleteDepartment);

export default router;

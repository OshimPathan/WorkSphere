import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/authMiddleware';
import { createProject, getProjects, getProjectById, updateProject, deleteProject } from '../controllers/projectController';

const router = Router();

router.use(authenticate);

router.post('/', authorize(['ADMIN', 'HR', 'TEAM_LEADER']), createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', authorize(['ADMIN', 'HR', 'TEAM_LEADER']), updateProject);
router.delete('/:id', authorize(['ADMIN']), deleteProject);

export default router;

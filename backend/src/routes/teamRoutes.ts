import { Router } from 'express';
import { createTeam, getTeams, getTeamById } from '../controllers/teamController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.post('/', authorize(['ADMIN', 'HR']), createTeam);
router.get('/', getTeams);
router.get('/:id', getTeamById);

export default router;

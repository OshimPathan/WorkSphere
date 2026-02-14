import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { createDailyUpdate, getTeamUpdates } from '../controllers/dailyUpdateController';

const router = Router();

router.use(authenticate);

router.post('/', createDailyUpdate);
router.get('/:teamId', getTeamUpdates);

export default router;

import { Router } from 'express';
import { login, register } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticate, (req: any, res) => {
    res.json(req.user);
});

export default router;

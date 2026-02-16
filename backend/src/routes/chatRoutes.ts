import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { createChannel, getChannels, getMessages, sendMessage } from '../controllers/chatController';

const router = Router();

router.use(authenticate);

router.post('/channels', createChannel);
router.get('/channels', getChannels);
router.post('/messages', sendMessage);
router.get('/channels/:channelId/messages', getMessages);

export default router;

import express from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
    createTicket,
    getTickets,
    getTicketById,
    updateTicket,
    addComment,
    deleteTicket
} from '../controllers/ticketController';

const router = express.Router();

router.use(authenticate); // Protect all ticket routes

router.post('/', createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.put('/:id', updateTicket);
router.post('/:id/comments', addComment);
router.delete('/:id', deleteTicket);

export default router;

import { Request, Response } from 'express';
import { PrismaClient, TicketStatus, Priority, TicketType } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Create a new ticket
export const createTicket = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { subject, description, priority, type } = req.body;
        const organizationId = req.user?.organizationId;
        const createdById = req.user?.id;

        if (!organizationId || !createdById) {
            res.status(403).json({ message: 'User or Organization not authenticated' });
            return;
        }

        const ticket = await prisma.ticket.create({
            data: {
                subject,
                description,
                priority: priority || Priority.MEDIUM,
                type: type || TicketType.ISSUE,
                organizationId,
                createdById,
                status: TicketStatus.OPEN
            },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            }
        });

        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error });
    }
};

// Get all tickets for the organization
export const getTickets = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;
        if (!organizationId) {
            res.status(403).json({ message: 'Organization ID missing' });
            return;
        }

        const tickets = await prisma.ticket.findMany({
            where: { organizationId },
            include: {
                createdBy: { select: { id: true, name: true } },
                assignedTo: { select: { id: true, name: true } },
                _count: { select: { comments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(tickets);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error });
    }
};

// Get a single ticket by ID
export const getTicketById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const organizationId = req.user?.organizationId;

        const ticket = await prisma.ticket.findFirst({
            where: { id, organizationId },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } },
                comments: {
                    include: {
                        user: { select: { id: true, name: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        res.json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket', error });
    }
};

// Update ticket status or assignee
export const updateTicket = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const { status, priority, assignedToId } = req.body;
        const organizationId = req.user?.organizationId;

        const ticket = await prisma.ticket.findFirst({ where: { id, organizationId } });
        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id },
            data: {
                status,
                priority,
                assignedToId
            },
            include: {
                assignedTo: { select: { id: true, name: true } }
            }
        });

        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error updating ticket', error });
    }
};

// Add a comment to a ticket
export const addComment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const { content } = req.body;
        const userId = req.user?.id;
        const organizationId = req.user?.organizationId;

        if (!userId || !organizationId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        // Verify ticket belongs to org
        const ticket = await prisma.ticket.findFirst({ where: { id, organizationId } });
        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        const comment = await prisma.ticketComment.create({
            data: {
                content,
                ticketId: id,
                userId
            },
            include: {
                user: { select: { id: true, name: true } }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};

// Delete a ticket
export const deleteTicket = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params as { id: string };
        const organizationId = req.user?.organizationId;

        const ticket = await prisma.ticket.findFirst({ where: { id, organizationId } });
        if (!ticket) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }

        await prisma.ticketComment.deleteMany({ where: { ticketId: id } });
        await prisma.ticket.delete({ where: { id } });

        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error });
    }
};

import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createLeaveRequest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { reason, startDate, endDate, type } = req.body;
        const userId = req.user?.id;
        const organizationId = req.user?.organizationId;

        if (!userId || !organizationId) {
            res.status(401).json({ message: "Unauthorized or Missing Context" });
            return;
        }

        const leave = await prisma.leave.create({
            data: {
                userId,
                organizationId,
                reason,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                type: type || 'CASUAL',
                status: 'PENDING'
            }
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getLeaveRequests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const role = req.user?.role;
        const organizationId = req.user?.organizationId;
        const { status } = req.query;

        if (!userId || !organizationId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }

        const where: any = { organizationId }; // Scope by Org
        if (status) where.status = String(status);

        // If not Admin/HR, only see own leaves
        if (role !== 'ADMIN' && role !== 'HR') {
            where.userId = userId;
        }

        const leaves = await prisma.leave.findMany({
            where,
            include: {
                user: { select: { name: true, email: true, department: { select: { name: true } } } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateLeaveStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body; // APPROVED or REJECTED
        const organizationId = req.user?.organizationId;

        const existing = await prisma.leave.findUnique({ where: { id: String(id) } });
        if (!existing || existing.organizationId !== organizationId) {
            res.status(404).json({ message: 'Leave request not found' });
            return;
        }

        const leave = await prisma.leave.update({
            where: { id: String(id) },
            data: { status }
        });

        // TODO: Create notification for user

        res.json(leave);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

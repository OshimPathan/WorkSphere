import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, priority, deadline, projectId, assignedToId } = req.body;
        const createdById = req.user?.id;
        const organizationId = req.user?.organizationId;

        if (!createdById || !organizationId) {
            res.status(401).json({ message: "Unauthorized or Missing Context" });
            return;
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority || 'MEDIUM',
                deadline: deadline ? new Date(deadline) : undefined,
                projectId,
                assignedToId,
                createdById,
                organizationId,
                status: 'TODO'
            },
        });

        // TODO: Emit socket event here

        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { assignedToId, projectId, status } = req.query;
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        const where: any = { organizationId }; // Scope by Org
        if (assignedToId) where.assignedToId = String(assignedToId);
        if (projectId) where.projectId = String(projectId);
        if (status) where.status = String(status);

        const tasks = await prisma.task.findMany({
            where,
            include: {
                assignedTo: { select: { id: true, name: true } },
                project: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const organizationId = req.user?.organizationId;

        const existing = await prisma.task.findUnique({ where: { id: String(id) } });
        if (!existing || existing.organizationId !== organizationId) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        const task = await prisma.task.update({
            where: { id: String(id) },
            data: { status }
        });

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

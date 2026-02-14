import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createDailyUpdate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { content, teamId } = req.body;
        const userId = req.user?.id;
        const organizationId = req.user?.organizationId;

        if (!userId || !organizationId) {
            res.status(401).json({ message: "Unauthorized or Missing Context" });
            return;
        }

        const update = await prisma.dailyUpdate.create({
            data: {
                content,
                teamId,
                userId,
                organizationId
            }
        });

        res.status(201).json(update);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeamUpdates = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { teamId } = req.params;
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        // Verify team belongs to org
        const team = await prisma.team.findUnique({ where: { id: String(teamId) } });
        if (!team || team.organizationId !== organizationId) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }

        const updates = await prisma.dailyUpdate.findMany({
            where: { teamId: String(teamId) }, // Implicitly checked via team ownership above, but could add orgId here too for safety
            include: {
                user: { select: { name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json(updates);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createTeam = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, departmentId, leaderId } = req.body;
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        const team = await prisma.team.create({
            data: {
                name,
                departmentId,
                leaderId,
                organizationId
            },
        });

        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeams = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        const teams = await prisma.team.findMany({
            where: { organizationId },
            include: {
                leader: {
                    select: { id: true, name: true, email: true },
                },
                department: {
                    select: { id: true, name: true }
                },
                _count: {
                    select: { projects: true },
                },
            },
        });
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getTeamById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = req.user?.organizationId;

        const team = await prisma.team.findUnique({
            where: { id: String(id) },
            include: {
                leader: { select: { id: true, name: true, email: true } },
                members: { select: { id: true, name: true, email: true, role: true } },
                projects: { select: { id: true, name: true } },
                department: { select: { id: true, name: true } }
            }
        });

        if (!team || team.organizationId !== organizationId) {
            res.status(404).json({ message: 'Team not found' });
            return;
        }

        res.json(team);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

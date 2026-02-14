import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, description, teamId, leaderId } = req.body;
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        // TODO: Validate that the user has permission to create projects (e.g. Admin or Manager)

        const project = await prisma.project.create({
            data: {
                name,
                description,
                teamId,
                leaderId,
                organizationId
            }
        });

        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        const projects = await prisma.project.findMany({
            where: { organizationId },
            include: {
                team: { select: { name: true } },
                leadingUser: { select: { name: true } },
                _count: { select: { tasks: true } }
            }
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = req.user?.organizationId;

        const project = await prisma.project.findUnique({
            where: { id: String(id) },
            include: {
                team: true,
                leadingUser: true,
                tasks: {
                    include: {
                        assignedTo: { select: { id: true, name: true } }
                    }
                }
            }
        });

        if (!project || project.organizationId !== organizationId) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, leaderId } = req.body;
        const organizationId = req.user?.organizationId;

        // Verify ownership
        const existing = await prisma.project.findUnique({ where: { id: String(id) } });
        if (!existing || existing.organizationId !== organizationId) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        const project = await prisma.project.update({
            where: { id: String(id) },
            data: { name, description, leaderId }
        });

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = req.user?.organizationId;

        const existing = await prisma.project.findUnique({ where: { id: String(id) } });
        if (!existing || existing.organizationId !== organizationId) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }

        await prisma.project.delete({ where: { id: String(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

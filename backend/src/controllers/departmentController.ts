import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, managerId } = req.body;
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        const existing = await prisma.department.findUnique({
            where: {
                name_organizationId: {
                    name,
                    organizationId
                }
            }
        });

        if (existing) {
            res.status(400).json({ message: 'Department already exists in this organization' });
            return;
        }

        const department = await prisma.department.create({
            data: {
                name,
                managerId,
                organizationId
            },
        });

        res.status(201).json(department);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getDepartments = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        const departments = await prisma.department.findMany({
            where: { organizationId },
            include: {
                manager: {
                    select: { id: true, name: true, email: true },
                },
                _count: {
                    select: { members: true, teams: true },
                },
            },
        });
        res.json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deleteDepartment = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = req.user?.organizationId;

        // Ensure deletion is scoped to org
        const dept = await prisma.department.findUnique({ where: { id: String(id) } });
        if (!dept || dept.organizationId !== organizationId) {
            res.status(404).json({ message: 'Department not found' });
            return;
        }

        await prisma.department.delete({ where: { id: String(id) } });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

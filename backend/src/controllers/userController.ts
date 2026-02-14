import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';
import bcrypt from 'bcryptjs';

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password, role, departmentId, phoneNumber, joiningDate } = req.body;
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                departmentId,
                organizationId,
                phoneNumber,
                joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
            }
        });

        const { password: _, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const organizationId = req.user?.organizationId;

        if (!organizationId) {
            res.status(403).json({ message: 'Organization context missing' });
            return;
        }

        const users = await prisma.user.findMany({
            where: { organizationId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: { select: { name: true } },
                phoneNumber: true,
                joiningDate: true
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const organizationId = req.user?.organizationId;

        const user = await prisma.user.findUnique({
            where: { id: String(id) },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                organizationId: true,
                department: { select: { name: true } },
                projectsLed: { select: { id: true, name: true } },
                tasksAssigned: {
                    select: {
                        id: true, title: true, status: true, priority: true
                    }
                }
            }
        });

        if (!user || user.organizationId !== organizationId) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

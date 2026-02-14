import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import { generateToken, generateRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, name, role, organizationName } = req.body;

        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // 2. Transaction: Create Org (if provided) + User
        const result = await prisma.$transaction(async (tx) => {
            let orgId = '';

            // If registering a new organization (Admin/Owner flow)
            if (organizationName) {
                const newOrg = await tx.organization.create({
                    data: {
                        name: organizationName,
                    }
                });
                orgId = newOrg.id;
            } else {
                // For now, fail if no org provided
                throw new Error('Organization Name is required');
            }

            // Create User
            const newUser = await tx.user.create({
                data: {
                    email,
                    password: hashedPassword,
                    name,
                    role: role || 'ADMIN',
                    organizationId: orgId,
                },
            });

            // If created org, set owner
            if (organizationName) {
                await tx.organization.update({
                    where: { id: orgId },
                    data: { ownerId: newUser.id }
                });
            }

            return { user: newUser, orgId };
        });

        // Ensure result is defined
        if (!result) return;
        const { user, orgId } = result;

        const token = generateToken({ id: user.id, email: user.email, role: user.role, organizationId: orgId });
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role, organizationId: orgId });

        res.status(201).json({
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organizationId: orgId
            }
        });

    } catch (error: any) {
        if (error.message === 'Organization Name is required') {
            res.status(400).json({ message: 'Organization Name is required for registration.' });
            return;
        }
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                department: { select: { id: true, name: true } },
                team: { select: { id: true, name: true } },
                organization: { select: { id: true, name: true } }
            }
        });

        if (!user) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role, organizationId: user.organizationId });
        const refreshToken = generateRefreshToken({ id: user.id, email: user.email, role: user.role, organizationId: user.organizationId });

        res.status(200).json({
            token,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                organizationId: user.organizationId,
                organizationName: user.organization.name,
                department: user.department,
                team: user.team
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';

const prisma = new PrismaClient();

// Create a new channel
export const createChannel = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, type, description, members } = req.body; // members = array of userIds
        const organizationId = req.user?.organizationId;
        const createdById = req.user?.id;

        if (!organizationId || !createdById) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        const channel = await prisma.channel.create({
            data: {
                name,
                type: type || 'PUBLIC',
                description,
                organizationId,
                members: {
                    create: [
                        { userId: createdById, role: 'ADMIN' },
                        ...(members || []).map((uid: string) => ({ userId: uid, role: 'MEMBER' }))
                    ]
                }
            }
        });

        // Notify potential members via socket if possible (optional for now)
        const io = req.app.get('io');
        // io.to(organizationId).emit('new_channel', channel); // If we had org rooms

        res.status(201).json(channel);
    } catch (error) {
        res.status(500).json({ message: 'Error creating channel', error });
    }
};

// Get all channels for user
export const getChannels = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        const organizationId = req.user?.organizationId;

        if (!userId || !organizationId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        // Fetch public channels AND private channels implementation user is in
        const channels = await prisma.channel.findMany({
            where: {
                organizationId,
                OR: [
                    { type: 'PUBLIC' },
                    { members: { some: { userId } } }
                ]
            },
            include: {
                members: {
                    include: { user: { select: { id: true, name: true, email: true } } }
                }
            }
        });

        res.json(channels);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching channels', error });
    }
};

// Send a message
export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { channelId, content, attachments } = req.body;
        const senderId = req.user?.id;

        if (!senderId) {
            res.status(403).json({ message: 'Unauthorized' });
            return;
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId,
                channelId,
                attachments
            },
            include: {
                sender: { select: { id: true, name: true, email: true } },
                channel: true
            }
        });

        // Broadcast to channel room
        const io = req.app.get('io');
        io.to(channelId).emit('receive_message', message);

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};

// Get messages for a channel
export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { channelId } = req.params as { channelId: string };

        const messages = await prisma.message.findMany({
            where: { channelId },
            include: {
                sender: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'asc' }
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};

import { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const initializeSocket = (io: Server) => {
    io.on("connection", (socket: Socket) => {
        console.log(`User connected: ${socket.id}`);

        // Join a channel room
        socket.on("join_channel", (channelId: string) => {
            socket.join(channelId);
            console.log(`User ${socket.id} joined channel: ${channelId}`);
        });

        // Leave a channel room
        socket.on("leave_channel", (channelId: string) => {
            socket.leave(channelId);
            console.log(`User ${socket.id} left channel: ${channelId}`);
        });

        // Send a message
        socket.on("send_message", async (data: { channelId: string; content: string; userId: string; senderName: string }) => {
            const { channelId, content, userId, senderName } = data;

            // Broadcast to the room
            io.to(channelId).emit("receive_message", {
                id: Date.now().toString(), // Temp ID until saved
                content,
                senderId: userId,
                channelId,
                createdAt: new Date(),
                sender: { name: senderName }
            });

            // Note: We'll ideally save to DB in the controller, 
            // but for real-time we emit immediately. 
            // Or we can save here if we want pure socket communication.
            // For this architecture, we might use REST for saving and Socket for notification.
        });

        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
};

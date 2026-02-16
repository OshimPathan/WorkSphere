import app from "./app";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { initializeSocket } from "./socket";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Initialize Socket Logic
initializeSocket(io);

// Make io accessible globally if needed (e.g. via app.set)
app.set("io", io);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

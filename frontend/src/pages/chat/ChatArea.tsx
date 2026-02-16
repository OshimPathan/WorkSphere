import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    sender: {
        id: string;
        name: string;
    };
    channelId?: string;
}

const ChatArea = () => {
    const { channelId } = useParams<{ channelId: string }>();
    const { socket } = useSocket();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch messages when channel changes
    useEffect(() => {
        if (!channelId) return;

        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:5000/api/chat/channels/${channelId}/messages`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(response.data);
                scrollToBottom();
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };

        fetchMessages();

        // Socket listener for new messages
        if (socket) {
            socket.emit('join_channel', channelId);

            const handleReceiveMessage = (message: Message) => {
                // Only append if it belongs to current channel
                if (message.channelId === channelId) { // Ensure backend sends channelId
                    setMessages((prev) => [...prev, message]);
                    scrollToBottom();
                }
            };

            socket.on('receive_message', handleReceiveMessage);

            return () => {
                socket.emit('leave_channel', channelId);
                socket.off('receive_message', handleReceiveMessage);
            };
        }
    }, [channelId, socket]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !channelId) return;

        try {
            const token = localStorage.getItem('token');
            // Optimistic update omitted for simplicity, relying on socket or response
            await axios.post('http://localhost:5000/api/chat/messages', {
                channelId,
                content: newMessage
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    if (!channelId) {
        return <div className="flex-1 flex items-center justify-center text-gray-500">Select a channel to start chatting</div>;
    }

    return (
        <div className="flex flex-col h-full">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col">
                        <div className="flex items-baseline space-x-2">
                            <span className="font-bold text-gray-800">{msg.sender.name}</span>
                            <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-gray-700">{msg.content}</p>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatArea;

import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ChannelList from './ChannelList';
import { useSocket } from '../../context/SocketContext';
import axios from 'axios';

const ChatLayout = () => {
    const { isConnected } = useSocket();
    const { channelId } = useParams();
    const navigate = useNavigate();
    const [channels, setChannels] = useState([]);

    // Fetch channels on mount
    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/chat/channels', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChannels(response.data);

                // Redirect to first channel if no channel selected and channels exist
                if (!channelId && response.data.length > 0) {
                    navigate(`/chat/${response.data[0].id}`);
                }
            } catch (error) {
                console.error("Failed to fetch channels", error);
            }
        };
        fetchChannels();
    }, [channelId, navigate]);

    return (
        <div className="flex h-[calc(100vh-4rem)]"> {/* Adjust height based on navbar */}
            {/* Sidebar */}
            <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700">Channels</h2>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        + New
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <ChannelList channels={channels} activeChannelId={channelId} />
                </div>

                <div className="p-2 text-xs text-gray-500 text-center border-t">
                    {isConnected ? <span className="text-green-500">● Online</span> : <span className="text-red-500">● Offline</span>}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
                <Outlet />
            </div>
        </div>
    );
};

export default ChatLayout;

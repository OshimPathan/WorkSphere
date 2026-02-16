import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Channel {
    id: string;
    name: string;
    type: string;
}

interface ChannelListProps {
    channels: Channel[];
    activeChannelId?: string;
}

const ChannelList: React.FC<ChannelListProps> = ({ channels, activeChannelId }) => {
    const navigate = useNavigate();

    return (
        <ul>
            {channels.map((channel) => (
                <li key={channel.id}>
                    <button
                        onClick={() => navigate(`/chat/${channel.id}`)}
                        className={`w-full text-left px-4 py-2 text-sm ${activeChannelId === channel.id
                                ? 'bg-blue-100 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <span className="mr-2">#</span>
                        {channel.name}
                    </button>
                </li>
            ))}
            {channels.length === 0 && (
                <li className="px-4 py-2 text-sm text-gray-400">No channels yet.</li>
            )}
        </ul>
    );
};

export default ChannelList;

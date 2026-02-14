import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Send, Clock, User, MessageSquare } from 'lucide-react';

interface DailyUpdate {
    id: string;
    content: string;
    createdAt: string;
    user: { name: string; email: string };
}

interface Team {
    id: string;
    name: string;
    leader?: { name: string };
    projects: { id: string; name: string }[];
}

const TeamDashboard = () => {
    const { teamId } = useParams();
    const { user } = useAuth();
    const [team, setTeam] = useState<Team | null>(null);
    const [updates, setUpdates] = useState<DailyUpdate[]>([]);
    const [newUpdate, setNewUpdate] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    const fetchTeamData = async () => {
        try {
            // We need an endpoint to get single team details. 
            // Assuming GET /teams/:id exists or we need to add it.
            // Wait, standard CRUD usually has getById. Let's check teamController.
            // If not, I'll fallback to just showing updates for now or assume it exists.

            // Actually, I'll fetch updates first.
            const updatesRes = await api.get(`/daily-updates/${teamId}`);
            setUpdates(updatesRes.data);

            // Fetch team info (Assuming we have this endpoint or I can mock/skip for now if strictly daily updates are needed)
            try {
                const teamRes = await api.get(`/teams/${teamId}`);
                setTeam(teamRes.data);
            } catch (e) {
                console.warn("Could not fetch team details", e);
            }

        } catch (error) {
            console.error('Failed to fetch team data', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (teamId) fetchTeamData();
    }, [teamId]);

    const handlePostUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newUpdate.trim()) return;

        try {
            const res = await api.post('/daily-updates', {
                content: newUpdate,
                teamId
            });
            // Add new update to list (optimistic or from response)
            const createdUpdate = {
                ...res.data,
                user: { name: user?.name || 'Me', email: user?.email || '' }
            };
            setUpdates([createdUpdate, ...updates]);
            setNewUpdate('');
        } catch (error) {
            console.error('Failed to post update', error);
        }
    };

    if (isLoading) return <div className="text-center py-10 text-gray-400">Loading team dashboard...</div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h1 className="text-2xl font-bold text-white mb-2">{team?.name || 'Team Dashboard'}</h1>
                    <p className="text-gray-400">Daily Status & Updates</p>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MessageSquare size={20} className="text-blue-500" />
                        Post Daily Update
                    </h2>
                    <form onSubmit={handlePostUpdate} className="flex gap-2">
                        <input
                            type="text"
                            value={newUpdate}
                            onChange={(e) => setNewUpdate(e.target.value)}
                            placeholder="What did you work on today?"
                            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
                            disabled={!newUpdate.trim()}
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    {updates.map((update) => (
                        <div key={update.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-400 font-bold text-xs">
                                        {update.user.name.charAt(0)}
                                    </div>
                                    <span className="font-bold text-white text-sm">{update.user.name}</span>
                                </div>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock size={12} />
                                    {new Date(update.createdAt).toLocaleString()}
                                </span>
                            </div>
                            <p className="text-gray-300 ml-10">{update.content}</p>
                        </div>
                    ))}
                    {updates.length === 0 && (
                        <div className="text-center py-10 text-gray-500">No updates yet.</div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 sticky top-6">
                    <h3 className="font-bold text-white mb-4 border-b border-gray-700 pb-2">Team Info</h3>
                    {team && (
                        <div className="space-y-4">
                            <div>
                                <span className="text-gray-500 text-sm block mb-1">Team Lead</span>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <User size={16} />
                                    {team.leader?.name || 'Unassigned'}
                                </div>
                            </div>
                            <div>
                                <span className="text-gray-500 text-sm block mb-1">Active Projects</span>
                                <ul className="space-y-1">
                                    {team.projects.map(p => (
                                        <li key={p.id} className="text-gray-300 text-sm">• {p.name}</li>
                                    ))}
                                    {team.projects.length === 0 && <li className="text-gray-500 text-sm">No projects</li>}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamDashboard;

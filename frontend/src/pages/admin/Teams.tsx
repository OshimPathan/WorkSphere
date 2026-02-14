import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Users } from 'lucide-react';
import CreateTeamModal from '../../components/modals/CreateTeamModal';

interface Team {
    id: string;
    name: string;
    department: { name: string };
    leader: { name: string } | null;
    _count: { projects: string };
}

const Teams = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams');
            setTeams(response.data);
        } catch (error) {
            console.error('Failed to fetch teams', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    if (isLoading) return <div className="text-center py-10 text-gray-400">Loading teams...</div>;

    return (
        <div>
            <CreateTeamModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTeamCreated={fetchTeams}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Teams</h1>
                    <p className="text-gray-400">Manage organization teams</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Create Team
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                    <div key={team.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                                <Users size={24} />
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded bg-gray-700 text-gray-300">
                                {team.department?.name}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{team.name}</h3>

                        <div className="space-y-2 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500">Leader:</span>
                                <span className="text-gray-300">{team.leader?.name || 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500">Projects:</span>
                                <span className="text-gray-300">{team._count?.projects || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {teams.length === 0 && (
                <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                    <Users size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No teams found</h3>
                    <p className="text-gray-400">Create your first team to reorganize your workforce.</p>
                </div>
            )}
        </div>
    );
};

export default Teams;

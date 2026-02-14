import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Plus, Folder } from 'lucide-react';
import CreateProjectModal from '../components/modals/CreateProjectModal';

interface Project {
    id: string;
    name: string;
    description: string;
    leadingUser: { name: string } | null;
    _count: { tasks: number };
}

const ProjectList = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await api.get('/projects');
                setProjects(response.data);
            } catch (error) {
                console.error('Failed to fetch projects', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (isLoading) {
        return <div className="text-center py-10 text-gray-400">Loading projects...</div>;
    }

    return (
        <div>
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={() => {
                    const fetchProjects = async () => {
                        try {
                            const response = await api.get('/projects');
                            setProjects(response.data);
                        } catch (error) {
                            console.error('Failed to fetch projects', error);
                        }
                    };
                    fetchProjects();
                }}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
                    <p className="text-gray-400">Manage and track your team's projects</p>
                </div>
                {/* 
                  TODO: Add Create Project Modal 
                  For now we just show the button 
                */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Link
                        key={project.id}
                        to={`/projects/${project.id}`}
                        className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 hover:bg-gray-750 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Folder size={24} />
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded bg-gray-700 text-gray-300">
                                {project._count?.tasks || 0} Tasks
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                            {project.description || 'No description provided.'}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 border-t border-gray-700 pt-4">
                            <span>Lead:</span>
                            <span className="text-gray-300 font-medium">
                                {project.leadingUser?.name || 'Unassigned'}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {projects.length === 0 && (
                <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                    <Folder size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No projects yet</h3>
                    <p className="text-gray-400">Create your first project to get started</p>
                </div>
            )}
        </div>
    );
};

export default ProjectList;

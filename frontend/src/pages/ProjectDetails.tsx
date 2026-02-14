import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, User, ChevronLeft, Plus } from 'lucide-react';
import clsx from 'clsx';
import CreateTaskModal from '../components/modals/CreateTaskModal';

interface Task {
    id: string;
    title: string;
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    assignedTo: { name: string } | null;
}

interface Project {
    id: string;
    name: string;
    description: string;
    team: { name: string };
    leadingUser: { name: string };
    tasks: Task[];
}

const statusColors: Record<string, string> = {
    TODO: 'bg-gray-600',
    IN_PROGRESS: 'bg-blue-600',
    REVIEW: 'bg-yellow-600',
    COMPLETED: 'bg-green-600'
};

const priorityColors: Record<string, string> = {
    LOW: 'text-gray-400',
    MEDIUM: 'text-blue-400',
    HIGH: 'text-orange-400',
    CRITICAL: 'text-red-500 font-bold'
};

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await api.get(`/projects/${id}`);
                setProject(response.data);
            } catch (error) {
                console.error('Failed to fetch project', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchProject();
    }, [id]);

    if (isLoading) return <div className="p-8 text-center text-gray-400">Loading project details...</div>;
    if (!project) return <div className="p-8 text-center text-red-500">Project not found</div>;

    return (
        <div>
            {id && <CreateTaskModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)}
                projectId={id}
                onTaskCreated={() => {
                    // Refetch
                    const fetchProject = async () => {
                        try {
                            const response = await api.get(`/projects/${id}`);
                            setProject(response.data);
                        } catch (error) {
                            console.error('Failed to fetch project', error);
                        }
                    };
                    fetchProject();
                }}
            />}

            <Link to="/projects" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                <ChevronLeft size={20} />
                Back to Projects
            </Link>

            <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
                        <p className="text-gray-400 mb-4 max-w-2xl">{project.description}</p>
                        <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-400">
                                <User size={16} />
                                Lead: <span className="text-white font-medium">{project.leadingUser?.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400">
                                <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-300 text-xs">
                                    {project.team?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="text-blue-500" />
                    Tasks ({project.tasks.length})
                </h2>

                <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus size={16} />
                    Add Task
                </button>
            </div>

            <div className="space-y-3">
                {project.tasks.map((task) => (
                    <div key={task.id} className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors flex justify-between items-center group">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-medium text-white">{task.title}</h3>
                                <span className={clsx('text-xs px-2 py-0.5 rounded-full text-white', statusColors[task.status])}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className={priorityColors[task.priority]}>{task.priority} Priority</span>
                                {task.assignedTo && (
                                    <span className="flex items-center gap-1">
                                        <User size={12} /> {task.assignedTo.name}
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* 
                            TODO: Add task actions (Edit, Delete, Change Status)
                        */}
                    </div>
                ))}

                {project.tasks.length === 0 && (
                    <div className="text-center py-8 bg-gray-800/20 rounded-lg border border-dashed border-gray-700 text-gray-500">
                        No tasks in this project yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;

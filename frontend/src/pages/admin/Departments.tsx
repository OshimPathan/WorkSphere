import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Building2 } from 'lucide-react';
import CreateDepartmentModal from '../../components/modals/CreateDepartmentModal';

interface Department {
    id: string;
    name: string;
    manager: { name: string } | null;
    _count: { teams: number, members: number };
}

const Departments = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartments();
    }, []);

    if (isLoading) return <div className="text-center py-10 text-gray-400">Loading departments...</div>;

    return (
        <div>
            <CreateDepartmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDepartmentCreated={fetchDepartments}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Departments</h1>
                    <p className="text-gray-400">Manage organization structure</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Create Department
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept) => (
                    <div key={dept.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                                <Building2 size={24} />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{dept.name}</h3>

                        <div className="space-y-2 text-sm text-gray-400 mb-4">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500">Manager:</span>
                                <span className="text-gray-300">{dept.manager?.name || 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500">Teams:</span>
                                <span className="text-gray-300">{dept._count?.teams || 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {departments.length === 0 && (
                <div className="text-center py-20 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                    <Building2 size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">No departments found</h3>
                    <p className="text-gray-400">Create your first department to get started.</p>
                </div>
            )}
        </div>
    );
};

export default Departments;

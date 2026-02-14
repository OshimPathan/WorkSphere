import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Phone, Calendar } from 'lucide-react';
import CreateEmployeeModal from '../../components/modals/CreateEmployeeModal';
import clsx from 'clsx';

interface Employee {
    id: string;
    name: string;
    email: string;
    role: string;
    department: { name: string } | null;
    team: { name: string } | null;
    phoneNumber?: string;
    joiningDate?: string;
}

const Employees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/users');
            setEmployees(response.data);
        } catch (error) {
            console.error('Failed to fetch employees', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    if (isLoading) return <div className="text-center py-10 text-gray-400">Loading employees...</div>;

    return (
        <div>
            <CreateEmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onEmployeeCreated={fetchEmployees}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Employees</h1>
                    <p className="text-gray-400">Manage your workforce</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Onboard Employee
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((emp) => (
                    <div key={emp.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                    {emp.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{emp.name}</h3>
                                    <p className="text-xs text-gray-400">{emp.email}</p>
                                </div>
                            </div>
                            <span className={clsx(
                                "text-xs font-bold px-2 py-1 rounded uppercase",
                                emp.role === 'ADMIN' ? "bg-red-900/50 text-red-400" :
                                    emp.role === 'HR' ? "bg-purple-900/50 text-purple-400" :
                                        emp.role === 'TEAM_LEADER' ? "bg-yellow-900/50 text-yellow-400" :
                                            "bg-green-900/50 text-green-400"
                            )}>
                                {emp.role.replace('_', ' ')}
                            </span>
                        </div>

                        <div className="space-y-3 text-sm text-gray-300 border-t border-gray-700 pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Department</span>
                                <span className="font-medium">{emp.department?.name || 'Unassigned'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Team</span>
                                <span className="font-medium text-blue-400">{emp.team?.name || 'Unassigned'}</span>
                            </div>
                            {emp.phoneNumber && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 flex items-center gap-1"><Phone size={14} /> Phone</span>
                                    <span>{emp.phoneNumber}</span>
                                </div>
                            )}
                            {emp.joiningDate && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 flex items-center gap-1"><Calendar size={14} /> Joined</span>
                                    <span>{new Date(emp.joiningDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Employees;

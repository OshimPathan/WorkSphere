import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, CheckCircle, XCircle, Clock, Calendar } from 'lucide-react';
import RequestLeaveModal from '../components/modals/RequestLeaveModal';
import clsx from 'clsx';

interface Leave {
    id: string;
    type: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    user?: { name: string; email: string };
}

const LeaveRequests = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'MY_LEAVES' | 'APPROVALS'>(
        user?.role === 'ADMIN' || user?.role === 'HR' ? 'APPROVALS' : 'MY_LEAVES'
    );

    const fetchLeaves = async () => {
        setIsLoading(true);
        try {
            // For approvals, we might want to filter by status or fetch all
            const response = await api.get('/leaves');
            setLeaves(response.data);
        } catch (error) {
            console.error('Failed to fetch leaves', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await api.patch(`/leaves/${id}/status`, { status });
            // Optimistic update
            setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
        } catch (error) {
            console.error('Failed to update leave status', error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, [activeTab]);

    const displayedLeaves = activeTab === 'MY_LEAVES'
        ? leaves.filter(l => l.user?.email === user?.email || !l.user) // Naive check if backend doesn't filter perfectly
        : leaves; // Admin/HR sees all

    const isapprover = user?.role === 'ADMIN' || user?.role === 'HR';

    return (
        <div>
            <RequestLeaveModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onLeaveRequested={fetchLeaves}
            />

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Leave Management</h1>
                    <p className="text-gray-400">Track and manage time off</p>
                </div>

                {activeTab === 'MY_LEAVES' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <Plus size={20} />
                        Request Leave
                    </button>
                )}
            </div>

            {isapprover && (
                <div className="flex gap-4 mb-6 border-b border-gray-700 pb-1">
                    <button
                        onClick={() => setActiveTab('APPROVALS')}
                        className={clsx(
                            "px-4 py-2 font-medium border-b-2 transition-colors",
                            activeTab === 'APPROVALS'
                                ? "border-blue-500 text-blue-400"
                                : "border-transparent text-gray-400 hover:text-white"
                        )}
                    >
                        Approvals
                    </button>
                    <button
                        onClick={() => setActiveTab('MY_LEAVES')}
                        className={clsx(
                            "px-4 py-2 font-medium border-b-2 transition-colors",
                            activeTab === 'MY_LEAVES'
                                ? "border-blue-500 text-blue-400"
                                : "border-transparent text-gray-400 hover:text-white"
                        )}
                    >
                        My Requests
                    </button>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-10 text-gray-400">Loading requests...</div>
            ) : (
                <div className="space-y-4">
                    {displayedLeaves.length === 0 && (
                        <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-dashed border-gray-700">
                            <Calendar size={40} className="mx-auto text-gray-600 mb-4" />
                            <p className="text-gray-500">No leave requests found.</p>
                        </div>
                    )}

                    {displayedLeaves.map((leave) => (
                        <div key={leave.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    {(activeTab === 'APPROVALS' && leave.user) && (
                                        <span className="font-bold text-white">{leave.user.name}</span>
                                    )}
                                    <span className={clsx(
                                        "px-2 py-1 text-xs font-bold rounded uppercase",
                                        leave.type === 'SICK' ? "bg-red-900/30 text-red-400" :
                                            leave.type === 'VACATION' ? "bg-green-900/30 text-green-400" :
                                                "bg-blue-900/30 text-blue-400"
                                    )}>
                                        {leave.type}
                                    </span>
                                    <span className="text-gray-400 text-sm flex items-center gap-1">
                                        <Calendar size={14} />
                                        {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-gray-300">{leave.reason}</p>
                            </div>

                            <div className="flex items-center gap-4">
                                {leave.status === 'PENDING' && activeTab === 'APPROVALS' ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAction(leave.id, 'APPROVED')}
                                            className="p-2 bg-green-600/20 text-green-400 hover:bg-green-600/40 rounded-lg transition-colors" title="Approve">
                                            <CheckCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleAction(leave.id, 'REJECTED')}
                                            className="p-2 bg-red-600/20 text-red-400 hover:bg-red-600/40 rounded-lg transition-colors" title="Reject">
                                            <XCircle size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className={clsx(
                                        "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold",
                                        leave.status === 'APPROVED' ? "text-green-400 bg-green-900/20" :
                                            leave.status === 'REJECTED' ? "text-red-400 bg-red-900/20" :
                                                "text-yellow-400 bg-yellow-900/20"
                                    )}>
                                        {leave.status === 'PENDING' && <Clock size={16} />}
                                        {leave.status === 'APPROVED' && <CheckCircle size={16} />}
                                        {leave.status === 'REJECTED' && <XCircle size={16} />}
                                        {leave.status}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaveRequests;

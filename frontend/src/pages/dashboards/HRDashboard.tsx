import { Users, UserPlus, Clock, FileText, Check, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{title}</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
            </div>
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
                <Icon size={24} className={color.replace('bg-', 'text-')} />
            </div>
        </div>
    </div>
);

const HRDashboard = () => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900">HR Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Employees" value="48" icon={Users} color="bg-blue-500" />
                <StatCard title="New Hires (Month)" value="3" icon={UserPlus} color="bg-green-500" />
                <StatCard title="Pending Leaves" value="5" icon={Clock} color="bg-yellow-500" />
                <StatCard title="Open Positions" value="2" icon={FileText} color="bg-purple-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <Clock size={20} className="text-blue-600" />
                                Pending Leave Requests
                            </h2>
                            <Link to="/leaves" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-semibold">Employee</th>
                                        <th className="p-4 font-semibold">Type</th>
                                        <th className="p-4 font-semibold">Dates</th>
                                        <th className="p-4 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[1, 2, 3].map((i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                        JD
                                                    </div>
                                                    <span className="font-medium text-gray-900">John Doe</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded text-xs font-bold bg-purple-50 text-purple-600 border border-purple-100">
                                                    Sick Leave
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">Feb 15 - Feb 16</td>
                                            <td className="p-4 flex gap-2">
                                                <button className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors" title="Approve">
                                                    <Check size={16} />
                                                </button>
                                                <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors" title="Reject">
                                                    <X size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                            <UserPlus size={18} className="text-blue-600" />
                            <h3 className="font-bold text-gray-800">Quick Onboarding</h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <p className="text-sm text-gray-500">Rapidly add a new employee to the system.</p>
                            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">
                                + Add Employee
                            </button>
                            <div className="pt-2 border-t border-gray-100">
                                <Link to="/users" className="block text-center text-sm text-blue-600 hover:text-blue-800 font-medium">
                                    View All Employees
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;

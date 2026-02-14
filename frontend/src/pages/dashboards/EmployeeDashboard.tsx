import { Link } from 'react-router-dom';
import {
    CheckSquare, Folder, AlertCircle, Calendar, Plus,
    Megaphone, Clock, ArrowRight, FileText
} from 'lucide-react';
import Tasks from '../Tasks';
import { useAuth } from '../../context/AuthContext';

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

const Widget = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon?: any }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            {Icon && <Icon size={18} className="text-blue-600" />}
            <h3 className="font-bold text-gray-800">{title}</h3>
        </div>
        <div className="p-4 flex-1">
            {children}
        </div>
    </div>
);

const EmployeeDashboard = () => {
    const { user } = useAuth();

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(' ')[0]}!</h1>
                    <p className="text-blue-100">Here's what's happening in your workspace today.</p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-20 -mb-10 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-xl"></div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="My Tasks" value="5" icon={CheckSquare} color="bg-blue-500" />
                <StatCard title="Active Projects" value="2" icon={Folder} color="bg-purple-500" />
                <StatCard title="Pending Reviews" value="1" icon={AlertCircle} color="bg-yellow-500" />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tasks Widget */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <CheckSquare size={20} className="text-blue-600" />
                                My Priority Tasks
                            </h2>
                            <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="p-0">
                            {/* We can reuse the Tasks component or a simplified version. 
                                For now, embedding the existing Tasks component but we might want to 
                                Create a 'TaskWidget' later that is more compact.
                                Since Tasks is a full page, let's wrap it nicely or mask it.
                            */}
                            <div className="max-h-[500px] overflow-y-auto">
                                <Tasks simpleView={true} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Widgets) */}
                <div className="lg:col-span-1 space-y-6">

                    {/* Quick Actions */}
                    <Widget title="Quick Actions" icon={Plus}>
                        <div className="grid grid-cols-2 gap-3">
                            <Link to="/leaves" className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group">
                                <Calendar size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Request Leave</span>
                            </Link>
                            <Link to="/tasks" className="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors group">
                                <CheckSquare size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">New Task</span>
                            </Link>
                            <Link to={user?.department ? `/teams/${user.department.id}` : '/dashboard'} className="flex flex-col items-center justify-center p-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors group">
                                <FileText size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-xs font-bold">Daily Update</span>
                            </Link>
                        </div>
                    </Widget>

                    {/* Upcoming Deadlines / Events */}
                    <Widget title="Upcoming Deadlines" icon={Clock}>
                        <ul className="space-y-4">
                            {[
                                { title: 'Q1 Project Report', date: 'Today, 5:00 PM', type: 'High Priority', color: 'text-red-500' },
                                { title: 'Team Meeting', date: 'Tomorrow, 10:00 AM', type: 'Event', color: 'text-blue-500' },
                                { title: 'Design Review', date: 'Feb 20, 2:00 PM', type: 'Task', color: 'text-gray-500' }
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="flex-1">
                                        <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                                        <p className="text-xs text-gray-500">{item.date}</p>
                                    </div>
                                    <span className={`text-xs font-bold ${item.color}`}>{item.type}</span>
                                </li>
                            ))}
                        </ul>
                    </Widget>

                    {/* Company Announcements */}
                    <Widget title="Announcements" icon={Megaphone}>
                        <div className="space-y-4">
                            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                <h4 className="text-sm font-bold text-yellow-800 mb-1">Office Maintenance</h4>
                                <p className="text-xs text-yellow-700">Main server maintenance scheduled for this Saturday. Expect downtime.</p>
                            </div>
                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <h4 className="text-sm font-bold text-blue-800 mb-1">New Policy Update</h4>
                                <p className="text-xs text-blue-700">Please review the updated remote work policy in the HR portal.</p>
                            </div>
                        </div>
                    </Widget>

                </div>
            </div>
        </div>
    );
};

export default EmployeeDashboard;

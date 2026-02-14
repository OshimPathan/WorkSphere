import { Users, Briefcase, CheckSquare, TrendingUp, Plus, FileText, ArrowRight } from 'lucide-react';
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

const AdminDashboard = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
                    <p className="text-gray-500 mt-1">Monitor company performance and metrics</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
                        Download Report
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors">
                        Settings
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value="24" icon={Users} color="bg-blue-500" />
                <StatCard title="Active Projects" value="12" icon={Briefcase} color="bg-purple-500" />
                <StatCard title="Total Tasks" value="148" icon={CheckSquare} color="bg-green-500" />
                <StatCard title="Efficiency" value="94%" icon={TrendingUp} color="bg-orange-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800 flex items-center gap-2">
                                <Briefcase size={20} className="text-blue-600" />
                                Recent Projects
                            </h2>
                            <Link to="/projects" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                View All <ArrowRight size={14} />
                            </Link>
                        </div>
                        <div className="p-0">
                            <div className="divide-y divide-gray-100">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm border border-blue-100">
                                                P{i}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-gray-900">Website Redesign {i}</h4>
                                                <p className="text-xs text-gray-500">Marketing Team</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-xs font-medium text-gray-900">75% Complete</p>
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                    <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
                                                </div>
                                            </div>
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Widgets */}
                <div className="lg:col-span-1 space-y-6">
                    <Widget title="Quick Actions" icon={Plus}>
                        <div className="space-y-3">
                            <button className="w-full p-3 text-left bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-lg text-gray-700 transition-all flex items-center gap-3 group">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Users size={18} />
                                </div>
                                <span className="font-medium">Add New Employee</span>
                            </button>
                            <button className="w-full p-3 text-left bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-lg text-gray-700 transition-all flex items-center gap-3 group">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-md group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <Briefcase size={18} />
                                </div>
                                <span className="font-medium">Create Department</span>
                            </button>
                            <button className="w-full p-3 text-left bg-white border border-gray-200 hover:border-blue-400 hover:shadow-sm rounded-lg text-gray-700 transition-all flex items-center gap-3 group">
                                <div className="p-2 bg-green-50 text-green-600 rounded-md group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <FileText size={18} />
                                </div>
                                <span className="font-medium">Generate Report</span>
                            </button>
                        </div>
                    </Widget>

                    <Widget title="System Health" icon={TrendingUp}>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Server Load</span>
                                    <span className="font-bold text-gray-900">24%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '24%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Database Usage</span>
                                    <span className="font-bold text-gray-900">58%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                                </div>
                            </div>
                        </div>
                    </Widget>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Users,
    Briefcase,
    CheckSquare,
    // Settings,
    LogOut,
    LayoutDashboard,
    Bell
} from 'lucide-react';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    onClick: () => void;
    active?: boolean;
}

const SidebarItem = ({ icon: Icon, label, onClick, active }: SidebarItemProps) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
            ? 'bg-blue-600 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
    >
        <Icon className="w-5 h-5" />
        <span className="font-medium">{label}</span>
    </button>
);

const DashboardLayout = ({ children, title }: { children: React.ReactNode; title: string }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-lg">W</span>
                        </div>
                        <span className="text-xl font-bold">WorkSphere</span>
                    </div>
                    <div className="mt-4 text-sm text-gray-400">
                        {user?.name}
                        <div className="text-xs text-gray-500 uppercase mt-1">{user?.role}</div>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Overview"
                        onClick={() => navigate('/dashboard')}
                        active={true}
                    />

                    {(user?.role === 'ADMIN' || user?.role === 'HR') && (
                        <SidebarItem
                            icon={Users}
                            label="Employees"
                            onClick={() => navigate('/employees')}
                        />
                    )}

                    {(user?.role === 'ADMIN' || user?.role === 'TEAM_LEADER') && (
                        <SidebarItem
                            icon={Briefcase}
                            label="Projects"
                            onClick={() => navigate('/projects')}
                        />
                    )}

                    <SidebarItem
                        icon={CheckSquare}
                        label="My Tasks"
                        onClick={() => navigate('/tasks')}
                    />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <SidebarItem
                        icon={LogOut}
                        label="Logout"
                        onClick={logout}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full relative">
                            <Bell className="w-6 h-6" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                    </div>
                </header>

                {/* Content Body */}
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Menu, X, ChevronDown, Bell, LogOut, User, Settings,
    LayoutDashboard, CheckSquare, FolderKanban, Clock, FileText,
    Users, Briefcase, Building2, Calendar, CreditCard,
    Megaphone, FileSpreadsheet, CalendarDays, LifeBuoy, MessageSquare
} from 'lucide-react';
import clsx from 'clsx';

interface NavItem {
    label: string;
    icon?: any;
    path?: string;
    children?: {
        category: string;
        items: { label: string; path: string; icon: any; description: string }[];
    }[];
}

const TopNavigation = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navigation: NavItem[] = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: LayoutDashboard
        },
        {
            label: 'Work & Projects',
            children: [
                {
                    category: 'Management',
                    items: [
                        { label: 'My Tasks', path: '/tasks', icon: CheckSquare, description: 'View and manage your assigned tasks' },
                        { label: 'Projects', path: '/projects', icon: FolderKanban, description: 'Track project progress and milestones' },
                        { label: 'Timesheets', path: '/timesheets', icon: Clock, description: 'Log your working hours' }, // Placeholder
                    ]
                },
                {
                    category: 'Updates',
                    items: [
                        { label: 'Daily Status', path: user?.department?.id ? `/teams/${user.department.id}` : '/dashboard', icon: FileText, description: 'Post and view daily updates' }, // Fallback link logic
                    ]
                }
            ]
        },
        {
            label: 'HR & People',
            children: [
                {
                    category: 'Organization',
                    items: [
                        { label: 'Employees', path: '/users', icon: Users, description: 'Directory of all company employees' },
                        { label: 'Teams', path: '/teams', icon: Briefcase, description: 'Function teams and groups' },
                        { label: 'Departments', path: '/departments', icon: Building2, description: 'Company departments structure' },
                    ]
                },
                {
                    category: 'Personal',
                    items: [
                        { label: 'Leave Requests', path: '/leaves', icon: Calendar, description: 'Apply for leave or view status' },
                        { label: 'Attendance', path: '/attendance', icon: CalendarDays, description: 'View your attendance record' }, // Placeholder
                    ]
                }
            ]
        },
        {
            label: 'Finance',
            children: [
                {
                    category: 'Payments',
                    items: [
                        { label: 'Payroll', path: '/payroll', icon: FileSpreadsheet, description: 'View salary slips and tax info' }, // Placeholder
                        { label: 'Expenses', path: '/expenses', icon: CreditCard, description: 'Submit reimbursement claims' }, // Placeholder
                    ]
                }
            ]
        },
        {
            label: 'Company',
            children: [
                {
                    category: 'Communication',
                    items: [
                        { label: 'Announcements', path: '/announcements', icon: Megaphone, description: 'Latest news and updates' }, // Placeholder
                        { label: 'Events', path: '/events', icon: Calendar, description: 'Upcoming company events' }, // Placeholder
                    ]
                },
                {
                    category: 'Support',
                    items: [
                        { label: 'Helpdesk', path: '/tickets', icon: LifeBuoy, description: 'IT and Admin support' }, // Placeholder
                        { label: 'Feedback', path: '/feedback', icon: MessageSquare, description: 'Share your thoughts' }, // Placeholder
                    ]
                }
            ]
        }
    ];

    const toggleDropdown = (label: string) => {
        if (activeDropdown === label) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(label);
        }
    };

    return (
        <header ref={navRef} className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg relative z-50">
            {/* Top Bar - Logo and User Profile */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
                            <Building2 size={24} className="text-blue-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-xl tracking-wide">WorkSphere</span>
                            <span className="text-xs text-blue-200 uppercase tracking-wider">Corporate Portal</span>
                        </div>
                    </Link>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <button className="text-blue-200 hover:text-white relative">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
                            >
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium">{user?.name}</p>
                                    <p className="text-xs text-blue-300">{user?.role?.replace('_', ' ')}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold border-2 border-blue-400">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <ChevronDown size={16} className={`text-blue-300 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* User Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-2xl py-2 border border-blue-100 animate-in fade-in zoom-in-95 duration-200">
                                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition-colors">
                                        <User size={16} className="text-blue-600" />
                                        <span>My Profile</span>
                                    </Link>
                                    <Link to="/settings" className="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 transition-colors">
                                        <Settings size={16} className="text-blue-600" />
                                        <span>Settings</span>
                                    </Link>
                                    <div className="h-px bg-gray-100 my-1"></div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white p-2"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Main Navigation Bar */}
            <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 hidden md:block">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ul className="flex items-center gap-1">
                        {navigation.map((item) => (
                            <li key={item.label} className="">
                                {item.children ? (
                                    // Mega Menu Trigger
                                    <div className="">
                                        <button
                                            onClick={() => toggleDropdown(item.label)}
                                            className={clsx(
                                                "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 border-transparent hover:bg-white/10",
                                                activeDropdown === item.label ? "bg-white/10 border-blue-400 text-white" : "text-blue-100 hover:text-white"
                                            )}
                                        >
                                            {item.icon && <item.icon size={16} />}
                                            {item.label}
                                            <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Mega Menu Dropdown */}
                                        {activeDropdown === item.label && (
                                            <div className="absolute left-0 w-full bg-white text-gray-800 shadow-2xl border-t border-blue-100 mt-0 py-8 animate-in slide-in-from-top-2 duration-200">
                                                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-4 gap-8">
                                                    {item.children.map((child) => (
                                                        <div key={child.category} className="col-span-1">
                                                            <h3 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-4 border-b border-blue-100 pb-2">
                                                                {child.category}
                                                            </h3>
                                                            <ul className="space-y-3">
                                                                {child.items.map((subItem) => (
                                                                    <li key={subItem.path}>
                                                                        <Link
                                                                            to={subItem.path}
                                                                            onClick={() => setActiveDropdown(null)}
                                                                            className="group flex items-start gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                                                        >
                                                                            <div className="mt-1 bg-blue-100 text-blue-600 p-1.5 rounded-md group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                                                <subItem.icon size={16} />
                                                                            </div>
                                                                            <div>
                                                                                <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                                                                                    {subItem.label}
                                                                                </div>
                                                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                                                    {subItem.description}
                                                                                </p>
                                                                            </div>
                                                                        </Link>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                    {/* Promo / Highlight Section in Menu */}
                                                    <div className="col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                                                        <h4 className="font-bold text-blue-900 mb-2">Featured</h4>
                                                        <p className="text-sm text-gray-600 mb-4">
                                                            Check out the new Team Dashboard to stay updated with your team's progress.
                                                        </p>
                                                        <Link to="/teams" onClick={() => setActiveDropdown(null)} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                                            Go to Teams &rarr;
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Simple Link
                                    <Link
                                        to={item.path!}
                                        className={clsx(
                                            "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 border-transparent hover:bg-white/10",
                                            location.pathname === item.path ? "bg-white/10 border-blue-400 text-white" : "text-blue-100 hover:text-white"
                                        )}
                                    >
                                        {item.icon && <item.icon size={16} />}
                                        {item.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-gray-900 text-white border-t border-gray-800">
                    <div className="p-4 space-y-4">
                        {navigation.map((item) => (
                            <div key={item.label}>
                                {item.children ? (
                                    <div className="space-y-2">
                                        <div className="font-bold text-blue-400 px-2">{item.label}</div>
                                        {item.children.map(child => (
                                            <div key={child.category} className="pl-4 border-l border-gray-700 ml-2">
                                                <div className="text-xs text-gray-500 uppercase mb-2 mt-2">{child.category}</div>
                                                {child.items.map(subItem => (
                                                    <Link
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className="block py-2 text-sm hover:text-blue-300"
                                                    >
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <Link
                                        to={item.path!}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="block px-2 py-2 font-bold hover:text-blue-400"
                                    >
                                        {item.label}
                                    </Link>
                                )}
                            </div>
                        ))}
                        <div className="h-px bg-gray-800 my-4"></div>
                        <button onClick={logout} className="flex items-center gap-2 text-red-400 px-2">
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default TopNavigation;

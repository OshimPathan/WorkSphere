import { Outlet } from 'react-router-dom';
import TopNavigation from './TopNavigation';

const Layout = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans">
            <TopNavigation />

            {/* Main Content */}
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Outlet />
                </div>
            </main>

            {/* Footer (Optional, good for portals) */}
            <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} WorkSphere Corporate Portal. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;

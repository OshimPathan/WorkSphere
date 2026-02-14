import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import HRDashboard from './dashboards/HRDashboard';
import EmployeeDashboard from './dashboards/EmployeeDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === 'ADMIN') return <AdminDashboard />;
    if (user?.role === 'HR') return <HRDashboard />;

    return <EmployeeDashboard />;
};

export default Dashboard;

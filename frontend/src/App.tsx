import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

// Placeholder pages
import Layout from './components/Layout';
import ProjectList from './pages/ProjectList';
import ProjectDetails from './pages/ProjectDetails';
import Tasks from './pages/Tasks';
import Teams from './pages/admin/Teams';
import Departments from './pages/admin/Departments';
import Employees from './pages/admin/Employees';
import LeaveRequests from './pages/LeaveRequests';
import TeamDashboard from './pages/TeamDashboard';

// New Domain Pages
import Timesheets from './pages/work/Timesheets';
import Attendance from './pages/hr/Attendance';
import Payroll from './pages/finance/Payroll';
import Expenses from './pages/finance/Expenses';
import Announcements from './pages/company/Announcements';
import Events from './pages/company/Events';
// import Helpdesk from './pages/support/Helpdesk'; // Replaced
import TicketList from './pages/support/TicketList';
import TicketDetails from './pages/support/TicketDetails';
import Feedback from './pages/support/Feedback';

// Chat
import ChatLayout from './pages/chat/ChatLayout';
import ChatArea from './pages/chat/ChatArea';

const Unauthorized = () => <div className="p-10 text-center text-red-500">Unauthorized Access</div>;

const router = createBrowserRouter([
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'projects', element: <ProjectList /> },
          { path: 'projects/:id', element: <ProjectDetails /> },
          { path: 'tasks', element: <Tasks /> },
          { path: 'teams', element: <Teams /> },
          { path: 'departments', element: <Departments /> },
          { path: 'users', element: <Employees /> },
          { path: 'leaves', element: <LeaveRequests /> },
          { path: 'teams/:teamId', element: <TeamDashboard /> },

          // Work
          { path: 'timesheets', element: <Timesheets /> },

          // HR
          { path: 'attendance', element: <Attendance /> },

          // Finance
          { path: 'payroll', element: <Payroll /> },
          { path: 'expenses', element: <Expenses /> },

          // Company
          { path: 'announcements', element: <Announcements /> },
          { path: 'events', element: <Events /> },

          // Support
          // { path: 'help', element: <Helpdesk /> },
          { path: 'tickets', element: <TicketList /> },
          { path: 'tickets/:id', element: <TicketDetails /> },
          { path: 'tickets/new', element: <TicketList /> }, // Just redirect or handle in List? List has modal.

          { path: 'feedback', element: <Feedback /> },

          // Chat
          {
            path: 'chat',
            element: <ChatLayout />,
            children: [
              { path: ':channelId', element: <ChatArea /> }
            ]
          },
        ]
      }
    ]
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  }
]);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <RouterProvider router={router} />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

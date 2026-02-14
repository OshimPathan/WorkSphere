import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
    const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'EMPLOYEE' | 'HR'>('EMPLOYEE');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Note: In a real app, role might be validated against the backend, 
            // or the backend determines role from credentials.
            // For now, we pass the same credentials but the UI visualizes the intent.
            const response = await api.post('/auth/login', { email, password });
            const { token, refreshToken, user } = response.data;

            // Optional: Check if the logged-in user matches the selected role tab
            if (user.role !== selectedRole && user.role !== 'TEAM_LEADER' && !(selectedRole === 'EMPLOYEE' && user.role === 'TEAM_LEADER')) {
                // Soft warning or just accept it? For better UX, let's just log them in 
                // but ideally we should match.
                console.warn(`User logged in as ${user.role} but selected ${selectedRole}`);
            }

            login(token, refreshToken, user);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">WorkSphere</h1>
                    <p className="text-gray-400 mt-2">Welcome back! Please login to your account.</p>
                </div>

                {/* Role Tabs */}
                <div className="flex p-1 bg-gray-700 rounded-lg mb-6">
                    {(['ADMIN', 'EMPLOYEE', 'HR'] as const).map((role) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === role
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {role.charAt(0) + role.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                {error && <div className="p-3 mb-4 text-sm text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">
                            {selectedRole === 'EMPLOYEE' ? 'Employee ID / Company Email' :
                                selectedRole === 'HR' ? 'HR Email' : 'Admin Email'}
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 transition-all"
                            placeholder={selectedRole === 'EMPLOYEE' ? 'emp@worksphere.com' : 'admin@worksphere.com'}
                            required
                        />
                    </div>
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-500 transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Sign In as {selectedRole.charAt(0) + selectedRole.slice(1).toLowerCase()}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-400">
                    Don't have an account? <a href="/signup" className="text-blue-400 hover:text-blue-300">Create one</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

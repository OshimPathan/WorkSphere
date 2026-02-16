import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import type { Ticket } from '../../types/ticket';
import { TicketStatus, Priority } from '../../types/ticket';
import PageHeader from '../../components/PageHeader';
import { Plus, Search, Filter, MessageSquare, Clock, CheckCircle } from 'lucide-react';

const TicketList = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('ALL');

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await api.get('/tickets');
            setTickets(response.data);
        } catch (error) {
            console.error('Failed to fetch tickets', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case TicketStatus.OPEN: return 'bg-blue-100 text-blue-800';
            case TicketStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800';
            case TicketStatus.RESOLVED: return 'bg-green-100 text-green-800';
            case TicketStatus.CLOSED: return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: Priority) => {
        switch (priority) {
            case Priority.CRITICAL: return 'text-red-600 bg-red-50';
            case Priority.HIGH: return 'text-orange-600 bg-orange-50';
            case Priority.MEDIUM: return 'text-blue-600 bg-blue-50';
            case Priority.LOW: return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600';
        }
    };

    const filteredTickets = filterStatus === 'ALL'
        ? tickets
        : tickets.filter(t => t.status === filterStatus);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Support Tickets"
                description="Manage and track support requests and issues."
                action={
                    <button
                        onClick={() => navigate('/tickets/new')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
                    >
                        <Plus size={18} />
                        New Ticket
                    </button>
                }
            />

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search tickets..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter size={18} className="text-gray-400" />
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="ALL">All Status</option>
                        {Object.values(TicketStatus).map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Ticket List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading tickets...</div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <CheckCircle size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                        <p className="text-gray-500 mt-1">There are no tickets matching your criteria.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                onClick={() => navigate(`/tickets/${ticket.id}`)}
                                className="p-4 sm:p-6 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                            >
                                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                    <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className="text-sm text-gray-500">#{ticket.id.slice(0, 8)}</span>
                                        </div>
                                        <h3 className="text-lg font-bold">{ticket.subject}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{ticket.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 shrink-0">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                        <div className="flex items-center gap-1" title="Comments">
                                            <MessageSquare size={16} />
                                            <span>{ticket._count?.comments || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="Created">
                                            <Clock size={16} />
                                            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        {ticket.assignedTo && (
                                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold" title={`Assigned to ${ticket.assignedTo.name}`}>
                                                {ticket.assignedTo.name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketList;

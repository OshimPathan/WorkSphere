import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Ticket, TicketStatus, Priority } from '../../types/ticket';
import { ArrowLeft, Send, User, Clock, MessageSquare } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        name: string;
    };
}

interface ExtendedTicket extends Ticket {
    comments?: Comment[];
}

const TicketDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<ExtendedTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [commentLoading, setCommentLoading] = useState(false);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    const fetchTicket = async () => {
        try {
            const response = await api.get(`/tickets/${id}`);
            setTicket(response.data);
        } catch (error) {
            console.error('Failed to fetch ticket', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setCommentLoading(true);
        try {
            await api.post(`/tickets/${id}/comments`, { content: newComment });
            setNewComment('');
            fetchTicket(); // Refresh to see new comment
        } catch (error) {
            console.error('Failed to add comment', error);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as TicketStatus;
        try {
            await api.put(`/tickets/${id}`, { status: newStatus });
            setTicket(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading ticket details...</div>;
    if (!ticket) return <div className="p-8 text-center text-red-500">Ticket not found</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <button
                onClick={() => navigate('/tickets')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={20} />
                Back to Tickets
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">#{ticket.id.slice(0, 8)}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-gray-100 text-gray-600`}>
                                {ticket.type}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <select
                                value={ticket.status}
                                onChange={handleStatusChange}
                                className="text-sm font-medium border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 border"
                            >
                                {Object.values(TicketStatus).map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{ticket.subject}</h1>
                    <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span>{ticket.createdBy?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">Priority:</span>
                            <span className={`uppercase font-bold text-xs ${ticket.priority === Priority.CRITICAL ? 'text-red-600' :
                                    ticket.priority === Priority.HIGH ? 'text-orange-600' :
                                        'text-gray-600'
                                }`}>
                                {ticket.priority}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50/50 min-h-[100px]">
                    <p className="text-gray-800 whitespace-pre-wrap">{ticket.description}</p>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 font-medium text-gray-900 mb-6">
                    <MessageSquare size={18} />
                    Comments ({ticket.comments?.length || 0})
                </div>

                <div className="space-y-6 mb-8">
                    {ticket.comments?.map((comment) => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 text-sm">
                                {comment.user?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-gray-900 text-sm">{comment.user?.name}</span>
                                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="text-gray-700 bg-gray-50 p-3 rounded-lg rounded-tl-none text-sm leading-relaxed">
                                    {comment.content}
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!ticket.comments || ticket.comments.length === 0) && (
                        <div className="text-center text-gray-400 py-4 italic text-sm">No comments yet.</div>
                    )}
                </div>

                <form onSubmit={handleAddComment} className="flex gap-4 items-start pt-6 border-t border-gray-100">
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a reply..."
                            rows={3}
                            className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-colors border p-3 text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={commentLoading || !newComment.trim()}
                        className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 shadow-sm"
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TicketDetails;

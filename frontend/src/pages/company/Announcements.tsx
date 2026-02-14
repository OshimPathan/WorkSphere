import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Megaphone, Calendar } from 'lucide-react';

const Announcements = () => {
    const [announcements] = useState([
        { id: 1, title: 'Annual Company Retreat 2024', date: '2024-02-14', author: 'HR Dept', category: 'Events', content: 'We are excited to announce our upcoming retreat in Bali! Please check your email for details.' },
        { id: 2, title: 'Q1 All-Hands Meeting', date: '2024-02-10', author: 'CEO Office', category: 'General', content: 'Join us for a review of our Q1 goals and achievements. Lunch will be provided.' },
        { id: 3, title: 'New Health Insurance Policy', date: '2024-02-01', author: 'HR Dept', category: 'Policy', content: 'We have updated our health insurance provider to offer better coverage. Please review the new policy doc.' },
    ]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <PageHeader
                title="Company Announcements"
                description="Stay updated with the latest news and information."
                action={
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                        <Megaphone size={18} />
                        Post Update
                    </button>
                }
            />

            <div className="space-y-4">
                {announcements.map((item) => (
                    <div key={item.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100 uppercase tracking-wide">
                                    {item.category}
                                </span>
                                <span className="text-gray-400 text-xs flex items-center gap-1">
                                    <Calendar size={12} /> {item.date}
                                </span>
                            </div>
                            <span className="text-xs font-medium text-gray-500">Posted by {item.author}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Announcements;

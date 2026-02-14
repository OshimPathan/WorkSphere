import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Calendar, MapPin, Clock, Users } from 'lucide-react';

const Events = () => {
    const [events] = useState([
        { id: 1, title: 'Tech Talk: AI in 2024', date: 'Feb 20, 2024', time: '2:00 PM', location: 'Conference Room A', attendees: 45, type: 'Learning' },
        { id: 2, title: 'Friday Happy Hour', date: 'Feb 23, 2024', time: '5:00 PM', location: 'Rooftop Lounge', attendees: 120, type: 'Social' },
        { id: 3, title: 'Design System Workshop', date: 'Feb 25, 2024', time: '10:00 AM', location: 'Virtual (Zoom)', attendees: 30, type: 'Workshop' },
    ]);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <PageHeader
                title="Company Events"
                description="Upcoming workshops, social gatherings, and meetings."
                action={
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                        <Calendar size={18} />
                        Create Event
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group">
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 relative p-6 flex flex-col justify-end">
                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-bold">
                                {event.type}
                            </div>
                            <h3 className="text-white font-bold text-xl leading-tight group-hover:underline decoration-white/50">{event.title}</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar size={18} className="text-blue-500" />
                                <span className="text-sm font-medium">{event.date}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Clock size={18} className="text-blue-500" />
                                <span className="text-sm">{event.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin size={18} className="text-blue-500" />
                                <span className="text-sm">{event.location}</span>
                            </div>
                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                    <Users size={16} />
                                    <span>{event.attendees} Attending</span>
                                </div>
                                <button className="text-blue-600 text-sm font-bold hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                    RSVP
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;

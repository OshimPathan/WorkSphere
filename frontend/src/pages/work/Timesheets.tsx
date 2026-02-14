import { useState } from 'react';
import PageHeader from '../../components/PageHeader'; // Adjusted import path
import { Clock, Plus, Calendar } from 'lucide-react';

const Timesheets = () => {
    const [entries] = useState([
        { id: 1, date: '2024-02-14', project: 'Website Redesign', task: 'Homepage Layout', hours: 4, description: 'Designed the new hero section.' },
        { id: 2, date: '2024-02-14', project: 'Mobile App', task: 'Bug Fixes', hours: 3.5, description: 'Fixed navigation crash on iOS.' },
        { id: 3, date: '2024-02-13', project: 'Internal Tools', task: 'Database Schema', hours: 8, description: 'Updated user schema.' },
    ]);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <PageHeader
                title="Timesheets"
                description="Log and track your working hours."
                action={
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                        <Plus size={18} />
                        Log Time
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Hours (Week)</p>
                            <p className="text-2xl font-bold text-gray-900">32.5</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Days Worked</p>
                            <p className="text-2xl font-bold text-gray-900">4</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 font-medium text-gray-700">
                    Recent Entries
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white text-gray-500 uppercase text-xs border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Project</th>
                            <th className="p-4 font-semibold">Task</th>
                            <th className="p-4 font-semibold">Description</th>
                            <th className="p-4 font-semibold text-right">Hours</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {entries.map((entry) => (
                            <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-900">{entry.date}</td>
                                <td className="p-4 text-blue-600 font-medium">{entry.project}</td>
                                <td className="p-4 text-gray-700">{entry.task}</td>
                                <td className="p-4 text-gray-500 text-sm">{entry.description}</td>
                                <td className="p-4 text-right font-bold text-gray-900">{entry.hours}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Timesheets;

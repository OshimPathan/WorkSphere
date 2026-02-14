import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Calendar as CalendarIcon, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Attendance = () => {
    // Mock data for a calendar view (simplified as a list for now)
    const [records] = useState([
        { id: 1, date: '2024-02-14', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', total: '9h 00m' },
        { id: 2, date: '2024-02-13', checkIn: '09:15 AM', checkOut: '06:10 PM', status: 'Late', total: '8h 55m' },
        { id: 3, date: '2024-02-12', checkIn: '08:55 AM', checkOut: '05:55 PM', status: 'Present', total: '9h 00m' },
        { id: 4, date: '2024-02-11', checkIn: '-', checkOut: '-', status: 'Weekend', total: '-' },
        { id: 5, date: '2024-02-10', checkIn: '-', checkOut: '-', status: 'Weekend', total: '-' },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Present': return 'bg-green-100 text-green-700 border-green-200';
            case 'Late': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Absent': return 'bg-red-100 text-red-700 border-red-200';
            case 'Weekend': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <PageHeader
                title="Attendance"
                description="View your daily check-in and check-out records."
                action={
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm font-medium">
                        <Clock size={18} />
                        Check In
                    </button> // In a real app, this would toggle based on current state
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Present</p>
                        <p className="text-xl font-bold">18</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg"><Clock size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Late</p>
                        <p className="text-xl font-bold">2</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg"><XCircle size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Absent</p>
                        <p className="text-xl font-bold">0</p>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><AlertCircle size={20} /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">Leaves</p>
                        <p className="text-xl font-bold">1</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">February 2024</h3>
                    <div className="flex gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded"><CalendarIcon size={16} /></button>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white text-gray-500 uppercase text-xs border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Check In</th>
                            <th className="p-4 font-semibold">Check Out</th>
                            <th className="p-4 font-semibold">Total Hours</th>
                            <th className="p-4 font-semibold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {records.map((record) => (
                            <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-900">{record.date}</td>
                                <td className="p-4 text-gray-600">{record.checkIn}</td>
                                <td className="p-4 text-gray-600">{record.checkOut}</td>
                                <td className="p-4 text-blue-600 font-medium">{record.total}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(record.status)}`}>
                                        {record.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendance;

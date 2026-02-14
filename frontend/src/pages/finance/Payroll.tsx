import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Download, FileText, CheckCircle } from 'lucide-react';

const Payroll = () => {
    const [payslips] = useState([
        { id: 1, month: 'January 2024', date: '2024-01-31', amount: '$4,500.00', status: 'Paid', ref: 'PAY-2024-001' },
        { id: 2, month: 'December 2023', date: '2023-12-31', amount: '$4,500.00', status: 'Paid', ref: 'PAY-2023-012' },
        { id: 3, month: 'November 2023', date: '2023-11-30', amount: '$4,500.00', status: 'Paid', ref: 'PAY-2023-011' },
    ]);

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <PageHeader
                title="Payroll"
                description="View and download your monthly payslips."
            />

            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl flex justify-between items-center">
                <div>
                    <p className="text-blue-100 text-sm uppercase tracking-wider font-semibold">Next Payday</p>
                    <h2 className="text-3xl font-bold mt-1">February 28, 2024</h2>
                </div>
                <div className="text-right">
                    <p className="text-blue-100 text-sm uppercase tracking-wider font-semibold">Estimated Net Pay</p>
                    <h2 className="text-3xl font-bold mt-1">$4,500.00</h2>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2 font-medium text-gray-700">
                    <FileText size={18} /> Payslip History
                </div>
                <div className="divide-y divide-gray-100">
                    {payslips.map((slip) => (
                        <div key={slip.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{slip.month}</h3>
                                    <p className="text-sm text-gray-500">Ref: {slip.ref} • Paid on {slip.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">{slip.amount}</p>
                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                        <CheckCircle size={10} /> {slip.status}
                                    </span>
                                </div>
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download PDF">
                                    <Download size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Payroll;

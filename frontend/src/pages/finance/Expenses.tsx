import { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { Plus, Receipt, DollarSign, ListFilter } from 'lucide-react';

const Expenses = () => {
    const [expenses] = useState([
        { id: 1, date: '2024-02-10', category: 'Travel', merchant: 'Uber', amount: 24.50, status: 'Pending', description: 'Client meeting transport' },
        { id: 2, date: '2024-02-08', category: 'Meals', merchant: 'Starbucks', amount: 12.00, status: 'Approved', description: 'Team coffee' },
        { id: 3, date: '2024-01-25', category: 'Software', merchant: 'Adobe Creative Cloud', amount: 59.99, status: 'Reimbursed', description: 'Monthly subscription' },
    ]);

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Approved': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Reimbursed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <PageHeader
                title="Expenses"
                description="Submit and track your reimbursement claims."
                action={
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                        <Plus size={18} />
                        New Claim
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
                            <Receipt size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pending Approval</p>
                            <p className="text-2xl font-bold text-gray-900">$24.50</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Reimbursed (YTD)</p>
                            <p className="text-2xl font-bold text-gray-900">$532.00</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h3 className="font-medium text-gray-700">Expense History</h3>
                    <button className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm">
                        <ListFilter size={16} /> Filter
                    </button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-white text-gray-500 uppercase text-xs border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Category</th>
                            <th className="p-4 font-semibold">Merchant</th>
                            <th className="p-4 font-semibold">Description</th>
                            <th className="p-4 font-semibold">Amount</th>
                            <th className="p-4 font-semibold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {expenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 text-gray-900">{expense.date}</td>
                                <td className="p-4">
                                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 font-medium">
                                        {expense.category}
                                    </span>
                                </td>
                                <td className="p-4 font-medium text-gray-800">{expense.merchant}</td>
                                <td className="p-4 text-gray-500 text-sm">{expense.description}</td>
                                <td className="p-4 font-bold text-gray-900">${expense.amount.toFixed(2)}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusStyle(expense.status)}`}>
                                        {expense.status}
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

export default Expenses;

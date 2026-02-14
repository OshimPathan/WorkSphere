import PageHeader from '../../components/PageHeader';
import { LifeBuoy, Monitor, Key, Wifi, HelpCircle } from 'lucide-react';

const Helpdesk = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <PageHeader
                title="IT Helpdesk"
                description="Get support for technical issues and access requests."
                action={
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                        <LifeBuoy size={18} />
                        Raise Ticket
                    </button>
                }
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 transition-colors cursor-pointer text-center group">
                    <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Monitor size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">Hardware</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 transition-colors cursor-pointer text-center group">
                    <div className="w-12 h-12 mx-auto bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Key size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">Access</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 transition-colors cursor-pointer text-center group">
                    <div className="w-12 h-12 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Wifi size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">Network</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:border-blue-300 transition-colors cursor-pointer text-center group">
                    <div className="w-12 h-12 mx-auto bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <HelpCircle size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900">General</h3>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 font-medium text-gray-700">
                    My Tickets
                </div>
                <div className="p-8 text-center text-gray-500">
                    <div className="inline-block p-4 bg-gray-50 rounded-full mb-3">
                        <CheckCircle size={32} className="text-gray-300" />
                    </div>
                    <p>No open tickets. You're all good!</p>
                </div>
            </div>
        </div>
    );
};

// Helper for empty state
import { CheckCircle } from 'lucide-react';

export default Helpdesk;

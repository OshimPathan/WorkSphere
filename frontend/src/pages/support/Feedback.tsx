import PageHeader from '../../components/PageHeader';
import { MessageSquare, Send } from 'lucide-react';

const Feedback = () => {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <PageHeader
                title="Feedback"
                description="Help us improve WorkSphere. Your feedback is anonymous."
            />

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2.5 border">
                            <option>General Suggestion</option>
                            <option>Bug Report</option>
                            <option>Feature Request</option>
                            <option>UI/UX Improvement</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Your Feedback</label>
                        <textarea
                            rows={6}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                            placeholder="Tell us what you think..."
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MessageSquare size={16} />
                            <span>We read every message.</span>
                        </div>
                        <button type="button" className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium">
                            <Send size={18} />
                            Submit Feedback
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Feedback;

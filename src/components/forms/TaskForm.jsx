import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Calendar, AlignLeft, Flag, ChevronDown } from 'lucide-react';

const TaskForm = ({ onClose, onSuccess, createApi, updateApi, initialData }) => {
    const [formData, setFormData] = useState({
        subject: '',
        status: 'Not Started',
        priority: 'Normal',
        dueDate: '',
        description: '',
        relatedSfId: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData({
                subject: initialData.Subject || initialData.subject || '',
                status: initialData.Status || initialData.status || 'Not Started',
                priority: initialData.Priority || initialData.priority || 'Normal',
                dueDate: (initialData.DueDate || initialData.dueDate || '').split('T')[0],
                description: initialData.Description || initialData.description || '',
                relatedSfId: initialData.RelatedSfId || initialData.relatedSfId || ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (initialData && updateApi) {
                const id = initialData.Id || initialData.sfId || initialData._id;
                await updateApi(id, formData);
            } else {
                await createApi(formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save task');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-lg bg-[#0F1218] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{initialData ? 'Edit Task' : 'New Task'}</h3>
                        <p className="text-xs text-slate-400 mt-1">{initialData ? 'Update task details' : 'Assign a new work item'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:rotate-90 duration-200"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-300 text-sm animate-shake">
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Subject</label>
                            <div className="relative group">
                                <input
                                    required
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="e.g. Call client"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-medium"
                                />
                                <CheckSquare size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Due Date</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="date"
                                        name="dueDate"
                                        value={formData.dueDate}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-medium [color-scheme:dark]"
                                    />
                                    <Calendar size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Priority</label>
                                <div className="relative group">
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer font-medium [&>option]:bg-[#0F1218] [&>option]:text-white"
                                    >
                                        <option>High</option>
                                        <option>Normal</option>
                                        <option>Low</option>
                                    </select>
                                    <Flag size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Status</label>
                            <div className="relative group">
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer font-medium [&>option]:bg-[#0F1218] [&>option]:text-white"
                                >
                                    <option>Not Started</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                    <option>Waiting on someone else</option>
                                    <option>Deferred</option>
                                </select>
                                <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none group-hover:text-white transition-colors" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                initialData ? 'Save Changes' : 'Create Task'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskForm;

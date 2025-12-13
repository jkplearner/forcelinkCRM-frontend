import React, { useState, useEffect } from 'react';
import { X, AlignLeft, Type } from 'lucide-react';
import Autocomplete from '../common/Autocomplete';
import { getAccounts } from '../../api/accounts';

const NoteForm = ({ onClose, onSuccess, createApi }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        relatedSfId: ''
    });
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingAccounts, setFetchingAccounts] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadAccounts = async () => {
            try {
                const res = await getAccounts();
                const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setAccounts(data);
            } catch (err) {
                console.error("Failed to load accounts for selector", err);
            } finally {
                setFetchingAccounts(false);
            }
        };
        loadAccounts();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRelatedSelect = (id) => {
        setFormData({ ...formData, relatedSfId: id });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.relatedSfId) {
            setError("Please select a valid Account from the list.");
            setLoading(false);
            return;
        }

        try {
            await createApi(formData);
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to create note');
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
                        <h3 className="text-xl font-bold text-white tracking-tight">New Note</h3>
                        <p className="text-xs text-slate-400 mt-1">Attach a note to an account</p>
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
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Title</label>
                            <div className="relative group">
                                <input
                                    required
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Enter note title..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-medium"
                                />
                                <Type size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Autocomplete
                                label="Related Account"
                                placeholder={fetchingAccounts ? "Loading accounts..." : "Search Account Name..."}
                                options={accounts}
                                onSelect={handleRelatedSelect}
                                required={true}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Content</label>
                            <div className="relative group">
                                <textarea
                                    required
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    rows={5}
                                    placeholder="Write your note content here..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600 font-medium resize-none leading-relaxed"
                                />
                                <AlignLeft size={18} className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
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
                                'Save Note'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NoteForm;

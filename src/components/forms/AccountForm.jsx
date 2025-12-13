import React, { useState } from 'react';
import { X, Globe, Phone, Building, Briefcase, ChevronDown, Users, DollarSign, Activity, FileText } from 'lucide-react';

const AccountForm = ({ onClose, onSuccess, createApi, updateApi, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        website: '',
        type: 'Prospect',
        industry: 'Technology',
        ownership: 'Private',
        rating: 'Hot',
        annualRevenue: '',
        numberOfEmployees: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.Name || initialData.name || '',
                phone: initialData.Phone || initialData.phone || '',
                website: initialData.Website || initialData.website || '',
                type: initialData.Type || initialData.type || 'Prospect',
                industry: initialData.Industry || initialData.industry || 'Technology',
                ownership: initialData.Ownership || initialData.ownership || 'Private',
                rating: initialData.Rating || initialData.rating || 'Hot',
                annualRevenue: initialData.AnnualRevenue || initialData.annualRevenue || '',
                numberOfEmployees: initialData.NumberOfEmployees || initialData.numberOfEmployees || ''
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
            setError(err.response?.data?.message || err.message || 'Failed to save account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-[#0F1218] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100 max-h-[90vh]">
                <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{initialData ? 'Edit Account' : 'New Account'}</h3>
                        <p className="text-xs text-slate-400 mt-1">{initialData ? 'Update account details' : 'Add a new business account'}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:rotate-90 duration-200">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-300 text-sm animate-shake">
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* Name & Phone */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Account Name *</label>
                                <div className="relative group">
                                    <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Acme Corp" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <Building size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Phone</label>
                                <div className="relative group">
                                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 000-0000" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <Phone size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                        </div>

                        {/* Website & Industry */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Website</label>
                                <div className="relative group">
                                    <input name="website" value={formData.website} onChange={handleChange} placeholder="www.example.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <Globe size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Industry</label>
                                <div className="relative group">
                                    <select name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option>Agriculture</option>
                                        <option>Technology</option>
                                        <option>Finance</option>
                                        <option>Education</option>
                                        <option>Healthcare</option>
                                        <option>Manufacturing</option>
                                        <option>Retail</option>
                                        <option>Other</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Revenue & Employees */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Annual Revenue</label>
                                <div className="relative group">
                                    <input type="number" name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <DollarSign size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Employees</label>
                                <div className="relative group">
                                    <input type="number" name="numberOfEmployees" value={formData.numberOfEmployees} onChange={handleChange} placeholder="0" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <Users size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                        </div>

                        {/* Type, Ownership, Rating */}
                        <div className="grid grid-cols-3 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Type</label>
                                <div className="relative group">
                                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-8 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium text-sm [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option>Prospect</option>
                                        <option>Customer - Direct</option>
                                        <option>Partner</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Ownership</label>
                                <div className="relative group">
                                    <select name="ownership" value={formData.ownership} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-8 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium text-sm [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option>Private</option>
                                        <option>Public</option>
                                        <option>Subsidiary</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Rating</label>
                                <div className="relative group">
                                    <select name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-3 pr-8 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium text-sm [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option>Hot</option>
                                        <option>Warm</option>
                                        <option>Cold</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all font-medium">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2">
                            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (initialData ? 'Save Changes' : 'Create Account')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountForm;

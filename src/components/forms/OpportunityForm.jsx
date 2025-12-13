import React, { useState } from 'react';
import { X, DollarSign, Calendar, MapPin, Briefcase, ChevronDown, CheckCircle } from 'lucide-react';

const OpportunityForm = ({ onClose, onSuccess, createApi, updateApi, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        stage: 'Prospecting',
        closeDate: '',
        region: 'North',
        leadSource: 'Web',
        type: 'New Customer',
        nextStep: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.Name || initialData.name || '',
                amount: initialData.Amount || initialData.amount || '',
                stage: initialData.StageName || initialData.stageName || 'Prospecting',
                closeDate: (initialData.CloseDate || initialData.closeDate || '').split('T')[0],
                region: initialData.Region__c || initialData.Region || initialData.region || initialData.region__c || 'North',
                leadSource: initialData.LeadSource || initialData.leadSource || 'Web',
                type: initialData.Type || initialData.type || 'New Customer',
                nextStep: initialData.NextStep || initialData.nextStep || ''
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
            const submissionData = { ...formData, amount: Number(formData.amount) };
            if (initialData && updateApi) {
                const id = initialData.Id || initialData.sfId || initialData._id;
                await updateApi(id, submissionData);
            } else {
                await createApi(submissionData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save opportunity');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-[#0F1218] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100 max-h-[90vh]">
                <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{initialData ? 'Edit Opportunity' : 'New Opportunity'}</h3>
                        <p className="text-xs text-slate-400 mt-1">{initialData ? 'Update opportunity details' : 'Create a new deal pipeline'}</p>
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
                        {/* Name & Type */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Opportunity Name *</label>
                                <div className="relative group">
                                    <input required name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Q4 Deal" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <Briefcase size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Type</label>
                                <div className="relative group">
                                    <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option>New Customer</option>
                                        <option>Existing Customer - Upgrade</option>
                                        <option>Existing Customer - Replacement</option>
                                        <option>Existing Customer - Downgrade</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Amount & Date */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Amount</label>
                                <div className="relative group">
                                    <input required type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <DollarSign size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Close Date *</label>
                                <div className="relative group">
                                    <input required type="date" name="closeDate" value={formData.closeDate} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium [color-scheme:dark]" />
                                    <Calendar size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                        </div>

                        {/* Stage & Region */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Stage *</label>
                                <div className="relative group">
                                    <select name="stage" value={formData.stage} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option value="Prospecting">Prospecting</option>
                                        <option value="Qualification">Qualification</option>
                                        <option value="Needs Analysis">Needs Analysis</option>
                                        <option value="Value Proposition">Value Proposition</option>
                                        <option value="Id. Decision Makers">Id. Decision Makers</option>
                                        <option value="Perception Analysis">Perception Analysis</option>
                                        <option value="Proposal/Price Quote">Proposal/Price Quote</option>
                                        <option value="Negotiation/Review">Negotiation/Review</option>
                                        <option value="Closed Won">Closed Won</option>
                                        <option value="Closed Lost">Closed Lost</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Region *</label>
                                <div className="relative group">
                                    <select name="region" value={formData.region} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option value="North">North</option>
                                        <option value="North-East">North-East</option>
                                        <option value="South">South</option>
                                        <option value="South-West">South-West</option>
                                        <option value="East">East</option>
                                        <option value="West">West</option>
                                    </select>
                                    <MapPin size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Next Step */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Next Step</label>
                            <div className="relative group">
                                <input name="nextStep" value={formData.nextStep} onChange={handleChange} placeholder="e.g. Call John" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                <CheckCircle size={18} className="absolute left-3 top-3.5 text-slate-500" />
                            </div>
                        </div>

                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all font-medium">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2">
                            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (initialData ? 'Save Changes' : 'Create Opportunity')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OpportunityForm;

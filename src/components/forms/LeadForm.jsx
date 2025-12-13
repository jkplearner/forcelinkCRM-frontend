import React, { useState } from 'react';
import { X, User, Building, Mail, Briefcase, ChevronDown, Phone, Globe, DollarSign, Users } from 'lucide-react';

const LeadForm = ({ onClose, onSuccess, createApi, updateApi, initialData }) => {
    const [formData, setFormData] = useState({
        salutation: 'Mr.',
        firstName: '', // Required by Frontend
        lastName: '',  // Required
        company: '',   // Required
        status: 'Open - Not Contacted',
        email: '',
        phone: '',
        mobilePhone: '',
        website: '',
        industry: '',
        leadSource: 'Web',
        rating: 'Warm',
        annualRevenue: '',
        numberOfEmployees: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    React.useEffect(() => {
        if (initialData) {
            setFormData({
                salutation: initialData.Salutation || initialData.salutation || 'Mr.',
                firstName: initialData.FirstName || initialData.firstName || '',
                lastName: initialData.LastName || initialData.lastName || '',
                company: initialData.Company || initialData.company || '',
                status: initialData.Status || initialData.status || 'Open - Not Contacted',
                email: initialData.Email || initialData.email || '',
                phone: initialData.Phone || initialData.phone || '',
                mobilePhone: initialData.MobilePhone || initialData.mobilePhone || '',
                website: initialData.Website || initialData.website || '',
                industry: initialData.Industry || initialData.industry || '',
                leadSource: initialData.LeadSource || initialData.leadSource || 'Web',
                rating: initialData.Rating || initialData.rating || 'Warm',
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
                // Determine ID (Salesforce uses Id or sfId)
                const id = initialData.Id || initialData.sfId || initialData._id;
                await updateApi(id, formData);
            } else {
                await createApi(formData);
            }
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to save lead');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-[#0F1218] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col transform transition-all scale-100 max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{initialData ? 'Edit Lead' : 'New Lead'}</h3>
                        <p className="text-xs text-slate-400 mt-1">{initialData ? 'Update lead details' : 'Capture a new potential customer'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all hover:rotate-90 duration-200"
                    >
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
                        {/* Name Section */}
                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-3 space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Salutation</label>
                                <div className="relative group">
                                    <select name="salutation" value={formData.salutation} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500/50 appearance-none font-medium [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option>Mr.</option>
                                        <option>Ms.</option>
                                        <option>Mrs.</option>
                                        <option>Dr.</option>
                                        <option>Prof.</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="col-span-4 space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">First Name *</label>
                                <input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                            </div>
                            <div className="col-span-5 space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Last Name *</label>
                                <input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                            </div>
                        </div>

                        {/* Company & Status */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Company *</label>
                                <div className="relative group">
                                    <input required name="company" value={formData.company} onChange={handleChange} placeholder="Acme Inc" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <Building size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Status *</label>
                                <div className="relative group">
                                    <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option>Open - Not Contacted</option>
                                        <option>Working - Contacted</option>
                                        <option>Closed - Converted</option>
                                        <option>Closed - Not Converted</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                                <div className="relative group">
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <Mail size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Phone</label>
                                <div className="relative group">
                                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <Phone size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Industry</label>
                                <div className="relative group">
                                    <select name="industry" value={formData.industry} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option value="">Select Industry...</option>
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
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Annual Revenue</label>
                                <div className="relative group">
                                    <input type="number" name="annualRevenue" value={formData.annualRevenue} onChange={handleChange} placeholder="0.00" className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-indigo-500 focus:bg-white/10 font-medium" />
                                    <DollarSign size={18} className="absolute left-3 top-3.5 text-slate-500" />
                                </div>
                            </div>
                        </div>

                        {/* Source & Rating */}
                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Lead Source</label>
                                <div className="relative group">
                                    <select name="leadSource" value={formData.leadSource} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option>Web</option>
                                        <option>Phone Inquiry</option>
                                        <option>Partner Referral</option>
                                        <option>Purchased List</option>
                                        <option>Other</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Rating</label>
                                <div className="relative group">
                                    <select name="rating" value={formData.rating} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-white focus:border-indigo-500 focus:bg-white/10 appearance-none font-medium [&>option]:bg-[#0F1218] [&>option]:text-white">
                                        <option>Hot</option>
                                        <option>Warm</option>
                                        <option>Cold</option>
                                    </select>
                                    <ChevronDown size={18} className="absolute right-3 top-3.5 text-slate-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-all font-medium">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 hover:shadow-lg transition-all font-medium flex items-center justify-center gap-2">
                            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (initialData ? 'Save Changes' : 'Create Lead')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LeadForm;

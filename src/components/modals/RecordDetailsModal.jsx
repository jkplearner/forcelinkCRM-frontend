import React from 'react';
import { X } from 'lucide-react';

const RecordDetailsModal = ({ record, type, onClose }) => {
    if (!record) return null;

    const keys = Object.keys(record);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-2xl bg-[#0F1218] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="px-8 py-6 border-b border-white/10 bg-white/5 flex items-start justify-between shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">
                            {record.Name || record.name || record.Title || record.subject || record.Subject || "Record Details"}
                        </h2>
                        <div className="flex items-center gap-2 text-sm text-slate-400 capitalize">
                            <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                {type}
                            </span>
                            <span>•</span>
                            <span className="font-mono opacity-70">{record.Id || record.sfId || record._id}</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {keys.map((key) => {
                            const value = record[key];
                            if (typeof value === 'object' && value !== null) return null;
                            if (["_id", "sfId", "attributes", "_owner", "__v"].includes(key)) return null;

                            const formatKey = (k) => k
                                .replace(/__c$/, "")
                                .replace(/([A-Z])/g, " $1")
                                .replace(/^./, str => str.toUpperCase())
                                .trim();

                            return (
                                <div key={key} className="space-y-1">
                                    <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                                        {formatKey(key)}
                                    </h4>
                                    <p className="text-slate-200 font-medium break-words">
                                        {value === null || value === undefined || value === "" ?
                                            <span className="text-slate-600 italic">Empty</span> :
                                            String(value)
                                        }
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-black/20 shrink-0 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecordDetailsModal;

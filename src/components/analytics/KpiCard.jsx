import React from 'react';

const KpiCard = ({ title, value, icon: Icon, delay = 0 }) => {
    return (
        <div
            className="p-6 rounded-3xl border border-white/10 bg-[#0F1218] flex items-center gap-5 hover:border-indigo-500/30 transition-all duration-300 group hover:shadow-lg hover:shadow-indigo-500/10 animate-fade-in-up"
            style={{ animationDelay: `${delay}s` }}
        >
            <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                <Icon size={28} />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-400 mb-1 tracking-wide uppercase">{title}</p>
                <h3 className="text-3xl font-bold text-white group-hover:text-indigo-100 transition-colors">
                    {value}
                </h3>
            </div>
        </div>
    );
};

export default KpiCard;

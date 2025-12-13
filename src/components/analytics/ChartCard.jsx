import React from 'react';

const ChartCard = ({ title, children, delay = 0.1 }) => {
    return (
        <div
            className="p-6 rounded-3xl border border-white/10 bg-[#0F1218] flex flex-col h-full animate-fade-in-up hover:border-white/20 transition-colors"
            style={{ animationDelay: `${delay}s` }}
        >
            <h3 className="text-lg font-semibold text-white mb-6 pl-2 border-l-4 border-indigo-500">{title}</h3>
            <div className="flex-1 w-full min-h-[300px] min-w-0">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;

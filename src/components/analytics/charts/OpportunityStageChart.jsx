import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const OpportunityStageChart = ({ data }) => {
    // Expect data: [{ stage: 'Prospecting', count: 5 }, ...]

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1A1F2C] border border-white/10 p-3 rounded-xl shadow-xl">
                    <p className="text-white font-medium mb-1">{label}</p>
                    <p className="text-indigo-400">{`Count: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return <div className="h-full flex items-center justify-center text-slate-500 italic">No opportunity data</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                layout="vertical" // Horizontal bars for better readability of stage names
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                    dataKey="stage"
                    type="category"
                    width={100}
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="count" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20}>
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${230 + index * 10}, 80%, 60%)`} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default OpportunityStageChart;

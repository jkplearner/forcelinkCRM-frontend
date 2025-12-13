import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366f1', '#eab308', '#ef4444', '#cbd5e1']; // Indigo (Warm), Yellow (Hot), Red (Cold), Slate (Unknown)

const LeadStatusChart = ({ data }) => {
    // Expect data format: [{ name: 'Warm', value: 10 }, ...]

    // Custom Tooltip
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1A1F2C] border border-white/10 p-3 rounded-xl shadow-xl">
                    <p className="text-white font-medium">{`${payload[0].name} : ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return <div className="h-full flex items-center justify-center text-slate-500 italic">No lead data available</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-300 ml-2">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default LeadStatusChart;

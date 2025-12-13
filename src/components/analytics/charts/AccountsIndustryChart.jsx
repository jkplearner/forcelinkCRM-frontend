import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Specific palette for industries
const COLORS = ['#22d3ee', '#818cf8', '#c084fc', '#f472b6', '#34d399', '#fbbf24', '#94a3b8'];

const AccountsIndustryChart = ({ data }) => {
    // Expect: [{ name: 'Technology', value: 15 }, ...]

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#1A1F2C] border border-white/10 p-3 rounded-xl shadow-xl">
                    <p className="text-white font-medium">{`${payload[0].name}`}</p>
                    <p className="text-slate-300">{`${payload[0].value} Accounts`}</p>
                </div>
            );
        }
        return null;
    };

    if (!data || data.length === 0) {
        return <div className="h-full flex items-center justify-center text-slate-500 italic">No account data available</div>;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="#0F1218" strokeWidth={2} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    formatter={(value) => <span className="text-slate-400 text-xs ml-1">{value}</span>}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default AccountsIndustryChart;

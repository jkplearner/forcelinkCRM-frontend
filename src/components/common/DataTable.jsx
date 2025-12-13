import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';


const DataTable = ({ data, onRowClick, onEdit, onDelete }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500">
                No data available.
            </div>
        );
    }

    // Get table headers from the first item, excluding 'attributes' and taking the first 8
    const headers = Object.keys(data[0])
        .filter(key => key !== 'attributes')
        .slice(0, 8);

    return (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 custom-scrollbar overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                    <thead className="text-slate-500 border-b border-white/10">
                        <tr>
                            {headers.map((key) => (
                                <th key={key} className="py-3 pr-4 capitalize font-medium tracking-wide">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </th>
                            ))}
                            {(onEdit || onDelete) && <th className="py-3 pr-4 font-medium tracking-wide text-right">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr
                                key={idx}
                                onClick={() => onRowClick && onRowClick(row)}
                                className={`border-b border-white/5 hover:bg-white/5 transition-colors group ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {headers.map((key, i) => (
                                    <td key={i} className="py-3 pr-4 text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">
                                        {typeof row[key] === 'object' && row[key] !== null
                                            ? JSON.stringify(row[key])
                                            : String(row[key] || "")}
                                    </td>
                                ))}
                                {(onEdit || onDelete) && (
                                    <td className="py-3 pr-4 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            {onEdit && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEdit(row); }}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-indigo-400 transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            )}
                                            {onDelete && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDelete(row); }}
                                                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-red-400 transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;

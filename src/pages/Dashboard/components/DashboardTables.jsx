import React from 'react';
import DataTable from "../../../components/common/DataTable";

const DashboardTables = ({
    mode,
    data,
    loading,
    error,
    onRowClick,
    onEdit,
    onDelete
}) => {

    // 1. Loading State
    if (loading) {
        return (
            <div className="flex h-64 w-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-slate-500 text-sm animate-pulse">Loading {mode}...</p>
                </div>
            </div>
        );
    }

    // 2. Error State
    if (error) {
        return (
            <div className="text-center py-20 text-red-400 border border-red-500/10 bg-red-500/5 rounded-xl mx-auto max-w-lg">
                <p className="font-semibold mb-1">Error Loading Data</p>
                <p className="text-sm opacity-80">{error}</p>
            </div>
        );
    }

    // 3. Empty State
    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-white/10 rounded-2xl bg-white/5 mx-auto max-w-4xl text-center p-8">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-500">
                    <span className="text-2xl opacity-50">∅</span>
                </div>
                <h3 className="text-lg font-medium text-white mb-1 capitalize">No {mode} found</h3>
                <p className="text-slate-400 text-sm max-w-xs">
                    You haven't created any {mode} yet. Click the "New" button to get started.
                </p>
            </div>
        );
    }

    // 4. Data State
    return (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h1 className="text-2xl font-bold mb-6 text-white capitalize hidden">{mode} List</h1>
            <DataTable
                data={data}
                onRowClick={onRowClick}
                onEdit={mode !== 'notes' ? onEdit : undefined}
                onDelete={onDelete}
            />
        </div>
    );
};

export default DashboardTables;

import React, { useEffect, useRef } from 'react';
import { X, Trash2, Bell } from 'lucide-react';

const NotificationPanel = ({ notifications, onClose, onClearAll, onMarkRead }) => {
    const formatTime = (timestamp) => {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        const hours = Math.floor(mins / 60);
        const days = Math.floor(hours / 24);

        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="absolute top-16 right-6 w-96 bg-[#0F1218]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[60] flex flex-col animate-fade-in-up overflow-hidden">
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-2">
                    <Bell size={16} className="text-indigo-400" />
                    <h3 className="font-semibold text-white">Notifications</h3>
                    <span className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">
                        {notifications.length}
                    </span>
                </div>
                <div className="flex gap-2">
                    {notifications.length > 0 && (
                        <button
                            onClick={onClearAll}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Clear all"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500">
                        <Bell size={32} className="mb-3 opacity-20" />
                        <p className="text-sm">No new notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.map((note) => (
                            <div
                                key={note.id}
                                className={`p-4 hover:bg-white/5 transition-colors ${!note.read ? 'bg-indigo-500/5' : ''}`}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 space-y-1">
                                        <h4 className={`text-sm font-medium ${!note.read ? 'text-indigo-300' : 'text-slate-200'}`}>
                                            {note.title}
                                        </h4>
                                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                            {note.message}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium pt-1">
                                            {formatTime(note.timestamp)}
                                        </p>
                                    </div>
                                    {!note.read && (
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0 animate-pulse" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-2 border-t border-white/10 bg-white/5 text-center">
                    <button
                        onClick={onMarkRead}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-medium py-1"
                    >
                        Mark all as read
                    </button>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;

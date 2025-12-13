import React, { useState, useEffect } from "react";
import {
    LayoutDashboard,
    Users,
    Briefcase,
    Target,
    CheckSquare,
    StickyNote,
    Bot,
    Bell,
    Search,
    Menu,
    X,
    LogOut,
    Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DotGrid from "../../components/ui/DotGrid";

// API Imports
import { getLeads, createLead, updateLead, deleteLead } from "../../api/leads";
import { getAccounts, createAccount, updateAccount, deleteAccount } from "../../api/accounts";
import { getOpportunities, createOpportunity, updateOpportunity, deleteOpportunity } from "../../api/opportunities";
import { getTasks, createTask, updateTask, deleteTask } from "../../api/tasks";
import { getNotes, createNote, deleteNote } from "../../api/notes";

// Analytics Components
import KpiCard from "../../components/analytics/KpiCard";
import ChartCard from "../../components/analytics/ChartCard";
import LeadStatusChart from "../../components/analytics/charts/LeadStatusChart";
import OpportunityStageChart from "../../components/analytics/charts/OpportunityStageChart";
import RevenueTimelineChart from "../../components/analytics/charts/RevenueTimelineChart";
import AccountsIndustryChart from "../../components/analytics/charts/AccountsIndustryChart";

// Component Imports
import DataTable from "../../components/common/DataTable";
import LeadForm from "../../components/forms/LeadForm";
import AccountForm from "../../components/forms/AccountForm";
import OpportunityForm from "../../components/forms/OpportunityForm";
import TaskForm from "../../components/forms/TaskForm";
import NoteForm from "../../components/forms/NoteForm";
import RecordDetailsModal from "../../components/modals/RecordDetailsModal";
import NotificationPanel from "../../components/notifications/NotificationPanel";
import AiAssistant from "../../components/ai/AiAssistant";

export default function Dashboard() {
    const [mode, setMode] = useState("dashboard");
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    // Data State
    const [data, setData] = useState([]);
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");

    // Analytics State
    const [analytics, setAnalytics] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null); // New state for editing
    const [selectedRecord, setSelectedRecord] = useState(null); // For Details view
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    // Track sent reminders to prevent duplicates
    const sentReminders = React.useRef(new Set());
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Check auth on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Sidebar toggles
    const toggleUserMenu = () => {
        if (!showUserMenu) setShowNotifications(false);
        setShowUserMenu(!showUserMenu);
    };

    const toggleNotifications = () => {
        if (!showNotifications) setShowUserMenu(false);
        setShowNotifications(!showNotifications);
    };

    const closeAllMenus = () => {
        setShowUserMenu(false);
        setShowNotifications(false);
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    // ---------------------------------------------------
    // HELPERS
    // ---------------------------------------------------
    const getField = (obj, ...keys) =>
        keys.map(k => obj[k]).find(v => v !== undefined && v !== null);

    const normalizeData = (res) =>
        Array.isArray(res.data) ? res.data : (res.data?.data || []);
    // ---------------------------------------------------
    // NOTIFICATION HELPERS
    // ---------------------------------------------------
    const loadNotifications = () => {
        try {
            const stored = localStorage.getItem("notifications");
            if (stored) setNotifications(JSON.parse(stored));
        } catch (e) {
            console.error("Failed to load notifications", e);
        }
    };

    const saveNotifications = (list) => {
        setNotifications(list);
        localStorage.setItem("notifications", JSON.stringify(list));
    };

    const addNotification = (obj) => {
        const newNote = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            read: false,
            ...obj
        };
        saveNotifications([newNote, ...notifications]);
    };

    const markAllNotificationsRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        saveNotifications(updated);
    };

    const clearNotifications = () => saveNotifications([]);

    const checkTaskDueReminders = (tasks) => {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        tasks.forEach(task => {
            const dateStr = task.DueDate || task.dueDate;
            const subject = task.Subject || task.subject || 'Task';
            const taskId = task.Id || task.sfId || task._id;

            if (!dateStr || !taskId) return;

            const dueTime = new Date(dateStr).getTime();
            const diff = dueTime - now;

            // Generate a unique key for this specific alert
            // e.g. "task_123_due_soon"
            const dueKey = `${taskId}_due_soon`;
            const overdueKey = `${taskId}_overdue`;

            // Due Soon (< 24h)
            if (diff > 0 && diff < oneDay) {
                if (!sentReminders.current.has(dueKey)) {
                    addNotification({ type: 'task_due_soon', title: 'Task Due Soon', message: `${subject} is due soon.` });
                    sentReminders.current.add(dueKey); // Mark as sent
                }
            }
            // Overdue
            else if (diff < 0) {
                if (!sentReminders.current.has(overdueKey)) {
                    addNotification({ type: 'task_overdue', title: 'Task Overdue', message: `${subject} is overdue!` });
                    sentReminders.current.add(overdueKey); // Mark as sent
                }
            }
        });
    };

    // Initialize
    useEffect(() => { loadNotifications(); }, []);
    // ---------------------------------------------------
    // ANALYTICS COMPUTATION
    // ---------------------------------------------------
    const computeAnalytics = (leads, accounts, opportunities, tasks, notes) => {
        // Helpers
        const normalizeStr = (str) => (str || '').toString().trim().toLowerCase();

        // Leads Analysis (By Status)
        const totalLeads = leads.length;
        const statusCounts = {
            'Open': 0,
            'Working': 0,
            'Closed': 0,
            'Converted': 0
        };

        leads.forEach(l => {
            const status = normalizeStr(getField(l, 'status', 'Status'));
            if (status.includes('open')) statusCounts['Open']++;
            else if (status.includes('working')) statusCounts['Working']++;
            else if (status.includes('closed') && status.includes('converted')) statusCounts['Converted']++;
            else if (status.includes('closed')) statusCounts['Closed']++;
            else statusCounts['Open']++;
        });

        const leadStatusData = [
            { name: 'Open', value: statusCounts['Open'] },
            { name: 'Working', value: statusCounts['Working'] },
            { name: 'Closed', value: statusCounts['Closed'] },
            { name: 'Converted', value: statusCounts['Converted'] }
        ].filter(d => d.value > 0);

        // Accounts Analysis
        const totalAccounts = accounts.length;
        const industryCounts = {};
        accounts.forEach(acc => {
            const industry = getField(acc, 'industry', 'Industry') || 'Other';
            industryCounts[industry] = (industryCounts[industry] || 0) + 1;
        });
        const accountsByIndustry = Object.keys(industryCounts).map(key => ({
            name: key,
            value: industryCounts[key]
        }));

        // Opportunities Analysis
        const totalOpportunities = opportunities.length;
        const stageCounts = {};
        const revenueByMonthMap = {};

        opportunities.forEach(opp => {
            const stage = getField(opp, 'stageName', 'StageName', 'stage') || 'Unknown';
            stageCounts[stage] = (stageCounts[stage] || 0) + 1;

            const amount = Number(getField(opp, 'amount', 'Amount') || 0);
            const closeDate = getField(opp, 'closeDate', 'CloseDate');
            if (closeDate && amount > 0) {
                const date = new Date(closeDate);
                const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                if (!revenueByMonthMap[key]) revenueByMonthMap[key] = { amount: 0, label: monthYear };
                revenueByMonthMap[key].amount += amount;
            }
        });

        const pipelineByStage = Object.keys(stageCounts).map(key => ({
            stage: key,
            count: stageCounts[key]
        }));

        const revenueTimeline = Object.keys(revenueByMonthMap)
            .sort()
            .map(key => ({
                month: revenueByMonthMap[key].label,
                amount: revenueByMonthMap[key].amount
            }));

        // ----------------------------
        // Tasks Analysis (UPDATED)
        // ----------------------------
        // Exclude: Completed, Deferred
        const pendingTasksCount = tasks.filter(t => {
            const status = normalizeStr(getField(t, 'status', 'Status'));
            return !(status.includes('completed') || status.includes('deferred'));
        }).length;

        return {
            totalLeads,
            totalWarmLeads: statusCounts['Working'],
            totalHotLeads: statusCounts['Converted'],
            totalAccounts,
            totalOpportunities,
            totalTasks: pendingTasksCount,
            totalNotes: notes.length,
            leadStatusData,
            accountsByIndustry,
            pipelineByStage,
            revenueTimeline
        };
    };

    // ---------------------------------------------------
    // DATA FETCHING
    // ---------------------------------------------------
    const loadData = async (isPolling = false) => {
        if (!isPolling) setLoading(true);
        setApiError("");
        try {
            if (mode === "dashboard" || mode === "ai") {
                // Parallel fetch for analytics/AI
                const [leadsRes, accountsRes, oppsRes, tasksRes, notesRes] = await Promise.all([
                    getLeads(),
                    getAccounts(),
                    getOpportunities(),
                    getTasks(),
                    getNotes()
                ]);

                const leads = normalizeData(leadsRes);
                const accounts = normalizeData(accountsRes);
                const opps = normalizeData(oppsRes);
                const tasks = normalizeData(tasksRes);
                const notes = normalizeData(notesRes);
                checkTaskDueReminders(tasks);

                // Compute
                const stats = computeAnalytics(leads, accounts, opps, tasks, notes);
                setAnalytics(stats);

                if (mode === "ai") {
                    // For AI, we need the full context in a separate state
                    setAiData({ leads, accounts, opportunities: opps, tasks, notes });
                    // Clear table data to prevent leaks/crashes
                    setData([]);
                } else {
                    setData([]);
                }
            } else {
                let res;
                if (mode === "leads") res = await getLeads();
                else if (mode === "accounts") res = await getAccounts();
                else if (mode === "opportunities") res = await getOpportunities();
                else if (mode === "tasks") res = await getTasks();
                else if (mode === "notes") res = await getNotes();

                if (res) {
                    const validData = normalizeData(res);
                    setData(validData);
                    if (mode === "tasks") checkTaskDueReminders(validData);
                } else {
                    setData([]);
                }
            }
        } catch (err) {
            console.error(err);
            const message = err.response?.data?.message || err.message || "Failed to fetch data";
            setApiError(message);
        } finally {
            if (!isPolling) setLoading(false);
        }
    };

    // Initial load & Polling for Dashboard
    useEffect(() => {
        if (["dashboard", "leads", "accounts", "opportunities", "tasks", "notes", "ai"].includes(mode)) {
            loadData();
        } else {
            setData([]);
        }

        if (mode === "dashboard") {
            const interval = setInterval(() => {
                loadData(true); // Poll silently
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [mode]);

    // ---------------------------------------------------
    // MODAL HANDLERS
    // ---------------------------------------------------
    const openCreateModal = () => {
        setEditingRecord(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        setIsModalOpen(true);
    };

    const handleDelete = async (record) => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;

        try {
            const id = record.Id || record.sfId || record._id;
            setLoading(true);

            if (mode === "leads") await deleteLead(id);
            else if (mode === "accounts") await deleteAccount(id);
            else if (mode === "opportunities") await deleteOpportunity(id);
            else if (mode === "tasks") await deleteTask(id);
            else if (mode === "notes") await deleteNote(id);

            loadData();
        } catch (err) {
            console.error(err);
            setApiError("Failed to delete record");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = async () => {
        const action = editingRecord ? "updated" : "created";
        // Simple notification trigger
        addNotification({
            type: `${mode}_success`,
            title: "Success",
            message: `${mode.slice(0, -1)} successfully ${action}.`
        });
        await loadData();
        setEditingRecord(null);
        setIsModalOpen(false);
    };

    const renderModal = () => {
        if (!isModalOpen) return null;

        const props = {
            onClose: () => setIsModalOpen(false),
            onSuccess: handleSuccess,
            initialData: editingRecord // Pass editing record if any
        };

        if (mode === "leads") return <LeadForm {...props} createApi={createLead} updateApi={updateLead} />;
        if (mode === "accounts") return <AccountForm {...props} createApi={createAccount} updateApi={updateAccount} />;
        if (mode === "opportunities") return <OpportunityForm {...props} createApi={createOpportunity} updateApi={updateOpportunity} />;
        if (mode === "tasks") return <TaskForm {...props} createApi={createTask} updateApi={updateTask} />;
        if (mode === "notes") return <NoteForm {...props} createApi={createNote} />;

        return null;
    };

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "leads", label: "Leads", icon: Users },
        { id: "accounts", label: "Accounts", icon: Briefcase },
        { id: "opportunities", label: "Opportunities", icon: Target },
        { id: "tasks", label: "Tasks", icon: CheckSquare },
        { id: "notes", label: "Notes", icon: StickyNote },
        { id: "ai", label: "AI Assistant", icon: Bot },
    ];

    // ---------------------------------------------------
    // RENDER ANALYTICS UI
    // ---------------------------------------------------
    const renderAnalytics = () => {
        if (loading && !analytics) return (
            <div className="flex h-full items-center justify-center">
                <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
        );

        if (!analytics) return null;

        return (
            <div className="p-8 space-y-8 animate-fade-in custom-scrollbar overflow-y-auto h-full pb-24">
                <header className="mb-6">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-400 mt-1">Real-time insights and performance metrics</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KpiCard title="Total Leads" value={analytics.totalLeads} icon={Users} delay={0.1} />
                    <KpiCard title="Warm Leads" value={analytics.totalWarmLeads} icon={Target} delay={0.15} />
                    <KpiCard title="Total Opportunities" value={analytics.totalOpportunities} icon={Briefcase} delay={0.2} />
                    <KpiCard title="Tasks Pending" value={analytics.totalTasks} icon={CheckSquare} delay={0.25} />
                    <KpiCard title="Hot Leads" value={analytics.totalHotLeads} icon={Target} delay={0.3} />
                    <KpiCard title="Total Accounts" value={analytics.totalAccounts} icon={Users} delay={0.35} />
                    <KpiCard title="Total Notes" value={analytics.totalNotes} icon={StickyNote} delay={0.4} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                    <ChartCard title="Revenue Timeline" delay={0.5}>
                        <RevenueTimelineChart data={analytics.revenueTimeline} />
                    </ChartCard>
                    <ChartCard title="Lead Status Distribution" delay={0.6}>
                        <LeadStatusChart data={analytics.leadStatusData} />
                    </ChartCard>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[400px]">
                    <ChartCard title="Opportunity Pipeline" delay={0.7}>
                        <OpportunityStageChart data={analytics.pipelineByStage} />
                    </ChartCard>
                    <ChartCard title="Accounts by Industry" delay={0.8}>
                        <AccountsIndustryChart data={analytics.accountsByIndustry} />
                    </ChartCard>
                </div>
            </div>
        );
    };

    return (
        <div className="relative min-h-screen w-full bg-black text-white font-sans selection:bg-indigo-500/30 overflow-hidden">

            {/* Background Layer */}
            <div className="fixed inset-0 z-0 opacity-40">
                <DotGrid />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.5)_0%,black_100%)] pointer-events-none" />
            </div>

            <div className="relative z-10 flex h-screen">

                {/* SIDEBAR (UNCHANGED UI) */}
                <aside
                    className={`fixed md:relative z-50 h-full bg-black/95 backdrop-blur-xl border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none
                    ${isSidebarOpen
                            ? "translate-x-0 w-64"
                            : "-translate-x-full w-64 md:translate-x-0 md:w-0 md:overflow-hidden"
                        }`}
                >
                    <div className="p-6 flex items-center gap-3 border-b border-white/5 shrink-0 whitespace-nowrap overflow-hidden">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-lg shadow-indigo-500/20 shrink-0"></div>
                        <span className="text-lg font-bold tracking-tight text-white">
                            ForceLink
                        </span>
                        <button onClick={() => setIsSidebarOpen(false)} className="ml-auto text-slate-500 md:hidden">
                            <X size={20} />
                        </button>
                    </div>

                    {/* MENU ITEMS */}
                    <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 no-scrollbar">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setMode(item.id);
                                    if (window.innerWidth < 768) setIsSidebarOpen(false);
                                    setSelectedRecord(null); // Clear detail view on switch
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group whitespace-nowrap
                                    ${mode === item.id
                                        ? "bg-indigo-600/20 text-indigo-300 shadow-lg shadow-indigo-900/10 border border-indigo-500/10"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }
                                `}
                            >
                                <item.icon
                                    size={20}
                                    className={`${mode === item.id ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}
                                />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* MAIN CONTENT AREA */}
                <main className="flex-1 flex flex-col h-full min-w-0 bg-black/50 overflow-hidden relative">

                    {/* TOPBAR (UNCHANGED UI) */}
                    <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-md flex items-center justify-between px-4 md:px-8 shrink-0 relative z-30">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                            <h2 className="text-xl font-semibold text-white capitalize tracking-tight">
                                {mode.replace("-", " ")}
                            </h2>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6">
                            {/* SEARCH FIELD */}
                            <div className="hidden md:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 focus-within:bg-white/10 focus-within:border-indigo-500/50 transition-all w-64">
                                <Search size={16} className="text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    onFocus={closeAllMenus}
                                    className="bg-transparent border-none outline-none text-sm text-white placeholder:text-slate-600 w-full"
                                />
                            </div>

                            {/* NOTIFICATIONS */}
                            <div className="relative">
                                <button
                                    onClick={() => {
                                        if (!showNotifications) markAllNotificationsRead();
                                        setShowNotifications(!showNotifications);
                                    }}
                                    className={`relative p-2 transition-colors rounded-full hover:bg-white/5 ${showNotifications ? "text-white bg-white/5" : "text-slate-400"}`}
                                >
                                    <Bell size={20} />
                                    {notifications.some(n => !n.read) && (
                                        <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500 border border-black animate-pulse" />
                                    )}
                                </button>
                                {showNotifications && (
                                    <NotificationPanel
                                        notifications={notifications}
                                        onClose={() => setShowNotifications(false)}
                                        onClearAll={clearNotifications}
                                        onMarkRead={markAllNotificationsRead}
                                    />
                                )}
                            </div>

                            {/* USER MENU */}
                            <div className="relative">
                                <button
                                    onClick={toggleUserMenu}
                                    className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border border-white/20 flex items-center justify-center text-xs font-bold text-white cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
                                >
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </button>

                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-56 bg-[#0A0F1A] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-fade-in-up origin-top-right">
                                        <div className="px-4 py-3 border-b border-white/5 mb-1 bg-white/5">
                                            <p className="text-sm font-semibold text-white truncate max-w-[180px]">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate max-w-[180px]">
                                                {user.email}
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors rounded-b-xl"
                                        >
                                            <LogOut size={16} /> Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* CONTENT PANEL */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">

                        {/* Top Action Bar for Modules */}
                        {["leads", "accounts", "opportunities", "tasks", "notes"].includes(mode) && (
                            <div className="flex justify-between items-center mb-6 animate-fade-in-up">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-2xl font-bold text-white capitalize">{mode}</h2>
                                    <span className="bg-white/10 text-slate-400 px-3 py-1 rounded-full text-xs font-medium">
                                        {data.length} Records
                                    </span>
                                </div>
                                <button
                                    onClick={openCreateModal}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95"
                                >
                                    <Plus size={18} />
                                    New {mode.slice(0, -1)}
                                </button>
                            </div>
                        )}

                        {/* LOADING */}
                        {loading && (
                            <div className="text-center py-20 text-slate-400 animate-pulse">
                                Loading {mode}...
                            </div>
                        )}

                        {/* API ERROR */}
                        {!loading && apiError && (
                            <div className="text-center py-20 text-red-400 border border-red-500/10 bg-red-500/5 rounded-xl mx-auto max-w-lg">
                                <p className="font-semibold mb-1">Error Loading Data</p>
                                <p className="text-sm opacity-80">{apiError}</p>
                            </div>
                        )}

                        {/* DATA VIEW */}
                        {!loading && !apiError && ["leads", "accounts", "opportunities", "tasks", "notes"].includes(mode) && (
                            <>
                                <h1 className="text-2xl font-bold mb-6 text-white capitalize hidden">{mode} List</h1>
                                {/* DataTable */}
                                <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                    <DataTable
                                        data={data}
                                        onRowClick={(row) => setSelectedRecord(row)}
                                        onEdit={mode !== 'notes' ? handleEdit : undefined} // Notes don't have update
                                        onDelete={handleDelete}
                                    />
                                </div>
                            </>
                        )}

                        {/* DEFAULT DASHBOARD VIEW */}
                        {!loading && !apiError && (mode === "dashboard") && (
                            renderAnalytics()
                        )}

                        {/* AI ASSISTANT */}
                        {!loading && !apiError && (mode === "ai") && (
                            <div className="h-full p-4 md:p-8 animate-fade-in-up">
                                <AiAssistant data={aiData} />
                            </div>
                        )}

                    </div>
                </main>
            </div>

            {/* RENDER MODALS */}
            {renderModal()}
            {
                selectedRecord && (
                    <RecordDetailsModal
                        record={selectedRecord}
                        type={mode}
                        onClose={() => setSelectedRecord(null)}
                    />
                )
            }
        </div >
    );
}

import React from 'react';
import { Users, Target, Briefcase, CheckSquare, StickyNote } from "lucide-react";
import KpiCard from "../../../components/analytics/KpiCard";
import ChartCard from "../../../components/analytics/ChartCard";
import LeadStatusChart from "../../../components/analytics/charts/LeadStatusChart";
import OpportunityStageChart from "../../../components/analytics/charts/OpportunityStageChart";
import RevenueTimelineChart from "../../../components/analytics/charts/RevenueTimelineChart";
import AccountsIndustryChart from "../../../components/analytics/charts/AccountsIndustryChart";

const DashboardAnalytics = ({ analytics, loading }) => {
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

export default DashboardAnalytics;

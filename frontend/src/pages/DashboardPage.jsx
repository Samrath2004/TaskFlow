import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useQuery } from '@tanstack/react-query';
import { Loader2, FolderKanban, CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import TaskStatusChart from '../components/dashboard/TaskStatusChart';
import OverdueTasks from '../components/dashboard/OverdueTasks';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fetchDashboardStats = async () => {
  const { data } = await api.get('/dashboard');
  return data.data;
};

const DashboardPage = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl border border-rose-200 dark:border-rose-800">
        Failed to load dashboard statistics. Please try again later.
      </div>
    );
  }

  // Priority data for Bar Chart
  const priorityData = [
    { name: 'Low', value: stats.tasksByPriority?.low || 0, fill: '#94a3b8' },
    { name: 'Medium', value: stats.tasksByPriority?.medium || 0, fill: '#3b82f6' },
    { name: 'High', value: stats.tasksByPriority?.high || 0, fill: '#f59e0b' },
    { name: 'Critical', value: stats.tasksByPriority?.critical || 0, fill: '#ef4444' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">Here's what's happening with your projects today.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard 
          title="Total Projects" 
          value={stats.totalProjects} 
          icon={FolderKanban}
          colorClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
        />
        <StatsCard 
          title="Total Tasks" 
          value={stats.totalTasks} 
          icon={CheckSquare}
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <StatsCard 
          title="Completion Rate" 
          value={`${stats.completionRate}%`} 
          icon={Clock}
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <StatsCard 
          title="Overdue Tasks" 
          value={stats.overdueTasks?.length || 0} 
          icon={AlertTriangle}
          colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TaskStatusChart tasksByStatus={stats.tasksByStatus || {}} />
        
        <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 shadow-sm border border-surface-200 dark:border-surface-700 h-full hover:shadow-md transition-shadow duration-300">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-6">Tasks by Priority</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-surface-800)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-surface-800 rounded-2xl p-5 shadow-sm border border-surface-200 dark:border-surface-700 hover:shadow-md transition-shadow duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Tasks Per User</h3>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={Object.entries(stats.tasksPerUser || {}).map(([name, value]) => ({ name, value }))} 
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--tw-colors-surface-800)' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} maxBarSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <OverdueTasks tasks={stats.overdueTasks || []} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

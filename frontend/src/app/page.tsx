'use client';

import { useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { projectsAPI, tasksAPI } from '@/lib/api';
import { Project, Task } from '@/lib/types';

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, tasksRes] = await Promise.all([
          projectsAPI.getAll(),
          tasksAPI.getAll(),
        ]);
        setProjects(projectsRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const activeProjects = projects.filter(
    (p) => p.status !== 'Completed'
  ).length;
  const pendingTasks = tasks.filter((t) => t.status !== 'Done').length;
  const overdueTasks = tasks.filter(
    (t) =>
      t.status !== 'Done' &&
      t.dueDate &&
      new Date(t.dueDate) < new Date()
  );
  const highPriorityTasks = tasks.filter(
    (t) => t.priority === 'High' && t.status !== 'Done'
  );

  return (
    <div>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Overview of projects, tasks and current progress.</p>
        </header>

        {/* Section 1: Statistics Cards */}
        <section className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4 mb-16">
          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm transition-all hover:shadow-lg hover:border-gray-300 flex flex-col items-center justify-center min-h-40">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">💻 Active Projects</div>
            <div className="mt-4 text-5xl font-bold text-gray-900">{activeProjects}</div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm transition-all hover:shadow-lg hover:border-gray-300 flex flex-col items-center justify-center min-h-40">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">✔️ Total Tasks</div>
            <div className="mt-4 text-5xl font-bold text-gray-900">{tasks.length}</div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm transition-all hover:shadow-lg hover:border-gray-300 flex flex-col items-center justify-center min-h-40">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">❗ Pending Tasks</div>
            <div className="mt-4 text-5xl font-bold text-yellow-600">{pendingTasks}</div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-10 shadow-sm transition-all hover:shadow-lg hover:border-gray-300 flex flex-col items-center justify-center min-h-40">
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide">🔴 Overdue Tasks</div>
            <div className="mt-4 text-5xl font-bold text-red-600">{overdueTasks.length}</div>
          </div>
        </section>

        {/* Section 2: Information Cards */}
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg flex flex-col h-80 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50/50 px-10 py-8">
              <h2 className="text-xl font-bold text-gray-900">🔴 Overdue Tasks</h2>
            </div>
            <div className="flex-1 p-10 overflow-auto">
              {overdueTasks.length === 0 ? (
                <p className="text-gray-500 text-base">No overdue tasks</p>
              ) : (
                <ul className="space-y-4">
                  {overdueTasks.map((task) => (
                    <li key={task.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="h-3 w-3 rounded-full bg-red-500 shrink-0 mt-1.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 text-base">{task.title}</div>
                        <div className="text-sm text-gray-500 mt-2">
                          {task.project?.name} • Due {new Date(task.dueDate!).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg flex flex-col h-80 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50/50 px-10 py-8">
              <h2 className="text-xl font-bold text-gray-900">⚡ High Priority Tasks</h2>
            </div>
            <div className="flex-1 p-10 overflow-auto">
              {highPriorityTasks.length === 0 ? (
                <p className="text-gray-500 text-base">No high priority tasks</p>
              ) : (
                <ul className="space-y-5">
                  {highPriorityTasks.slice(0, 8).map((task) => (
                    <li key={task.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className="h-3 w-3 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 text-base">{task.title}</div>
                        <div className="mt-2 flex items-center gap-8">
                        <span className="text-sm text-gray-500">
                          {task.project?.name}
                        </span>

                        <span
                         className={`ml-4 rounded-full px-3 py-1 text-xs font-semibold ${
                         task.status === 'Done'
                         ? 'bg-green-100 text-green-700'
                         : task.status === 'In Progress'
                         ? 'bg-blue-100 text-blue-700'
                         : 'bg-gray-100 text-gray-700'
                        }`}
                        >
                         {task.status}
                        </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

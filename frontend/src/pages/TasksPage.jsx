import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';
import { Loader2, CheckSquare } from 'lucide-react';
import TaskCard from '../components/tasks/TaskCard';

const fetchMyTasks = async () => {
  const { data } = await api.get('/dashboard');
  return data.data.myTasks;
};

const TasksPage = () => {
  const { data: myTasks, isLoading, error } = useQuery({
    queryKey: ['myTasks'],
    queryFn: fetchMyTasks
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Tasks</h1>
        <p className="text-surface-500 dark:text-surface-400 mt-1">All tasks currently assigned to you across projects.</p>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl border border-rose-200 dark:border-rose-800">
          Failed to load tasks. Please try again later.
        </div>
      ) : myTasks?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-6">
          {myTasks.map((task) => (
            <TaskCard key={task._id} task={task} />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 border-dashed">
          <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mb-4 text-surface-400 dark:text-surface-500">
            <CheckSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">
            No tasks assigned
          </h3>
          <p className="text-surface-500 dark:text-surface-400 max-w-sm">
            You don't have any pending tasks assigned to you right now. Great job!
          </p>
        </div>
      )}
    </div>
  );
};

export default TasksPage;

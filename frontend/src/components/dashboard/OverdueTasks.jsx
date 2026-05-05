import { format } from 'date-fns';
import { AlertCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const OverdueTasks = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 shadow-sm border border-surface-200 dark:border-surface-700 h-full">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Overdue Tasks</h3>
        <div className="flex flex-col items-center justify-center h-48 text-surface-400">
          <CheckCircle2 className="w-12 h-12 mb-2 text-emerald-500 opacity-50" />
          <p>No overdue tasks. Great job!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl p-5 shadow-sm border border-rose-200 dark:border-rose-900/50 h-full relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center">
          <AlertCircle className="w-5 h-5 text-rose-500 mr-2" />
          Overdue Tasks
        </h3>
        <span className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 text-xs font-bold px-2.5 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 relative z-10">
        {tasks.slice(0, 5).map(task => (
          <Link 
            key={task._id} 
            to={`/projects/${task.project._id || task.project}?task=${task._id}`}
            className="block p-3 rounded-xl border border-surface-100 dark:border-surface-700 hover:border-rose-300 dark:hover:border-rose-700 bg-surface-50 dark:bg-surface-900/50 transition-colors"
          >
            <h4 className="font-medium text-surface-900 dark:text-white text-sm truncate">{task.title}</h4>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-surface-500 dark:text-surface-400 truncate max-w-[60%]">
                {task.project?.name || 'Unknown Project'}
              </span>
              <span className="text-xs flex items-center text-rose-600 dark:text-rose-400 font-medium">
                <Clock className="w-3 h-3 mr-1" />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            </div>
          </Link>
        ))}
      </div>
      
      {tasks.length > 5 && (
        <button className="w-full mt-4 text-sm text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
          View all {tasks.length} overdue tasks
        </button>
      )}
    </div>
  );
};

// Needed for empty state icon above
import { CheckCircle2 } from 'lucide-react';

export default OverdueTasks;

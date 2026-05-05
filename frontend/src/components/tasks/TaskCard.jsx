import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';
import { Clock, MessageSquare, Paperclip } from 'lucide-react';
import { Link } from 'react-router-dom';

const TaskCard = ({ task, isOverlay }) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const priorityColors = {
    low: 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300',
    medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    critical: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white dark:bg-surface-800 rounded-xl p-3.5 shadow-sm border cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow
        ${isOverdue ? 'border-rose-400 dark:border-rose-600' : 'border-surface-200 dark:border-surface-700'}
        ${isDragging ? 'opacity-30' : 'opacity-100'}
        ${isOverlay ? 'scale-105 shadow-xl rotate-2 cursor-grabbing' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-2 gap-2">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        
        {task.tags?.length > 0 && (
          <div className="flex gap-1 overflow-hidden">
            {task.tags.slice(0, 2).map(tag => (
              <span key={tag} className="w-2 h-2 rounded-full bg-primary-400" title={tag}></span>
            ))}
          </div>
        )}
      </div>

      <Link to={`?task=${task._id}`} className="font-medium text-surface-900 dark:text-white text-sm mb-3 leading-snug break-words hover:text-primary-600 dark:hover:text-primary-400 block" onPointerDown={(e) => e.stopPropagation()}>
        {task.title}
      </Link>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-surface-100 dark:border-surface-700/50">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <div className={`flex items-center text-xs font-medium ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-surface-500 dark:text-surface-400'}`}>
              <Clock className="w-3.5 h-3.5 mr-1" />
              {format(new Date(task.dueDate), 'MMM d')}
            </div>
          )}
          
          {(task.comments?.length > 0 || task.attachments?.length > 0) && (
            <div className="flex items-center gap-2 text-surface-400">
              {task.comments?.length > 0 && (
                <div className="flex items-center text-xs">
                  <MessageSquare className="w-3.5 h-3.5 mr-0.5" />
                  {task.comments.length}
                </div>
              )}
              {task.attachments?.length > 0 && (
                <div className="flex items-center text-xs">
                  <Paperclip className="w-3.5 h-3.5 mr-0.5" />
                  {task.attachments.length}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0">
          <img 
            className="h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-800 object-cover bg-surface-200" 
            src={task.assignee?.avatar || `https://ui-avatars.com/api/?name=${task.assignee?.name || 'U'}&background=random`} 
            alt={task.assignee?.name || 'Unassigned'} 
            title={task.assignee?.name || 'Unassigned'}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;

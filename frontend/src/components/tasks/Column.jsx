import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import TaskCard from './TaskCard';

const Column = ({ column, tasks, isAdmin }) => {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div 
      className="bg-surface-100 dark:bg-surface-800/50 w-80 rounded-2xl flex flex-col max-h-full border border-surface-200 dark:border-surface-700"
    >
      <div className="p-4 flex items-center justify-between border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-surface-900 dark:text-white">{column.title}</h3>
          <span className="bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300 text-xs font-bold px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div 
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 min-h-[150px]"
      >
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="h-24 border-2 border-dashed border-surface-300 dark:border-surface-600 rounded-xl flex items-center justify-center text-surface-400 text-sm">
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;

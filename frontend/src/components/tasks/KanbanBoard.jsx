import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import api from '../../api/axios';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import TaskCard from './TaskCard';
import Column from './Column';

const fetchTasks = async (projectId) => {
  const { data } = await api.get(`/tasks/project/${projectId}`);
  return data.data;
};

const KanbanBoard = ({ projectId, searchTerm, isAdmin, projectMembers }) => {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState([]);
  const [activeTask, setActiveTask] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => fetchTasks(projectId),
  });

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data]);

  const updateTaskStatus = useMutation({
    mutationFn: async ({ taskId, status }) => {
      const res = await api.put(`/tasks/${taskId}`, { status });
      return res.data;
    },
    onSuccess: () => {
      // Background refetch to ensure sync
      queryClient.invalidateQueries(['tasks', projectId]);
      queryClient.invalidateQueries(['dashboardStats']);
    },
    onError: () => {
      toast.error('Failed to update task status');
      // Revert optimistic update
      queryClient.invalidateQueries(['tasks', projectId]);
    }
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Dropping a task over another task
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const overIndex = tasks.findIndex((t) => t._id === overId);
        
        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Dropping a task over a column
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t._id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].status = overId;
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find((t) => t._id === activeId);
    if (!activeTask) return;

    const overStatus = over.data.current?.type === 'Column' 
      ? over.id 
      : tasks.find((t) => t._id === overId)?.status;

    if (overStatus && activeTask.status !== overStatus) {
      // Trigger API update
      updateTaskStatus.mutate({ taskId: activeId, status: overStatus });
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => 
    !searchTerm || task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  return (
    <div className="flex-1 overflow-x-auto min-h-0 pb-4">
      <div className="flex gap-6 h-full items-start min-w-max">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {columns.map(col => {
            const columnTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <Column 
                key={col.id} 
                column={col} 
                tasks={columnTasks}
                isAdmin={isAdmin}
              />
            );
          })}
          
          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;

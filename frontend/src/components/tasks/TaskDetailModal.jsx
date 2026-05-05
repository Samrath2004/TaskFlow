import { useState } from 'react';
import { X, Clock, User, Tag, MessageSquare, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const fetchTask = async (id) => {
  const { data } = await api.get(`/tasks/${id}`);
  return data.data;
};

const TaskDetailModal = ({ isOpen, onClose, taskId, isAdmin, projectMembers = [] }) => {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState('');

  const { data: task, isLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => fetchTask(taskId),
    enabled: !!taskId && isOpen
  });

  const updateTask = useMutation({
    mutationFn: async (updates) => {
      const res = await api.put(`/tasks/${taskId}`, updates);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId]);
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task updated');
    }
  });

  const addComment = useMutation({
    mutationFn: async (text) => {
      const res = await api.post(`/tasks/${taskId}/comment`, { text });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['task', taskId]);
      setCommentText('');
      toast.success('Comment added');
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoading || !task ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-surface-200 dark:border-surface-700 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-3 w-full pr-4">
                <select 
                  value={task.status}
                  onChange={(e) => updateTask.mutate({ status: e.target.value })}
                  className="bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 text-sm font-medium rounded-lg px-3 py-1.5 border-transparent focus:ring-2 focus:ring-primary-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <div className="flex-1">
                  {isAdmin ? (
                    <input 
                      type="text" 
                      defaultValue={task.title}
                      onBlur={(e) => {
                        if (e.target.value !== task.title) updateTask.mutate({ title: e.target.value });
                      }}
                      className="w-full text-xl font-semibold bg-transparent border-none focus:ring-0 p-0 text-surface-900 dark:text-white"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-surface-900 dark:text-white">{task.title}</h2>
                  )}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
              {/* Main Content */}
              <div className="flex-1 space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Description</h3>
                  {isAdmin ? (
                    <textarea 
                      defaultValue={task.description}
                      onBlur={(e) => {
                        if (e.target.value !== task.description) updateTask.mutate({ description: e.target.value });
                      }}
                      className="w-full min-h-[100px] p-3 rounded-xl border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50 text-surface-900 dark:text-white focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="Add a more detailed description..."
                    />
                  ) : (
                    <div className="p-3 rounded-xl bg-surface-50 dark:bg-surface-900/50 text-surface-900 dark:text-white text-sm whitespace-pre-wrap min-h-[100px]">
                      {task.description || 'No description provided.'}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-4 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" /> Comments
                  </h3>
                  
                  <div className="space-y-4 mb-4">
                    {task.comments?.length === 0 ? (
                      <p className="text-sm text-surface-500 italic">No comments yet.</p>
                    ) : (
                      task.comments?.map((comment, idx) => (
                        <div key={idx} className="flex gap-3">
                          <img 
                            src={comment.user?.avatar || `https://ui-avatars.com/api/?name=${comment.user?.name}`} 
                            className="w-8 h-8 rounded-full shrink-0" 
                            alt="" 
                          />
                          <div className="flex-1 bg-surface-50 dark:bg-surface-700/50 rounded-xl p-3">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-semibold text-surface-900 dark:text-white">{comment.user?.name}</span>
                              <span className="text-[10px] text-surface-500">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                            </div>
                            <p className="text-sm text-surface-700 dark:text-surface-300 whitespace-pre-wrap">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (commentText.trim()) addComment.mutate(commentText);
                    }}
                    className="flex gap-2"
                  >
                    <input 
                      type="text" 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..." 
                      className="flex-1 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-600 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                    <button 
                      type="submit"
                      disabled={!commentText.trim() || addComment.isPending}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-full md:w-48 shrink-0 space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">Assignee</h3>
                  {isAdmin ? (
                    <select 
                      value={task.assignee?._id || ''}
                      onChange={(e) => updateTask.mutate({ assigneeId: e.target.value || null })}
                      className="w-full bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600 rounded-lg px-2 py-1.5 text-sm dark:text-white"
                    >
                      <option value="">Unassigned</option>
                      {projectMembers.map(m => (
                        <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <img 
                        src={task.assignee?.avatar || `https://ui-avatars.com/api/?name=${task.assignee?.name || 'U'}`} 
                        className="w-6 h-6 rounded-full" 
                        alt="" 
                      />
                      <span className="text-sm dark:text-white">{task.assignee?.name || 'Unassigned'}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">Priority</h3>
                  {isAdmin ? (
                    <select 
                      value={task.priority}
                      onChange={(e) => updateTask.mutate({ priority: e.target.value })}
                      className="w-full bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600 rounded-lg px-2 py-1.5 text-sm dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  ) : (
                    <span className="text-sm dark:text-white capitalize">{task.priority}</span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2 flex items-center"><Clock className="w-3 h-3 mr-1"/> Due Date</h3>
                  {isAdmin ? (
                    <input 
                      type="date"
                      defaultValue={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                      onChange={(e) => updateTask.mutate({ dueDate: e.target.value })}
                      className="w-full bg-surface-50 dark:bg-surface-700/50 border border-surface-200 dark:border-surface-600 rounded-lg px-2 py-1.5 text-sm dark:text-white"
                    />
                  ) : (
                    <span className="text-sm dark:text-white">
                      {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No due date'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskDetailModal;

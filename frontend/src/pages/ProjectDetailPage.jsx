import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Loader2, ArrowLeft, Settings, Users, LayoutDashboard, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import KanbanBoard from '../components/tasks/KanbanBoard';
import ProjectForm from '../components/projects/ProjectForm';
import TaskForm from '../components/tasks/TaskForm';
import TaskDetailModal from '../components/tasks/TaskDetailModal';
import { useSearchParams } from 'react-router-dom';

const fetchProject = async (id) => {
  const { data } = await api.get(`/projects/${id}`);
  return data.data;
};

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const taskIdParam = searchParams.get('task');
  
  const [activeTab, setActiveTab] = useState('tasks');
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [searchTask, setSearchTask] = useState('');

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id)
  });

  const isAdmin = user?.role === 'admin' || project?.owner?._id === user?.id || 
    project?.members?.some(m => m.user._id === user?.id && m.role === 'admin');

  const removeMember = useMutation({
    mutationFn: async (userId) => {
      await api.delete(`/projects/${id}/members/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
    }
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-xl border border-rose-200 dark:border-rose-800">
        Project not found or you don't have access.
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <Link to="/projects" className="inline-flex items-center text-sm font-medium text-surface-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-surface-800 p-6 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: project.color || '#6366f1' }}></div>
          
          <div className="pl-4">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{project.name}</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                project.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300'
              }`}>
                {project.status}
              </span>
            </div>
            <p className="text-surface-500 dark:text-surface-400 max-w-2xl">{project.description}</p>
          </div>
          
          <div className="flex items-center gap-3 self-end sm:self-auto pl-4 sm:pl-0">
            <div className="flex -space-x-2 mr-2">
              {project.members?.slice(0, 3).map((member, i) => (
                <img 
                  key={i} 
                  className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-surface-800" 
                  src={member.user?.avatar || `https://ui-avatars.com/api/?name=${member.user?.name || 'U'}&background=random`} 
                  alt={member.user?.name} 
                  title={`${member.user?.name} (${member.role})`}
                />
              ))}
            </div>
            {isAdmin && (
              <button 
                onClick={() => setIsEditProjectOpen(true)}
                className="p-2 text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:hover:bg-surface-700 dark:hover:text-white rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
              activeTab === 'tasks'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:text-surface-400 dark:hover:text-surface-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Board
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
              activeTab === 'members'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-surface-500 hover:text-surface-700 hover:border-surface-300 dark:text-surface-400 dark:hover:text-surface-300'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Members ({project.members?.length || 0})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'tasks' && (
          <>
            <div className="flex justify-between items-center mb-4">
              <div className="relative w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-surface-400" />
                </div>
                <input
                  type="text"
                  value={searchTask}
                  onChange={(e) => setSearchTask(e.target.value)}
                  className="block w-full pl-9 pr-3 py-1.5 border border-surface-300 dark:border-surface-600 rounded-lg bg-white dark:bg-surface-800 text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-sm"
                  placeholder="Filter tasks..."
                />
              </div>
              {isAdmin && (
                <button
                  onClick={() => setIsTaskFormOpen(true)}
                  className="inline-flex items-center justify-center px-3 py-1.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Task
                </button>
              )}
            </div>
            
            <KanbanBoard projectId={project._id} searchTerm={searchTask} isAdmin={isAdmin} projectMembers={project.members} />
          </>
        )}

        {activeTab === 'members' && (
          <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white">Project Team</h3>
              {isAdmin && (
                <button 
                  onClick={() => setIsAddMemberOpen(true)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  + Invite Member
                </button>
              )}
            </div>
            
            <div className="divide-y divide-surface-100 dark:divide-surface-700">
              {project.members?.map((member) => (
                <div key={member.user._id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <img 
                      className="h-10 w-10 rounded-full object-cover" 
                      src={member.user.avatar || `https://ui-avatars.com/api/?name=${member.user.name}`} 
                      alt="" 
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-surface-900 dark:text-white">{member.user.name}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{member.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      member.role === 'admin' 
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' 
                        : 'bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300'
                    }`}>
                      {member.role}
                    </span>
                    {isAdmin && member.user._id !== project.owner._id && (
                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to remove this member?')) {
                            removeMember.mutate(member.user._id);
                          }
                        }}
                        className="ml-4 text-rose-600 hover:text-rose-800 dark:text-rose-400 text-sm font-medium"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ProjectForm 
        isOpen={isEditProjectOpen} 
        onClose={() => setIsEditProjectOpen(false)} 
        projectToEdit={project}
      />
      
      {isTaskFormOpen && (
        <TaskForm 
          isOpen={isTaskFormOpen} 
          onClose={() => setIsTaskFormOpen(false)} 
          projectId={project._id}
          projectMembers={project.members}
        />
      )}

      {taskIdParam && (
        <TaskDetailModal 
          isOpen={!!taskIdParam}
          onClose={() => {
            searchParams.delete('task');
            setSearchParams(searchParams);
          }}
          taskId={taskIdParam}
          isAdmin={isAdmin}
          projectMembers={project.members}
        />
      )}

      {isAddMemberOpen && (
        <AddMemberModal 
          isOpen={isAddMemberOpen}
          onClose={() => setIsAddMemberOpen(false)}
          projectId={project._id}
          currentMembers={project.members}
        />
      )}
    </div>
  );
};

const AddMemberModal = ({ isOpen, onClose, projectId, currentMembers }) => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  const addMember = useMutation({
    mutationFn: async () => {
      await api.post(`/projects/${projectId}/members`, { email, role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['project', projectId]);
      onClose();
    }
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-900/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-surface-800 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold mb-4 dark:text-white">Add Member</h3>
        <input 
          type="email"
          placeholder="User Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-transparent dark:text-white"
        />
        <select 
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full mb-4 p-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-transparent dark:text-white"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-surface-600 dark:text-surface-300">Cancel</button>
          <button 
            onClick={() => addMember.mutate()}
            disabled={!email || addMember.isPending}
            className="px-4 py-2 text-sm bg-primary-600 text-white rounded-xl disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;

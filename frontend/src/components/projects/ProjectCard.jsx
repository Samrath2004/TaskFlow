import { useNavigate } from 'react-router-dom';
import { Users, MoreVertical, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/projects/${project._id}`)}
      className="bg-white dark:bg-surface-800 rounded-2xl shadow-sm border border-surface-200 dark:border-surface-700 hover:shadow-md hover:border-primary-500/50 cursor-pointer transition-all duration-300 overflow-hidden flex flex-col h-full relative group"
    >
      {/* Color indicator border */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: project.color || '#6366f1' }}></div>
      
      <div className="p-5 pl-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-surface-900 dark:text-white line-clamp-1 group-hover:text-primary-600 transition-colors">{project.name}</h3>
          <button className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mb-4 flex-1">
          {project.description || 'No description provided.'}
        </p>
        
        <div className="flex flex-col gap-3 mt-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-surface-500 dark:text-surface-400 font-medium bg-surface-100 dark:bg-surface-700/50 px-2 py-1 rounded-md">
              <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: project.status === 'active' ? '#10b981' : project.status === 'completed' ? '#3b82f6' : '#94a3b8' }}></span>
              <span className="capitalize">{project.status}</span>
            </div>
            
            <div className="flex items-center text-xs text-surface-500 font-medium">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {format(new Date(project.createdAt), 'MMM d, yyyy')}
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-surface-700/50">
            <div className="flex -space-x-2 overflow-hidden">
              {project.members?.slice(0, 4).map((member, i) => (
                <img 
                  key={i} 
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-800" 
                  src={member.user?.avatar || `https://ui-avatars.com/api/?name=${member.user?.name || 'U'}&background=random`} 
                  alt={member.user?.name} 
                  title={member.user?.name}
                />
              ))}
              {project.members?.length > 4 && (
                <div className="flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white dark:ring-surface-800 bg-surface-200 dark:bg-surface-700 text-[10px] font-medium text-surface-600 dark:text-surface-300">
                  +{project.members.length - 4}
                </div>
              )}
            </div>
            
            <div className="flex items-center text-sm font-medium text-surface-600 dark:text-surface-400">
              <span className="px-2 py-0.5 rounded-full bg-surface-100 dark:bg-surface-700 text-xs">
                {project.taskCount || 0} tasks
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

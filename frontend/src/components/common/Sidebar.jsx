import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'My Tasks', path: '/tasks', icon: CheckSquare },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-30 h-screen w-64 pt-16 bg-white dark:bg-surface-900 border-r border-surface-200 dark:border-surface-800
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-[calc(100vh-4rem)] lg:pt-0 lg:block
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          <button 
            className="lg:hidden absolute top-4 right-4 text-surface-500 hover:text-surface-900 dark:hover:text-white"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
          
          <ul className="space-y-2 mt-4 lg:mt-0">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname.startsWith(link.path);
              
              return (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    onClick={() => {
                      if (window.innerWidth < 1024) toggleSidebar();
                    }}
                    className={`
                      flex items-center p-2 rounded-lg group transition-colors
                      ${isActive 
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium' 
                        : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <Icon size={20} className={isActive ? 'text-primary-500' : 'text-surface-400 group-hover:text-surface-500 dark:group-hover:text-surface-300'} />
                    <span className="ml-3">{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

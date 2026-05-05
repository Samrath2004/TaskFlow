import { useState, useEffect } from 'react';
import { Menu, Moon, Sun, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  return (
    <nav className="fixed top-0 z-40 w-full bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 h-16">
      <div className="px-3 py-3 lg:px-5 lg:pl-3 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center justify-start">
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 text-sm text-surface-500 rounded-lg lg:hidden hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-surface-200 dark:text-surface-400 dark:hover:bg-surface-800 dark:focus:ring-surface-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex ml-2 md:mr-24 items-center">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center mr-2 shadow-sm shadow-primary-500/50">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white tracking-tight">
                TaskFlow
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-surface-500 rounded-lg hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="relative">
              <button 
                type="button" 
                className="flex text-sm bg-surface-800 rounded-full focus:ring-4 focus:ring-surface-300 dark:focus:ring-surface-600"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img 
                  className="w-8 h-8 rounded-full border border-surface-200 dark:border-surface-700" 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=6366f1&color=fff`} 
                  alt="user photo" 
                />
              </button>

              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  ></div>
                  <div className="absolute right-0 z-50 mt-2 w-48 text-base list-none bg-white rounded divide-y divide-surface-100 shadow-lg dark:bg-surface-800 dark:divide-surface-700">
                    <div className="px-4 py-3">
                      <p className="text-sm text-surface-900 dark:text-white font-medium truncate">
                        {user?.name}
                      </p>
                      <p className="text-sm font-medium text-surface-500 truncate dark:text-surface-400">
                        {user?.email}
                      </p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <Link 
                          to="/profile" 
                          className="flex items-center px-4 py-2 text-sm text-surface-700 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700 dark:hover:text-white"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <UserIcon className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button 
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-surface-100 dark:text-red-400 dark:hover:bg-surface-700"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

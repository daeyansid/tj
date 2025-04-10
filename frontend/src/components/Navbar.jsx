import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">My App</span>
          
          {/* Navigation links */}
          <div className="ml-10 space-x-4 hidden md:flex">
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">Home</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">Dashboard</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary">Profile</a>
          </div>
        </div>
        
        {/* User menu and theme toggle */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle button inside Navbar */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {/* User avatar/profile button */}
          <button className="rounded-full w-8 h-8 bg-gray-300 dark:bg-gray-600">
            <span className="sr-only">User menu</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

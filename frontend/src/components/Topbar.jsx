import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const Topbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-primary font-bold text-xl">Trading Journal</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-primary">Home</Link>
            <Link to="/heatmap" className="px-3 py-2 text-gray-700 hover:text-primary">Heatmap</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 text-gray-700 hover:text-primary">Dashboard</Link>
                <Link to="/accounts" className="px-3 py-2 text-gray-700 hover:text-primary">Accounts</Link>
                <Link to="/trading-plans" className="px-3 py-2 text-gray-700 hover:text-primary">Trading Plans</Link>
                <div className="pl-4 border-l flex items-center">
                  <span className="text-gray-700 mr-4">Hello, {user?.username || 'User'}</span>
                  <button 
                    onClick={logout}
                    className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-primary">Login</Link>
                <Link to="/register" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link 
              to="/"
              onClick={() => setMobileMenuOpen(false)} 
              className="block px-3 py-2 text-gray-700 hover:text-primary"
            >
              Home
            </Link>
            <Link 
              to="/heatmap"
              onClick={() => setMobileMenuOpen(false)} 
              className="block px-3 py-2 text-gray-700 hover:text-primary"
            >
              Heatmap
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}  
                  className="block px-3 py-2 text-gray-700 hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/accounts"
                  onClick={() => setMobileMenuOpen(false)}  
                  className="block px-3 py-2 text-gray-700 hover:text-primary"
                >
                  Accounts
                </Link>
                <Link 
                  to="/trading-plans"
                  onClick={() => setMobileMenuOpen(false)}  
                  className="block px-3 py-2 text-gray-700 hover:text-primary"
                >
                  Trading Plans
                </Link>
                <div className="px-3 py-2 border-t">
                  <span className="block text-gray-700 mb-2">Hello, {user?.username || 'User'}</span>
                  <button 
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 rounded-md text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block px-3 py-2 text-gray-700 hover:text-primary"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block px-3 py-2 text-gray-700 hover:text-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Topbar;

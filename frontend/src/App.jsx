import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Topbar from './components/Topbar';
import './index.css'; // Ensure this is importing the file with Tailwind directives

function App() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <AuthProvider>
      <Router>
        <div
          className="min-h-screen transition-colors duration-200 
                    bg-gray-100 dark:bg-gray-900 
                    text-gray-900 dark:text-gray-100"
        >
          <header className="p-4 bg-white dark:bg-gray-800 shadow">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">My App</h1>

              {/* Toggle button inside the header */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 
                       hover:bg-gray-300 dark:hover:bg-gray-600
                       transition-colors duration-200"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <span>🌞 Light Mode</span>
                ) : (
                  <span>🌙 Dark Mode</span>
                )}
              </button>
            </div>
          </header>

          <Topbar />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

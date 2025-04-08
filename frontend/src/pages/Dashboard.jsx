import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiPieChart, FiPlus, FiList, FiSettings, FiLogOut } from 'react-icons/fi';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('summary');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Placeholder data for demonstration
  const recentTrades = [
    { id: 1, symbol: 'AAPL', type: 'Buy', entry: 180.25, exit: 185.75, profit: "+$550", date: '2023-06-15' },
    { id: 2, symbol: 'TSLA', type: 'Sell', entry: 242.10, exit: 235.50, profit: "+$660", date: '2023-06-14' },
    { id: 3, symbol: 'MSFT', type: 'Buy', entry: 335.80, exit: 332.20, profit: "-$360", date: '2023-06-13' },
  ];

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h1 className="app-name">Trading Journal</h1>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <FiPieChart /> Summary
          </button>
          <button 
            className={`nav-item ${activeTab === 'trades' ? 'active' : ''}`}
            onClick={() => setActiveTab('trades')}
          >
            <FiList /> Trades
          </button>
          <button 
            className={`nav-item ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => setActiveTab('add')}
          >
            <FiPlus /> Add Trade
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <FiSettings /> Settings
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-button">
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="user-welcome">
            <h2>Welcome, {user?.username}!</h2>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </header>
        
        <div className="dashboard-content">
          {activeTab === 'summary' && (
            <div className="summary-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Profit/Loss</h3>
                  <p className="stat-value profit">+$850</p>
                  <p className="stat-detail">Month to date</p>
                </div>
                <div className="stat-card">
                  <h3>Win Rate</h3>
                  <p className="stat-value">67%</p>
                  <p className="stat-detail">24 out of 36 trades</p>
                </div>
                <div className="stat-card">
                  <h3>Average Win</h3>
                  <p className="stat-value profit">+$425</p>
                  <p className="stat-detail">Per winning trade</p>
                </div>
                <div className="stat-card">
                  <h3>Average Loss</h3>
                  <p className="stat-value loss">-$210</p>
                  <p className="stat-detail">Per losing trade</p>
                </div>
              </div>
              
              <div className="recent-trades-section">
                <h3>Recent Trades</h3>
                <div className="table-container">
                  <table className="trades-table">
                    <thead>
                      <tr>
                        <th>Symbol</th>
                        <th>Type</th>
                        <th>Entry</th>
                        <th>Exit</th>
                        <th>Profit/Loss</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentTrades.map(trade => (
                        <tr key={trade.id}>
                          <td>{trade.symbol}</td>
                          <td>{trade.type}</td>
                          <td>${trade.entry}</td>
                          <td>${trade.exit}</td>
                          <td className={trade.profit.startsWith('+') ? 'profit' : 'loss'}>
                            {trade.profit}
                          </td>
                          <td>{trade.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'trades' && <div className="trades-tab"><h3>All Trades</h3><p>Detailed trade history will appear here.</p></div>}
          {activeTab === 'add' && <div className="add-tab"><h3>Add New Trade</h3><p>Trade entry form will appear here.</p></div>}
          {activeTab === 'settings' && <div className="settings-tab"><h3>Account Settings</h3><p>Settings options will appear here.</p></div>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

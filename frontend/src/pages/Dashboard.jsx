import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('summary');

  // Placeholder data for demonstration
  const recentTrades = [
    { id: 1, symbol: 'AAPL', type: 'Buy', entry: 180.25, exit: 185.75, profit: 550, date: '2023-06-15' },
    { id: 2, symbol: 'TSLA', type: 'Sell', entry: 242.10, exit: 235.50, profit: 660, date: '2023-06-14' },
    { id: 3, symbol: 'MSFT', type: 'Buy', entry: 335.80, exit: 332.20, profit: -360, date: '2023-06-13' },
  ];

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Dashboard Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-600">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          {['summary', 'trades', 'add', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        {activeTab === 'summary' && (
          <div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">Total Profit/Loss</h3>
                <p className="text-2xl font-bold text-success">+$850</p>
                <p className="text-xs text-gray-500">Month to date</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
                <p className="text-2xl font-bold text-gray-800">67%</p>
                <p className="text-xs text-gray-500">24 out of 36 trades</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">Average Win</h3>
                <p className="text-2xl font-bold text-success">+$425</p>
                <p className="text-xs text-gray-500">Per winning trade</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm font-medium text-gray-500">Average Loss</h3>
                <p className="text-2xl font-bold text-error">-$210</p>
                <p className="text-xs text-gray-500">Per losing trade</p>
              </div>
            </div>

            {/* Recent Trades */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Trades</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exit</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit/Loss</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentTrades.map((trade) => (
                      <tr key={trade.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{trade.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{trade.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${trade.entry}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">${trade.exit}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.profit >= 0 ? 'text-success' : 'text-error'}`}>
                          {trade.profit >= 0 ? '+' : ''}{`$${trade.profit}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{trade.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trades' && <div className="py-4"><h3 className="text-lg font-semibold mb-2">All Trades</h3><p>Detailed trade history will appear here.</p></div>}
        {activeTab === 'add' && <div className="py-4"><h3 className="text-lg font-semibold mb-2">Add New Trade</h3><p>Trade entry form will appear here.</p></div>}
        {activeTab === 'settings' && <div className="py-4"><h3 className="text-lg font-semibold mb-2">Account Settings</h3><p>Settings options will appear here.</p></div>}
      </div>
    </div>
  );
};

export default Dashboard;

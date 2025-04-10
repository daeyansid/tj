import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('summary');
  const tradingViewRef = useRef(null);
  const bitcoinWidgetRef = useRef(null);

  // Placeholder data for demonstration
  const recentTrades = [
    { id: 1, symbol: 'AAPL', type: 'Buy', entry: 180.25, exit: 185.75, profit: 550, date: '2023-06-15' },
    { id: 2, symbol: 'TSLA', type: 'Sell', entry: 242.10, exit: 235.50, profit: 660, date: '2023-06-14' },
    { id: 3, symbol: 'MSFT', type: 'Buy', entry: 335.80, exit: 332.20, profit: -360, date: '2023-06-13' },
  ];

  // Load TradingView Gold widget
  useEffect(() => {
    if (activeTab === 'summary' && tradingViewRef.current) {
      // Clear any existing widgets
      tradingViewRef.current.innerHTML = '';
      
      const widgetContainer = document.createElement('div');
      const copyrightElement = document.createElement('div');
      copyrightElement.className = 'tradingview-widget-copyright';
      
      const link = document.createElement('a');
      link.href = 'https://www.tradingview.com/';
      link.rel = 'noopener nofollow';
      link.target = '_blank';
      
      const span = document.createElement('span');
      span.className = 'blue-text';
      span.textContent = 'Track all markets on TradingView';
      
      link.appendChild(span);
      copyrightElement.appendChild(link);
      
      tradingViewRef.current.appendChild(widgetContainer);
      tradingViewRef.current.appendChild(copyrightElement);
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.async = true;
      script.type = 'text/javascript';
      
      // Configure the widget
      script.innerHTML = JSON.stringify({
        symbol: "OANDA:XAUUSD",
        width: "100%",
        height: "100%",
        locale: "en",
        dateRange: "12M",
        colorTheme: darkMode ? "dark" : "light",
        isTransparent: false,
        autosize: true,
        largeChartUrl: ""
      });
      
      tradingViewRef.current.appendChild(script);
    }
    
    // Cleanup function
    return () => {
      if (tradingViewRef.current) {
        tradingViewRef.current.innerHTML = '';
      }
    };
  }, [activeTab, darkMode]);

  // Load TradingView Bitcoin widget
  useEffect(() => {
    if (activeTab === 'summary' && bitcoinWidgetRef.current) {
      // Clear any existing widgets
      bitcoinWidgetRef.current.innerHTML = '';
      
      const widgetContainer = document.createElement('div');
      const copyrightElement = document.createElement('div');
      copyrightElement.className = 'tradingview-widget-copyright';
      
      const link = document.createElement('a');
      link.href = 'https://www.tradingview.com/';
      link.rel = 'noopener nofollow';
      link.target = '_blank';
      
      const span = document.createElement('span');
      span.className = 'blue-text';
      span.textContent = 'Track all markets on TradingView';
      
      link.appendChild(span);
      copyrightElement.appendChild(link);
      
      bitcoinWidgetRef.current.appendChild(widgetContainer);
      bitcoinWidgetRef.current.appendChild(copyrightElement);
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
      script.async = true;
      script.type = 'text/javascript';
      
      // Configure the widget
      script.innerHTML = JSON.stringify({
        symbol: "BINANCE:BTCUSDT",
        width: "100%",
        height: "100%",
        locale: "en",
        dateRange: "12M",
        colorTheme: darkMode ? "dark" : "light",
        isTransparent: false,
        autosize: true,
        largeChartUrl: "",
        chartOnly: false
      });
      
      bitcoinWidgetRef.current.appendChild(script);
    }
    
    // Cleanup function
    return () => {
      if (bitcoinWidgetRef.current) {
        bitcoinWidgetRef.current.innerHTML = '';
      }
    };
  }, [activeTab, darkMode]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Dashboard Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px overflow-x-auto">
          {['summary', 'trades', 'add', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
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
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Profit/Loss</h3>
                <p className="text-2xl font-bold text-success">+$850</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Month to date</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Win Rate</h3>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">67%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">24 out of 36 trades</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Average Win</h3>
                <p className="text-2xl font-bold text-success">+$425</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Per winning trade</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Average Loss</h3>
                <p className="text-2xl font-bold text-error">-$210</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Per losing trade</p>
              </div>
            </div>

            {/* TradingView Gold Widget */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Gold (XAU/USD)</h3>
              <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600" style={{ height: "300px" }}>
                <div ref={tradingViewRef} className="tradingview-widget-container h-full"></div>
              </div>
            </div>

            {/* TradingView Bitcoin Widget */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Bitcoin (BTC/USDT)</h3>
              <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600" style={{ height: "300px" }}>
                <div ref={bitcoinWidgetRef} className="tradingview-widget-container h-full"></div>
              </div>
            </div>

            {/* Recent Trades */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Trades</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entry</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exit</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit/Loss</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                    {recentTrades.map((trade) => (
                      <tr key={trade.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{trade.symbol}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{trade.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${trade.entry}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${trade.exit}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.profit >= 0 ? 'text-success' : 'text-error'}`}>
                          {trade.profit >= 0 ? '+' : ''}{`$${trade.profit}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{trade.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trades' && <div className="py-4"><h3 className="text-lg font-semibold mb-2 dark:text-white">All Trades</h3><p className="dark:text-gray-300">Detailed trade history will appear here.</p></div>}
        {activeTab === 'add' && <div className="py-4"><h3 className="text-lg font-semibold mb-2 dark:text-white">Add New Trade</h3><p className="dark:text-gray-300">Trade entry form will appear here.</p></div>}
        {activeTab === 'settings' && <div className="py-4"><h3 className="text-lg font-semibold mb-2 dark:text-white">Account Settings</h3><p className="dark:text-gray-300">Settings options will appear here.</p></div>}
      </div>
    </div>
  );
};

export default Dashboard;

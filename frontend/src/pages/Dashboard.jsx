import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getAccounts, getTradingDailyBooks } from '../utils/api';
import { format, parseISO } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('summary');
  const tradingViewRef = useRef(null);
  const bitcoinWidgetRef = useRef(null);
  const tickersWidgetRef = useRef(null);
  
  // Add state for real data
  const [accounts, setAccounts] = useState([]);
  const [tradingBooks, setTradingBooks] = useState([]);
  const [recentTrades, setRecentTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalTrades: 0,
    winRate: 0,
    winCount: 0,
    lossCount: 0,
    totalProfit: 0,
    averageWin: 0,
    averageLoss: 0
  });
  
  // Fetch accounts and trading data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsData = await getAccounts();
        const booksData = await getTradingDailyBooks();
        
        setAccounts(accountsData);
        setTradingBooks(booksData);
        
        // Calculate statistics
        calculateStats(accountsData, booksData);
        
        // Process recent trades
        processRecentTrades(booksData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Function to process recent trades from trading books
  const processRecentTrades = (books) => {
    // Filter books with actual trades (not "No Trade" or "No Result")
    const tradesBooks = books.filter(book => 
      book.result !== "No Trade" && book.result !== "No Result"
    );
    
    // Sort by date descending (most recent first)
    const sortedBooks = [...tradesBooks].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
    
    // Take up to 10 recent trades
    const recentBooks = sortedBooks.slice(0, 10);
    
    // Transform to the format needed for the table
    const trades = recentBooks.map((book, index) => {
      const profitLoss = book.ending_balance - book.starting_balance - book.withdraw;
      const formattedDate = format(parseISO(book.date), 'yyyy-MM-dd');
      
      return {
        id: book.id,
        symbol: book.account ? book.account.broker : 'Unknown',
        type: book.result,
        entry: book.starting_balance.toFixed(2),
        exit: book.ending_balance.toFixed(2),
        profit: profitLoss,
        date: formattedDate
      };
    });
    
    setRecentTrades(trades);
  };

  // Function to calculate statistics
  const calculateStats = (accounts, books) => {
    const totalAccounts = accounts.length;
    
    // Filter books with trade results
    const tradesBooks = books.filter(book => book.result !== "No Trade" && book.result !== "No Result");
    const totalTrades = tradesBooks.length;
    
    // Calculate win rate
    const winningTrades = tradesBooks.filter(book => book.result === "Profit Overall");
    const winCount = winningTrades.length;
    const lossCount = tradesBooks.filter(book => book.result === "Loss Overall").length;
    const winRate = totalTrades > 0 ? (winCount / totalTrades) * 100 : 0;
    
    // Calculate profit/loss
    const totalProfit = tradesBooks.reduce((sum, book) => {
      const profitLoss = book.ending_balance - book.starting_balance - book.withdraw;
      return sum + profitLoss;
    }, 0);
    
    // Calculate average win/loss
    const winningTradesProfit = winningTrades.reduce((sum, book) => {
      const profit = book.ending_balance - book.starting_balance - book.withdraw;
      return sum + profit;
    }, 0);
    
    const losingTrades = tradesBooks.filter(book => book.result === "Loss Overall");
    const losingTradesLoss = losingTrades.reduce((sum, book) => {
      const loss = book.starting_balance - book.ending_balance + book.withdraw;
      return sum + Math.abs(loss);
    }, 0);
    
    const averageWin = winningTrades.length > 0 ? winningTradesProfit / winningTrades.length : 0;
    const averageLoss = losingTrades.length > 0 ? losingTradesLoss / losingTrades.length : 0;
    
    setStats({
      totalAccounts,
      totalTrades,
      winRate,
      winCount,
      lossCount,
      totalProfit,
      averageWin,
      averageLoss
    });
  };
  
  // Load TradingView Tickers widget
  useEffect(() => {
    if (activeTab === 'summary' && tickersWidgetRef.current) {
      tickersWidgetRef.current.innerHTML = '';
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container__widget';
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
      tickersWidgetRef.current.appendChild(widgetContainer);
      tickersWidgetRef.current.appendChild(copyrightElement);
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-tickers.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        symbols: [
          {
            description: "",
            proName: "BINANCE:BTCUSDT"
          },
          {
            description: "",
            proName: "OANDA:XAUUSD"
          },
          {
            description: "",
            proName: "BLACKBULL:US30"
          },
          {
            description: "",
            proName: "CAPITALCOM:DXY"
          }
        ],
        isTransparent: false,
        showSymbolLogo: true,
        colorTheme: darkMode ? "dark" : "light",
        locale: "en"
      });
      tickersWidgetRef.current.appendChild(script);
    }
    return () => {
      if (tickersWidgetRef.current) {
        tickersWidgetRef.current.innerHTML = '';
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
            {loading ? (
              <div className="text-center py-10">
                <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Accounts</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalAccounts}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Trading accounts</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total P/L</h3>
                    <p className={`text-2xl font-bold ${stats.totalProfit >= 0 ? 'text-success' : 'text-error'}`}>
                      {stats.totalProfit >= 0 ? '+' : ''}{`$${stats.totalProfit.toFixed(2)}`}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">From {stats.totalTrades} trades</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Win Rate</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.winRate.toFixed(0)}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stats.winCount} wins, {stats.lossCount} losses</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Avg Win/Loss</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-success">+${stats.averageWin.toFixed(2)}</span>
                      <span>/</span>
                      <span className="text-error">-${stats.averageLoss.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Win/loss ratio</p>
                  </div>
                </div>

                {/* Second row stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Trades</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{stats.totalTrades}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Trading sessions</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Profit Factor</h3>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                      {stats.averageLoss > 0 ? (stats.averageWin / stats.averageLoss).toFixed(2) : 'N/A'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Avg Win ÷ Avg Loss</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-300">Last Trade</h3>
                    <p className={`text-2xl font-bold ${tradingBooks.length > 0 && (tradingBooks[0].ending_balance - tradingBooks[0].starting_balance - tradingBooks[0].withdraw) >= 0 ? 'text-success' : 'text-error'}`}>
                      {tradingBooks.length > 0 ? (
                        <>
                          {(tradingBooks[0].ending_balance - tradingBooks[0].starting_balance - tradingBooks[0].withdraw) >= 0 ? '+' : ''}
                          ${(tradingBooks[0].ending_balance - tradingBooks[0].starting_balance - tradingBooks[0].withdraw).toFixed(2)}
                        </>
                      ) : 'No trades'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {tradingBooks.length > 0 ? new Date(tradingBooks[0].date).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>

                {/* TradingView Tickers Widget */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Market Overview</h3>
                  <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                    <div ref={tickersWidgetRef} className="tradingview-widget-container"></div>
                  </div>
                </div>

                {/* Recent Trades */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Trades (Last {recentTrades.length > 0 ? recentTrades.length : '0'})</h3>
                  
                  {recentTrades.length === 0 ? (
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg text-center text-gray-600 dark:text-gray-300">
                      No trades recorded yet. Create your first trading daily book entry to get started.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Starting</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ending</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit/Loss</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
                          {recentTrades.map((trade) => (
                            <tr key={trade.id} className={trade.profit >= 0 ? "bg-green-50 dark:bg-green-900/10" : "bg-red-50 dark:bg-red-900/10"}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{trade.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-white">{trade.symbol}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  trade.type === "Profit Overall" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
                                  trade.type === "Loss Overall" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
                                  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                                }`}>
                                  {trade.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${trade.entry}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">${trade.exit}</td>
                              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${trade.profit >= 0 ? 'text-success' : 'text-error'}`}>
                                {trade.profit >= 0 ? '+' : ''}{`$${trade.profit.toFixed(2)}`}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
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

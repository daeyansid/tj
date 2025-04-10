import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const HeatMap = () => {
  const { darkMode } = useTheme();
  const cryptoHeatmapRef = useRef(null);
  const stockHeatmapRef = useRef(null);

  // Load crypto heatmap widget
  useEffect(() => {
    if (cryptoHeatmapRef.current) {
      // Clear any existing widgets
      cryptoHeatmapRef.current.innerHTML = '';
      
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
      
      cryptoHeatmapRef.current.appendChild(widgetContainer);
      cryptoHeatmapRef.current.appendChild(copyrightElement);
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';
      script.type = 'text/javascript';
      script.async = true;
      
      // Configure the widget with theme awareness
      script.innerHTML = JSON.stringify({
        dataSource: "Crypto",
        blockSize: "market_cap_calc",
        blockColor: "24h_close_change|5",
        locale: "en",
        symbolUrl: "",
        colorTheme: darkMode ? "dark" : "light",
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        isMonoSize: false,
        width: "100%",
        height: "100%"
      });
      
      cryptoHeatmapRef.current.appendChild(script);
    }
    
    // Cleanup
    return () => {
      if (cryptoHeatmapRef.current) {
        cryptoHeatmapRef.current.innerHTML = '';
      }
    };
  }, [darkMode]);

  // Load stock heatmap widget
  useEffect(() => {
    if (stockHeatmapRef.current) {
      // Clear any existing widgets
      stockHeatmapRef.current.innerHTML = '';
      
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
      
      stockHeatmapRef.current.appendChild(widgetContainer);
      stockHeatmapRef.current.appendChild(copyrightElement);
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
      script.type = 'text/javascript';
      script.async = true;
      
      // Configure the widget with theme awareness
      script.innerHTML = JSON.stringify({
        exchanges: [],
        dataSource: "SPX500",
        grouping: "sector",
        blockSize: "market_cap_basic",
        blockColor: "change",
        locale: "en",
        symbolUrl: "",
        colorTheme: darkMode ? "dark" : "light",
        hasTopBar: false,
        isDataSetEnabled: false,
        isZoomEnabled: true,
        hasSymbolTooltip: true,
        isMonoSize: false,
        width: "100%",
        height: "100%"
      });
      
      stockHeatmapRef.current.appendChild(script);
    }
    
    // Cleanup
    return () => {
      if (stockHeatmapRef.current) {
        stockHeatmapRef.current.innerHTML = '';
      }
    };
  }, [darkMode]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Page Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Market Heatmaps</h1>
        <p className="text-gray-600 dark:text-gray-400">Visual representation of market performance across sectors</p>
      </div>

      {/* Heatmap Content */}
      <div className="p-6 grid grid-cols-1 gap-8">
        {/* Crypto Heatmap */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Cryptocurrency Heatmap</h2>
          <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600" style={{ height: "500px" }}>
            <div ref={cryptoHeatmapRef} className="tradingview-widget-container h-full"></div>
          </div>
        </div>

        {/* Stock Heatmap */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">S&P 500 Heatmap</h2>
          <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600" style={{ height: "500px" }}>
            <div ref={stockHeatmapRef} className="tradingview-widget-container h-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatMap;

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTradingDailyBook, deleteTradingDailyBook } from '../utils/api';
import { format, parseISO } from 'date-fns';

const TradingDailyBookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trading daily book on component mount
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const data = await getTradingDailyBook(id);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch trading daily book details');
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // Handle book deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trading daily book entry?')) {
      try {
        await deleteTradingDailyBook(id);
        navigate('/trading-daily-books');
      } catch (err) {
        setError(err.message || 'Failed to delete trading daily book');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Calculate profit/loss
  const calculateProfitLoss = (startingBalance, endingBalance, withdraw) => {
    return endingBalance - startingBalance - withdraw;
  };

  if (loading) return <div className="text-center py-10">Loading trading daily book details...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;
  if (!book) return <div className="text-center py-10">Trading daily book entry not found</div>;

  const profitLoss = calculateProfitLoss(book.starting_balance, book.ending_balance, book.withdraw);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Trading Entry for {formatDate(book.date)}
            </h1>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              book.result === "Profit Overall" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : 
              book.result === "Loss Overall" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" :
              book.result === "Breakeven" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
              book.result === "Liquidated" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
              book.result === "No Trade" ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300" :
              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}>
              {book.result}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {book.account && book.account.account_name ? book.account.account_name : `Account #${book.account_id}`}
          </p>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/trading-daily-books"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back to Entries
          </Link>
          <Link
            to={`/trading-daily-books/${id}/edit`}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-error text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Starting Balance</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">${book.starting_balance.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Ending Balance</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">${book.ending_balance.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Withdraw</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">${book.withdraw.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Profit/Loss</h3>
            <p className={`text-2xl font-bold ${profitLoss >= 0 ? 'text-success' : 'text-error'}`}>
              {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)}
            </p>
          </div>
          
          {book.sentiment && (
            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Sentiment</h3>
              <p className="text-xl text-gray-800 dark:text-white">{book.sentiment}</p>
            </div>
          )}
        </div>
        
        {book.summary && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Summary</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{book.summary}</p>
            </div>
          </div>
        )}
        
        {book.remarks && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Remarks</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{book.remarks}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingDailyBookDetail;

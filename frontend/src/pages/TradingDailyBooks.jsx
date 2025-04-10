import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTradingDailyBooks, deleteTradingDailyBook } from '../utils/api';
import { format, parseISO } from 'date-fns';

const TradingDailyBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trading daily books on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getTradingDailyBooks();
        setBooks(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch trading daily books');
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Handle book deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trading daily book entry?')) {
      try {
        await deleteTradingDailyBook(id);
        setBooks(books.filter(book => book.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete trading daily book');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), 'MMM dd, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Calculate profit/loss for display
  const calculateProfitLoss = (startingBalance, endingBalance, withdraw) => {
    const difference = endingBalance - startingBalance - withdraw;
    return difference;
  };

  if (loading) return <div className="text-center py-10">Loading trading daily books...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Trading Daily Book</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your daily trading activities and results</p>
        </div>
        <Link
          to="/trading-daily-books/new"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Add New Entry
        </Link>
      </div>

      <div className="p-6">
        {books.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400">You haven't created any trading daily book entries yet.</p>
            <Link to="/trading-daily-books/new" className="text-primary hover:underline mt-2 inline-block">
              Create your first entry
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Account
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Starting
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ending
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Withdraw
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    P/L
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Result
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {books.map((book) => {
                  const profitLoss = calculateProfitLoss(book.starting_balance, book.ending_balance, book.withdraw);
                  return (
                    <tr key={book.id} className={
                      book.result === "Profit Overall" ? "bg-green-50 dark:bg-green-900/10" : 
                      book.result === "Loss Overall" ? "bg-red-50 dark:bg-red-900/10" : ""
                    }>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {formatDate(book.date)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {book.account ? book.account.account_name : `Account #${book.account_id}`}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ${book.starting_balance.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ${book.ending_balance.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ${book.withdraw.toFixed(2)}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${profitLoss >= 0 ? 'text-success' : 'text-error'}`}>
                        {profitLoss >= 0 ? '+' : ''}${profitLoss.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
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
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/trading-daily-books/${book.id}`}
                            className="text-primary hover:text-primary-dark"
                          >
                            View
                          </Link>
                          <Link
                            to={`/trading-daily-books/${book.id}/edit`}
                            className="text-primary hover:text-primary-dark"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="text-error hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingDailyBooks;

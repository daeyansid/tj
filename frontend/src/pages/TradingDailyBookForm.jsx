import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  createTradingDailyBook, 
  getTradingDailyBook, 
  updateTradingDailyBook, 
  getAccountsWithBalance 
} from '../utils/api';
import { format } from 'date-fns';

const RESULT_OPTIONS = [
  "Profit Overall",
  "Loss Overall",
  "Breakeven",
  "Liquidated",
  "No Trade",
  "No Result"
];

const TradingDailyBookForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    account_id: '',
    starting_balance: '',
    ending_balance: '',
    sentiment: '',
    withdraw: '0',
    summary: '',
    result: 'No Result',
    remarks: ''
  });
  
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch accounts and trading daily book data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accountsData = await getAccountsWithBalance();
        setAccounts(accountsData);
        
        if (isEditing) {
          const bookData = await getTradingDailyBook(id);
          // Format date for the input field (yyyy-MM-dd)
          const formattedDate = bookData.date ? bookData.date.substring(0, 10) : format(new Date(), 'yyyy-MM-dd');
          
          setFormData({
            date: formattedDate,
            account_id: bookData.account_id.toString(),
            starting_balance: bookData.starting_balance.toString(),
            ending_balance: bookData.ending_balance.toString(),
            sentiment: bookData.sentiment || '',
            withdraw: bookData.withdraw.toString(),
            summary: bookData.summary || '',
            result: bookData.result,
            remarks: bookData.remarks || ''
          });
        } else if (accountsData.length > 0) {
          // Pre-fill the first account and its balance for new entries
          setFormData(prev => ({
            ...prev,
            account_id: accountsData[0].id.toString(),
            starting_balance: accountsData[0].account_balance.toString()
          }));
        }
        
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // If changing account, update starting balance
    if (name === 'account_id' && !isEditing) {
      const selectedAccount = accounts.find(acc => acc.id.toString() === value);
      if (selectedAccount) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          starting_balance: selectedAccount.account_balance.toString()
        }));
        return;
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const bookData = {
        ...formData,
        account_id: parseInt(formData.account_id),
        starting_balance: parseFloat(formData.starting_balance),
        ending_balance: parseFloat(formData.ending_balance),
        withdraw: parseFloat(formData.withdraw)
      };

      if (isEditing) {
        await updateTradingDailyBook(id, bookData);
      } else {
        await createTradingDailyBook(bookData);
      }
      
      navigate('/trading-daily-books');
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} trading daily book`);
      setSubmitting(false);
    }
  };

  // Calculate profit/loss
  const calculateProfitLoss = () => {
    const startingBalance = parseFloat(formData.starting_balance) || 0;
    const endingBalance = parseFloat(formData.ending_balance) || 0;
    const withdraw = parseFloat(formData.withdraw) || 0;
    
    return endingBalance - startingBalance - withdraw;
  };

  if (loading) return <div className="text-center py-10">Loading data...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEditing ? 'Edit Trading Daily Book Entry' : 'Create New Trading Daily Book Entry'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditing ? 'Update your trading record' : 'Record your daily trading activity'}
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-error px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        {accounts.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">You need to create an account first before adding a trading daily book entry.</p>
            <button
              onClick={() => navigate('/accounts/new')}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Create Account
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date and Account Selection */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date*
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <div>
                <label htmlFor="account_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Account*
                </label>
                <select
                  id="account_id"
                  name="account_id"
                  required
                  value={formData.account_id}
                  onChange={handleChange}
                  disabled={isEditing} // Can't change account when editing
                  className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${isEditing ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  <option value="">Select Account</option>
                  {accounts.map(account => (
                    <option key={account.id} value={account.id}>
                      {account.account_name} (${account.account_balance.toFixed(2)})
                    </option>
                  ))}
                </select>
                {isEditing && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Account cannot be changed after creation
                  </p>
                )}
              </div>
              
              {/* Balance Fields */}
              <div>
                <label htmlFor="starting_balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Starting Balance*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-700 dark:text-gray-300">
                    $
                  </span>
                  <input
                    id="starting_balance"
                    name="starting_balance"
                    type="number"
                    step="0.01"
                    required
                    value={formData.starting_balance}
                    onChange={handleChange}
                    readOnly={!isEditing} // Only editable when editing
                    className={`w-full pl-8 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${!isEditing ? 'bg-gray-50 dark:bg-gray-600' : ''}`}
                  />
                </div>
                {!isEditing && (
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Auto-filled from account balance
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="ending_balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ending Balance*
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-700 dark:text-gray-300">
                    $
                  </span>
                  <input
                    id="ending_balance"
                    name="ending_balance"
                    type="number"
                    step="0.01"
                    required
                    value={formData.ending_balance}
                    onChange={handleChange}
                    className="w-full pl-8 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              {/* Withdraw and Result */}
              <div>
                <label htmlFor="withdraw" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Withdraw Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-700 dark:text-gray-300">
                    $
                  </span>
                  <input
                    id="withdraw"
                    name="withdraw"
                    type="number"
                    step="0.01"
                    value={formData.withdraw}
                    onChange={handleChange}
                    className="w-full pl-8 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="result" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Result*
                </label>
                <select
                  id="result"
                  name="result"
                  required
                  value={formData.result}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {RESULT_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              {/* P/L Display and Sentiment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Profit/Loss (Calculated)
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-600">
                  <span className={calculateProfitLoss() >= 0 ? 'text-success font-medium' : 'text-error font-medium'}>
                    {calculateProfitLoss() >= 0 ? '+' : ''}${calculateProfitLoss().toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div>
                <label htmlFor="sentiment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sentiment
                </label>
                <input
                  id="sentiment"
                  name="sentiment"
                  type="text"
                  value={formData.sentiment}
                  onChange={handleChange}
                  placeholder="How did you feel about today's trading?"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            {/* Summary */}
            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                rows="3"
                value={formData.summary}
                onChange={handleChange}
                placeholder="Summarize your trading day"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
            
            {/* Remarks */}
            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                rows="3"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Any additional notes or observations"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/trading-daily-books')}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-70"
              >
                {submitting ? 'Saving...' : isEditing ? 'Update Entry' : 'Create Entry'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TradingDailyBookForm;

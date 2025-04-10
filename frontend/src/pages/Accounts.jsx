import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAccounts, deleteAccount } from '../utils/api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch accounts on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch accounts');
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Handle account deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(id);
        setAccounts(accounts.filter(account => account.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete account');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading accounts...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Your Accounts</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your trading accounts</p>
        </div>
        <Link
          to="/accounts/new"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Add New Account
        </Link>
      </div>

      <div className="p-6">
        {accounts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400">You don't have any accounts yet.</p>
            <Link to="/accounts/new" className="text-primary hover:underline mt-2 inline-block">
              Create your first account
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Purpose
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Broker
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {account.account_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {account.purpose}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {account.broker}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${account.account_balance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/accounts/${account.id}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          View
                        </Link>
                        <Link
                          to={`/accounts/${account.id}/edit`}
                          className="text-primary hover:text-primary-dark"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(account.id)}
                          className="text-error hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accounts;

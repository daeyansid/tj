import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAccount, deleteAccount } from '../utils/api';

const AccountDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch account on component mount
  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const data = await getAccount(id);
        setAccount(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch account details');
        setLoading(false);
      }
    };

    fetchAccount();
  }, [id]);

  // Handle account deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await deleteAccount(id);
        navigate('/accounts');
      } catch (err) {
        setError(err.message || 'Failed to delete account');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading account details...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;
  if (!account) return <div className="text-center py-10">Account not found</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{account.account_name}</h1>
          <p className="text-gray-600 dark:text-gray-400">Account Details</p>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/accounts"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back to Accounts
          </Link>
          <Link
            to={`/accounts/${id}/edit`}
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
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Name</dt>
              <dd className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{account.account_name}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Purpose</dt>
              <dd className="mt-1 text-lg text-gray-900 dark:text-white">{account.purpose}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Broker</dt>
              <dd className="mt-1 text-lg text-gray-900 dark:text-white">{account.broker}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Balance</dt>
              <dd className="mt-1 text-lg font-semibold text-success">${account.account_balance.toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default AccountDetail;

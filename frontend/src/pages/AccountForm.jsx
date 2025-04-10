import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAccount, getAccount, updateAccount } from '../utils/api';

const AccountForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    account_name: '',
    purpose: '',
    broker: '',
    account_balance: ''
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch account data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchAccount = async () => {
        try {
          const data = await getAccount(id);
          setFormData({
            account_name: data.account_name,
            purpose: data.purpose,
            broker: data.broker,
            account_balance: data.account_balance.toString()
          });
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch account');
          setLoading(false);
        }
      };
      
      fetchAccount();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      const accountData = {
        ...formData,
        account_balance: parseFloat(formData.account_balance)
      };

      if (isEditing) {
        await updateAccount(id, accountData);
      } else {
        await createAccount(accountData);
      }
      
      navigate('/accounts');
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} account`);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading account data...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEditing ? 'Edit Account' : 'Create New Account'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditing ? 'Update your account information' : 'Add a new trading account'}
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-error px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="account_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Name*
              </label>
              <input
                id="account_name"
                name="account_name"
                type="text"
                required
                value={formData.account_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Purpose*
              </label>
              <input
                id="purpose"
                name="purpose"
                type="text"
                required
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="broker" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Broker*
              </label>
              <input
                id="broker"
                name="broker"
                type="text"
                required
                value={formData.broker}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="account_balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Account Balance*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-700 dark:text-gray-300">
                  $
                </span>
                <input
                  id="account_balance"
                  name="account_balance"
                  type="number"
                  step="0.01"
                  required
                  value={formData.account_balance}
                  onChange={handleChange}
                  className="w-full pl-8 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/accounts')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-70"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Account' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountForm;

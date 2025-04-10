import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTradingPlans, deleteTradingPlan, toggleTradingPlanStatus } from '../utils/api';
import { format, parseISO } from 'date-fns';

const TradingPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trading plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getTradingPlans();
        setPlans(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch trading plans');
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle plan deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trading plan?')) {
      try {
        await deleteTradingPlan(id);
        setPlans(plans.filter(plan => plan.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to delete trading plan');
      }
    }
  };

  // Handle toggling plan status
  const handleToggleStatus = async (id) => {
    try {
      const updatedPlan = await toggleTradingPlanStatus(id);
      setPlans(plans.map(plan => plan.id === id ? updatedPlan : plan));
    } catch (err) {
      setError(err.message || 'Failed to update trading plan status');
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

  if (loading) return <div className="text-center py-10">Loading trading plans...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Trading Plans</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your daily trading plans</p>
        </div>
        <Link
          to="/trading-plans/new"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Create New Plan
        </Link>
      </div>

      <div className="p-6">
        {plans.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600 dark:text-gray-400">You haven't created any trading plans yet.</p>
            <Link to="/trading-plans/new" className="text-primary hover:underline mt-2 inline-block">
              Create your first trading plan
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
                    Day
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Balance
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Target
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lots
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Risk
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {plans.map((plan) => (
                  <tr key={plan.id} className={plan.status ? "bg-green-50 dark:bg-green-900/10" : ""}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {formatDate(plan.plan_date)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {plan.day}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${plan.account_balance.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${plan.daily_target.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {plan.rounded_lots.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${plan.risk_amount.toFixed(2)} ({plan.risk_percentage.toFixed(2)}%)
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(plan.id)}
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          plan.status
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }`}
                      >
                        {plan.status ? "Done" : "Pending"}
                      </button>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/trading-plans/${plan.id}`}
                          className="text-primary hover:text-primary-dark"
                        >
                          View
                        </Link>
                        <Link
                          to={`/trading-plans/${plan.id}/edit`}
                          className="text-primary hover:text-primary-dark"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(plan.id)}
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

export default TradingPlans;

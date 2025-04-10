import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getTradingPlan, deleteTradingPlan, toggleTradingPlanStatus } from '../utils/api';
import { format, parseISO } from 'date-fns';

const TradingPlanDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trading plan on component mount
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const data = await getTradingPlan(id);
        setPlan(data);
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Failed to fetch trading plan details');
        setLoading(false);
      }
    };

    fetchPlan();
  }, [id]);

  // Handle plan deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this trading plan?')) {
      try {
        await deleteTradingPlan(id);
        navigate('/trading-plans');
      } catch (err) {
        setError(err.message || 'Failed to delete trading plan');
      }
    }
  };

  // Handle toggling plan status
  const handleToggleStatus = async () => {
    try {
      const updatedPlan = await toggleTradingPlanStatus(id);
      setPlan(updatedPlan);
    } catch (err) {
      setError(err.message || 'Failed to update trading plan status');
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

  if (loading) return <div className="text-center py-10">Loading trading plan details...</div>;
  if (error) return <div className="text-center py-10 text-error">{error}</div>;
  if (!plan) return <div className="text-center py-10">Trading plan not found</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Trading Plan for {plan.day}
            </h1>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              plan.status
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}>
              {plan.status ? "Done" : "Pending"}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{formatDate(plan.plan_date)}</p>
        </div>
        <div className="flex space-x-2">
          <Link
            to="/trading-plans"
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Back to Plans
          </Link>
          <button
            onClick={handleToggleStatus}
            className={`px-4 py-2 rounded-md text-white ${
              plan.status
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            Mark as {plan.status ? "Pending" : "Done"}
          </button>
          <Link
            to={`/trading-plans/${id}/edit`}
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
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account Balance</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">${plan.account_balance.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Daily Target</h3>
            <p className="text-2xl font-bold text-success">${plan.daily_target.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Risk Amount</h3>
            <p className="text-2xl font-bold text-error">${plan.risk_amount.toFixed(2)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{plan.risk_percentage.toFixed(2)}% of account</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Required Lots</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{plan.required_lots.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rounded Lots</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{plan.rounded_lots.toFixed(2)}</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Risk/Reward Ratio</h3>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              {(plan.tp_pips / plan.sl_pips).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SL: {plan.sl_pips} pips / TP: {plan.tp_pips} pips
            </p>
          </div>
        </div>
        
        {plan.reason && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Notes</h3>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{plan.reason}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TradingPlanDetail;

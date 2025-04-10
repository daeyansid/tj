import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTradingPlan, getTradingPlan, updateTradingPlan } from '../utils/api';
import { format } from 'date-fns';

const TradingPlanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    day: '',
    account_balance: '',
    daily_target: '',
    required_lots: '',
    rounded_lots: '',
    risk_amount: '',
    risk_percentage: '',
    sl_pips: '',
    tp_pips: '',
    status: false,
    reason: '',
    plan_date: format(new Date(), 'yyyy-MM-dd')
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch trading plan data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchPlan = async () => {
        try {
          const data = await getTradingPlan(id);
          // Format date for the input field (yyyy-MM-dd)
          const formattedDate = data.plan_date ? data.plan_date.substring(0, 10) : format(new Date(), 'yyyy-MM-dd');
          
          setFormData({
            day: data.day,
            account_balance: data.account_balance.toString(),
            daily_target: data.daily_target.toString(),
            required_lots: data.required_lots.toString(),
            rounded_lots: data.rounded_lots.toString(),
            risk_amount: data.risk_amount.toString(),
            risk_percentage: data.risk_percentage.toString(),
            sl_pips: data.sl_pips.toString(),
            tp_pips: data.tp_pips.toString(),
            status: data.status,
            reason: data.reason || '',
            plan_date: formattedDate
          });
          setLoading(false);
        } catch (err) {
          setError(err.message || 'Failed to fetch trading plan');
          setLoading(false);
        }
      };
      
      fetchPlan();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Calculate required lots and risk percentage
  const calculateDerivedValues = () => {
    const accountBalance = parseFloat(formData.account_balance) || 0;
    const dailyTarget = parseFloat(formData.daily_target) || 0;
    const slPips = parseFloat(formData.sl_pips) || 0;
    const tpPips = parseFloat(formData.tp_pips) || 0;
    const riskAmount = parseFloat(formData.risk_amount) || 0;
    
    if (accountBalance > 0 && tpPips > 0 && dailyTarget > 0) {
      // Calculate required lots based on daily target and TP pips
      // Simplified formula: required_lots = daily_target / (tp_pips * pip_value)
      // Assuming pip_value = 10 for standard lot
      const pipValue = 10;
      const requiredLots = dailyTarget / (tpPips * pipValue);
      
      // Round to nearest 0.01
      const roundedLots = Math.round(requiredLots * 100) / 100;
      
      // Calculate risk percentage if account balance and risk amount are provided
      let riskPercentage = 0;
      if (accountBalance > 0 && riskAmount > 0) {
        riskPercentage = (riskAmount / accountBalance) * 100;
      }
      
      setFormData(prev => ({
        ...prev,
        required_lots: requiredLots.toFixed(2),
        rounded_lots: roundedLots.toFixed(2),
        risk_percentage: riskPercentage.toFixed(2)
      }));
    }
  };

  // Recalculate on certain field changes
  useEffect(() => {
    if (formData.account_balance || formData.daily_target || formData.tp_pips || formData.risk_amount) {
      calculateDerivedValues();
    }
  }, [formData.account_balance, formData.daily_target, formData.tp_pips, formData.risk_amount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const planData = {
        ...formData,
        account_balance: parseFloat(formData.account_balance),
        daily_target: parseFloat(formData.daily_target),
        required_lots: parseFloat(formData.required_lots),
        rounded_lots: parseFloat(formData.rounded_lots),
        risk_amount: parseFloat(formData.risk_amount),
        risk_percentage: parseFloat(formData.risk_percentage),
        sl_pips: parseFloat(formData.sl_pips),
        tp_pips: parseFloat(formData.tp_pips)
      };

      if (isEditing) {
        await updateTradingPlan(id, planData);
      } else {
        await createTradingPlan(planData);
      }
      
      navigate('/trading-plans');
    } catch (err) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'create'} trading plan`);
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading trading plan data...</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          {isEditing ? 'Edit Trading Plan' : 'Create New Trading Plan'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {isEditing ? 'Update your trading plan' : 'Plan your trading strategy for the day'}
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-error px-4 py-3 rounded-md">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date and Day */}
            <div>
              <label htmlFor="plan_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date*
              </label>
              <input
                id="plan_date"
                name="plan_date"
                type="date"
                required
                value={formData.plan_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Day of Week*
              </label>
              <select
                id="day"
                name="day"
                required
                value={formData.day}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Status
              </label>
              <div className="flex items-center h-10 mt-1">
                <input
                  id="status"
                  name="status"
                  type="checkbox"
                  checked={formData.status}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="status" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {formData.status ? 'Done' : 'Pending'}
                </label>
              </div>
            </div>
            
            {/* Account and Target */}
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
            
            <div>
              <label htmlFor="daily_target" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Daily Target*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-700 dark:text-gray-300">
                  $
                </span>
                <input
                  id="daily_target"
                  name="daily_target"
                  type="number"
                  step="0.01"
                  required
                  value={formData.daily_target}
                  onChange={handleChange}
                  className="w-full pl-8 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="risk_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Risk Amount*
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-700 dark:text-gray-300">
                  $
                </span>
                <input
                  id="risk_amount"
                  name="risk_amount"
                  type="number"
                  step="0.01"
                  required
                  value={formData.risk_amount}
                  onChange={handleChange}
                  className="w-full pl-8 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            
            {/* Risk and Lots */}
            <div>
              <label htmlFor="risk_percentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Risk Percentage
              </label>
              <div className="relative">
                <input
                  id="risk_percentage"
                  name="risk_percentage"
                  type="number"
                  step="0.01"
                  readOnly
                  value={formData.risk_percentage}
                  className="w-full pr-8 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-700 dark:text-gray-300">
                  %
                </span>
              </div>
            </div>
            
            <div>
              <label htmlFor="required_lots" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Required Lots
              </label>
              <input
                id="required_lots"
                name="required_lots"
                type="number"
                step="0.01"
                readOnly
                value={formData.required_lots}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="rounded_lots" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rounded Lots
              </label>
              <input
                id="rounded_lots"
                name="rounded_lots"
                type="number"
                step="0.01"
                value={formData.rounded_lots}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            {/* SL and TP */}
            <div>
              <label htmlFor="sl_pips" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Stop Loss (pips)*
              </label>
              <input
                id="sl_pips"
                name="sl_pips"
                type="number"
                step="0.1"
                required
                value={formData.sl_pips}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label htmlFor="tp_pips" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Take Profit (pips)*
              </label>
              <input
                id="tp_pips"
                name="tp_pips"
                type="number"
                step="0.1"
                required
                value={formData.tp_pips}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes/Reason (optional)
            </label>
            <textarea
              id="reason"
              name="reason"
              rows="3"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Add any notes about this trading plan"
            ></textarea>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/trading-plans')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-70"
            >
              {submitting ? 'Saving...' : isEditing ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradingPlanForm;

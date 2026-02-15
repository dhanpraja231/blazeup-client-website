import { useState, useEffect } from 'react';

interface VelocityEditorProps {
  initialData: {
    transactionLimit?: number;
    period?: 'minute' | 'hour' | 'day' | 'week' | 'month';
    amountLimit?: number;
    currency?: string;
  };
  onValueChange: (data: any) => void;
}

export default function VelocityEditor({ initialData, onValueChange }: VelocityEditorProps) {
  const [transactionLimit, setTransactionLimit] = useState(initialData.transactionLimit || 10);
  const [period, setPeriod] = useState(initialData.period || 'day');
  const [amountLimit, setAmountLimit] = useState(initialData.amountLimit || 0);
  const [currency] = useState(initialData.currency || 'INR');
  
  useEffect(() => {
    onValueChange({ transactionLimit, period, amountLimit, currency });
  }, [transactionLimit, period, amountLimit, currency, onValueChange]);
  
  const periods = [
    { value: 'minute', label: 'Per Minute' },
    { value: 'hour', label: 'Per Hour' },
    { value: 'day', label: 'Per Day' },
    { value: 'week', label: 'Per Week' },
    { value: 'month', label: 'Per Month' },
  ];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Maximum Transactions
        </label>
        <input
          type="number"
          value={transactionLimit}
          onChange={(e) => setTransactionLimit(parseInt(e.target.value) || 0)}
          min="1"
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Time Period
        </label>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as any)}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {periods.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Maximum Amount (Optional)
        </label>
        <div className="flex items-center gap-2">
          <span className="text-gray-900 dark:text-gray-50">₹</span>
          <input
            type="number"
            value={amountLimit}
            onChange={(e) => setAmountLimit(parseInt(e.target.value) || 0)}
            min="0"
            placeholder="0 = no limit"
            className="flex-1 px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          Total amount limit for the period (leave 0 for no limit)
        </p>
      </div>
      
      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <strong>Example:</strong> Max {transactionLimit} transactions per {period}
          {amountLimit > 0 && ` with total amount ≤ ₹${amountLimit.toLocaleString()}`}
        </p>
      </div>
    </div>
  );
}

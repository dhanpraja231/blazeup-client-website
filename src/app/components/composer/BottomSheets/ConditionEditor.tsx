import { useState, useEffect } from 'react';
import type { Condition, ConditionOperator, ValueType } from '../types/flow';

interface ConditionEditorProps {
  initialCondition: Condition;
  onValueChange: (condition: Condition) => void;
}

export default function ConditionEditor({ initialCondition, onValueChange }: ConditionEditorProps) {
  const [condition, setCondition] = useState<Condition>(initialCondition);
  
  useEffect(() => {
    onValueChange(condition);
  }, [condition, onValueChange]);
  
  const operators: { value: ConditionOperator; label: string }[] = [
    { value: '>', label: 'Greater than (>)' },
    { value: '<', label: 'Less than (<)' },
    { value: '=', label: 'Equal to (=)' },
    { value: '>=', label: 'Greater than or equal (≥)' },
    { value: '<=', label: 'Less than or equal (≤)' },
    { value: 'contains', label: 'Contains' },
    { value: 'in', label: 'In list' },
  ];
  
  const valueTypes: { value: ValueType; label: string }[] = [
    { value: 'number', label: 'Number' },
    { value: 'string', label: 'Text' },
    { value: 'currency', label: 'Currency' },
    { value: 'list', label: 'List' },
  ];
  
  // Common field suggestions for credit card policies
  const fieldSuggestions = [
    'amount',
    'merchant',
    'category',
    'mcc_code',
    'cardholder',
    'department',
    'location',
    'transaction_count',
    'daily_total',
    'monthly_total',
    'time_of_day',
    'day_of_week',
  ];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Field
        </label>
        <input
          type="text"
          list="field-suggestions"
          value={condition.field}
          onChange={(e) => setCondition({ ...condition, field: e.target.value })}
          placeholder="e.g., amount, merchant, category"
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
        <datalist id="field-suggestions">
          {fieldSuggestions.map(field => (
            <option key={field} value={field} />
          ))}
        </datalist>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
            Operator
          </label>
          <select
            value={condition.operator}
            onChange={(e) => setCondition({ ...condition, operator: e.target.value as ConditionOperator })}
            className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {operators.map(op => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
            Value Type
          </label>
          <select
            value={condition.valueType}
            onChange={(e) => setCondition({ ...condition, valueType: e.target.value as ValueType })}
            className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {valueTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Value
        </label>
        {condition.valueType === 'list' ? (
          <textarea
            value={condition.value}
            onChange={(e) => setCondition({ ...condition, value: e.target.value })}
            placeholder="Comma-separated values: item1, item2, item3"
            rows={3}
            className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        ) : condition.valueType === 'number' || condition.valueType === 'currency' ? (
          <input
            type="number"
            value={condition.value}
            onChange={(e) => setCondition({ ...condition, value: parseFloat(e.target.value) || 0 })}
            placeholder={condition.valueType === 'currency' ? '5000' : '100'}
            className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        ) : (
          <input
            type="text"
            value={condition.value}
            onChange={(e) => setCondition({ ...condition, value: e.target.value })}
            placeholder="Enter value..."
            className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        )}
      </div>
      
      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>Example:</strong> amount &gt; 5000 (currency) checks if transaction exceeds ₹5,000
        </p>
      </div>
    </div>
  );
}

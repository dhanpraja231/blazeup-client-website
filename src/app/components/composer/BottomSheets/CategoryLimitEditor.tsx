import { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';
import type { CategoryLimit } from '../types/flow';

interface CategoryLimitEditorProps {
  initialCategory: CategoryLimit;
  onValueChange: (category: CategoryLimit) => void;
}

export default function CategoryLimitEditor({ initialCategory, onValueChange }: CategoryLimitEditorProps) {
  const [category, setCategory] = useState<CategoryLimit>(initialCategory);
  
  useEffect(() => {
    onValueChange(category);
  }, [category, onValueChange]);
  
  const handleLimitChange = (value: number[]) => {
    setCategory({ ...category, limit: value[0] });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseFloat(e.target.value);
    if (!isNaN(numValue) && numValue >= 0) {
      setCategory({ ...category, limit: numValue });
    }
  };
  
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  
  const periods = [
    { value: 'transaction', label: 'Per Transaction' },
    { value: 'day', label: 'Per Day' },
    { value: 'month', label: 'Per Month' },
    { value: 'year', label: 'Per Year' },
    { value: 'calendar_year', label: 'Per Calendar Year' },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Category Name
        </label>
        <input
          type="text"
          value={category.name}
          onChange={(e) => setCategory({ ...category, name: e.target.value })}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Limit Amount
        </label>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {currencySymbols[category.currency]}
          </span>
          <input
            type="number"
            value={category.limit}
            onChange={handleInputChange}
            className="flex-1 px-4 py-2 text-lg font-semibold text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
          Adjust with slider
        </label>
        <Slider.Root
          value={[category.limit]}
          onValueChange={handleLimitChange}
          min={0}
          max={1000000}
          step={1000}
          className="relative flex items-center select-none touch-none w-full h-5"
        >
          <Slider.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-purple-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white dark:bg-gray-200 shadow-lg border-2 border-purple-500 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            aria-label="Limit"
          />
        </Slider.Root>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>₹0</span>
          <span>₹1,000,000</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
            Currency
          </label>
          <select
            value={category.currency}
            onChange={(e) => setCategory({ ...category, currency: e.target.value as any })}
            className="w-full px-3 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
            Period
          </label>
          <select
            value={category.period}
            onChange={(e) => setCategory({ ...category, period: e.target.value as any })}
            className="w-full px-3 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

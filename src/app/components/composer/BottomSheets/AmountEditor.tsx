import { useState, useEffect } from 'react';
import * as Slider from '@radix-ui/react-slider';

interface AmountEditorProps {
  initialValue: number;
  currency?: string;
  min?: number;
  max?: number;
  onValueChange: (value: number) => void;
}

export default function AmountEditor({ 
  initialValue, 
  currency = 'INR', 
  min = 0, 
  max = 1000000,
  onValueChange 
}: AmountEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialValue.toString());
  
  useEffect(() => {
    onValueChange(value);
  }, [value, onValueChange]);
  
  const handleSliderChange = (newValue: number[]) => {
    setValue(newValue[0]);
    setInputValue(newValue[0].toString());
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    const numValue = parseFloat(e.target.value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      setValue(numValue);
    }
  };
  
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
  };
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Amount
        </label>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {currencySymbols[currency]}
          </span>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            min={min}
            max={max}
            className="flex-1 px-4 py-2 text-lg font-semibold text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-3">
          Adjust with slider
        </label>
        <Slider.Root
          value={[value]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={100}
          className="relative flex items-center select-none touch-none w-full h-5"
        >
          <Slider.Track className="bg-gray-200 dark:bg-gray-700 relative grow rounded-full h-2">
            <Slider.Range className="absolute bg-blue-500 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 bg-white dark:bg-gray-200 shadow-lg border-2 border-blue-500 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Amount"
          />
        </Slider.Root>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>{currencySymbols[currency]}{min.toLocaleString()}</span>
          <span>{currencySymbols[currency]}{max.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

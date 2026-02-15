import { useState,useEffect } from 'react';

interface TriggerEditorProps {
  initialData: {
    label: string;
    description?: string;
    event?: string;
    frequency?: string;
  };
  onValueChange: (data: any) => void;
}

export default function TriggerEditor({ initialData, onValueChange }: TriggerEditorProps) {
  const [data, setData] = useState(initialData);
  
  useEffect(() => {
    onValueChange(data);
  }, [data, onValueChange]);
  
  const frequencies = ['real-time', 'daily', 'weekly', 'monthly'];
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Trigger Name
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => setData({ ...data, label: e.target.value })}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="e.g., Card Purchase Made"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Description
        </label>
        <textarea
          value={data.description || ''}
          onChange={(e) => setData({ ...data, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          placeholder="Describe when this trigger activates..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Event Type
        </label>
        <input
          type="text"
          value={data.event || ''}
          onChange={(e) => setData({ ...data, event: e.target.value })}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="e.g., purchase_made, expense_submitted"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Frequency
        </label>
        <select
          value={data.frequency || 'real-time'}
          onChange={(e) => setData({ ...data, frequency: e.target.value })}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {frequencies.map(freq => (
            <option key={freq} value={freq}>{freq.charAt(0).toUpperCase() + freq.slice(1)}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

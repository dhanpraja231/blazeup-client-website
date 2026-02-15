import { useState, useEffect } from 'react';

interface TimeEditorProps {
  initialData: {
    startTime?: string;
    endTime?: string;
    allowedDays?: string[];
  };
  onValueChange: (data: any) => void;
}

export default function TimeEditor({ initialData, onValueChange }: TimeEditorProps) {
  const [startTime, setStartTime] = useState(initialData.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialData.endTime || '17:00');
  const [allowedDays, setAllowedDays] = useState<string[]>(initialData.allowedDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  
  useEffect(() => {
    onValueChange({ startTime, endTime, allowedDays });
  }, [startTime, endTime, allowedDays, onValueChange]);
  
  const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  const toggleDay = (day: string) => {
    if (allowedDays.includes(day)) {
      setAllowedDays(allowedDays.filter(d => d !== day));
    } else {
      setAllowedDays([...allowedDays, day]);
    }
  };
  
  const setPreset = (preset: 'business' | 'weekend' | 'all') => {
    switch (preset) {
      case 'business':
        setAllowedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
        setStartTime('09:00');
        setEndTime('17:00');
        break;
      case 'weekend':
        setAllowedDays(['Sat', 'Sun']);
        break;
      case 'all':
        setAllowedDays(allDays);
        break;
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Time Range
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Allowed Days
        </label>
        <div className="flex gap-2">
          {allDays.map((day) => (
            <button
              key={day}
              onClick={() => toggleDay(day)}
              className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
                allowedDays.includes(day)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Quick Presets
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setPreset('business')}
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-50 transition-colors"
          >
            Business Hours
          </button>
          <button
            onClick={() => setPreset('weekend')}
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-50 transition-colors"
          >
            Weekends
          </button>
          <button
            onClick={() => setPreset('all')}
            className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-gray-50 transition-colors"
          >
            24/7
          </button>
        </div>
      </div>
      
      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          <strong>Active:</strong> {allowedDays.join(', ')} from {startTime} to {endTime}
        </p>
      </div>
    </div>
  );
}

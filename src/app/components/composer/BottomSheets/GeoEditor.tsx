import { useState, useEffect } from 'react';

interface GeoEditorProps {
  initialData: {
    allowedCountries?: string[];
    restrictionType?: 'allow' | 'block';
  };
  onValueChange: (data: any) => void;
}

export default function GeoEditor({ initialData, onValueChange }: GeoEditorProps) {
  const [allowedCountries, setAllowedCountries] = useState<string[]>(initialData.allowedCountries || []);
  const [restrictionType, setRestrictionType] = useState(initialData.restrictionType || 'allow');
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    onValueChange({ allowedCountries, restrictionType });
  }, [allowedCountries, restrictionType, onValueChange]);
  
  const commonCountries = [
    'India', 'United States', 'United Kingdom', 'Canada', 'Australia',
    'Singapore', 'UAE', 'Germany', 'France', 'Japan', 'China'
  ];
  
  const handleAdd = () => {
    if (inputValue.trim() && !allowedCountries.includes(inputValue.trim())) {
      setAllowedCountries([...allowedCountries, inputValue.trim()]);
      setInputValue('');
    }
  };
  
  const handleRemove = (country: string) => {
    setAllowedCountries(allowedCountries.filter(c => c !== country));
  };
  
  const handleAddCommon = (country: string) => {
    if (!allowedCountries.includes(country)) {
      setAllowedCountries([...allowedCountries, country]);
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Restriction Type
        </label>
        <select
          value={restrictionType}
          onChange={(e) => setRestrictionType(e.target.value as 'allow' | 'block')}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          <option value="allow">Allow Listed Countries Only</option>
          <option value="block">Block Listed Countries</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Add Country
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="e.g., India"
            className="flex-1 px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Add
          </button>
        </div>
      </div>
      
      {allowedCountries.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
            {restrictionType === 'allow' ? 'Allowed' : 'Blocked'} Countries ({allowedCountries.length})
          </label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {allowedCountries.map((country, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <span className="text-sm text-gray-900 dark:text-gray-50">{country}</span>
                <button
                  onClick={() => handleRemove(country)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Common Countries
        </label>
        <div className="flex flex-wrap gap-2">
          {commonCountries.map((country) => (
            <button
              key={country}
              onClick={() => handleAddCommon(country)}
              className="px-3 py-1 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
            >
              {country}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

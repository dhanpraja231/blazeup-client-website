import { useState, useEffect } from 'react';

interface MCCEditorProps {
  initialData: {
    allowedMCCs?: string[];
    restrictionType?: 'allow' | 'block';
  };
  onValueChange: (data: any) => void;
}

export default function MCCEditor({ initialData, onValueChange }: MCCEditorProps) {
  const [allowedMCCs, setAllowedMCCs] = useState<string[]>(initialData.allowedMCCs || []);
  const [restrictionType, setRestrictionType] = useState(initialData.restrictionType || 'allow');
  const [inputValue, setInputValue] = useState('');
  
  useEffect(() => {
    onValueChange({ allowedMCCs, restrictionType });
  }, [allowedMCCs, restrictionType, onValueChange]);
  
  const commonMCCs = [
    { code: '5411', name: 'Grocery Stores, Supermarkets' },
    { code: '5812', name: 'Eating Places, Restaurants' },
    { code: '5541', name: 'Service Stations' },
    { code: '5912', name: 'Drug Stores, Pharmacies' },
    { code: '5310', name: 'Discount Stores' },
    { code: '4111', name: 'Transportation - Commuter' },
    { code: '7011', name: 'Hotels, Motels' },
    { code: '5732', name: 'Electronics Stores' },
    { code: '5942', name: 'Book Stores' },
    { code: '5999', name: 'Miscellaneous Retail' },
  ];
  
  const handleAdd = () => {
    if (inputValue.trim() && !allowedMCCs.includes(inputValue.trim())) {
      setAllowedMCCs([...allowedMCCs, inputValue.trim()]);
      setInputValue('');
    }
  };
  
  const handleRemove = (mcc: string) => {
    setAllowedMCCs(allowedMCCs.filter(m => m !== mcc));
  };
  
  const handleAddCommon = (code: string, name: string) => {
    const entry = `${code} - ${name}`;
    if (!allowedMCCs.includes(entry)) {
      setAllowedMCCs([...allowedMCCs, entry]);
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
          <option value="allow">Allow Listed MCCs Only</option>
          <option value="block">Block Listed MCCs</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Add MCC Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="e.g., 5411 - Grocery Stores"
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
      
      {allowedMCCs.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
            {restrictionType === 'allow' ? 'Allowed' : 'Blocked'} MCCs ({allowedMCCs.length})
          </label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {allowedMCCs.map((mcc, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <span className="text-sm text-gray-900 dark:text-gray-50">{mcc}</span>
                <button
                  onClick={() => handleRemove(mcc)}
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
          Common MCC Codes
        </label>
        <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto">
          {commonMCCs.map((mcc) => (
            <button
              key={mcc.code}
              onClick={() => handleAddCommon(mcc.code, mcc.name)}
              className="text-left p-2 text-sm bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded transition-colors"
            >
              <span className="font-mono text-blue-600 dark:text-blue-400">{mcc.code}</span>
              <span className="text-gray-700 dark:text-gray-300"> - {mcc.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

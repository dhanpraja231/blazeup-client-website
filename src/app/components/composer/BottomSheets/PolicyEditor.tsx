import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { PolicyItem } from '../types/flow';

interface PolicyEditorProps {
  initialData: {
    label: string;
    description?: string;
    policyType?: 'vendor_list' | 'spending_limit' | 'approval_required';
    items?: PolicyItem[];
  };
  onValueChange: (data: any) => void;
}

export default function PolicyEditor({ initialData, onValueChange }: PolicyEditorProps) {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    onValueChange(data);
  }, [data, onValueChange]);
  
  const policyTypes = [
    { value: 'vendor_list', label: 'Vendor List' },
    { value: 'spending_limit', label: 'Spending Limit' },
    { value: 'approval_required', label: 'Approval Required' },
  ];
  
  // Sample available policies
  const availablePolicies = [
    { id: '1', name: 'Approved Vendors Only', type: 'vendor_list' },
    { id: '2', name: 'Department Budget Limits', type: 'spending_limit' },
    { id: '3', name: 'Manager Approval Required', type: 'approval_required' },
    { id: '4', name: 'Travel Policy', type: 'vendor_list' },
    { id: '5', name: 'Per Diem Limits', type: 'spending_limit' },
  ];
  
  const filteredPolicies = availablePolicies.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Policy Name
        </label>
        <input
          type="text"
          value={data.label}
          onChange={(e) => setData({ ...data, label: e.target.value })}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          placeholder="e.g., Vendor Approval Check"
        />
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Policy Type
        </label>
        <select
          value={data.policyType || 'vendor_list'}
          onChange={(e) => setData({ ...data, policyType: e.target.value as any })}
          className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {policyTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
          Select Existing Policy
        </label>
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Search policies..."
          />
        </div>
        <div className="max-h-48 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg">
          {filteredPolicies.map(policy => (
            <button
              key={policy.id}
              onClick={() => setData({ ...data, label: policy.name, policyType: policy.type as any })}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors text-gray-900 dark:text-gray-50 text-sm"
            >
              <div className="font-medium">{policy.name}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{policy.type.replace('_', ' ')}</div>
            </button>
          ))}
        </div>
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
          placeholder="Describe this policy check..."
        />
      </div>
    </div>
  );
}

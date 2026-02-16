import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Grid3X3, Plus, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';
import { useUIStore } from '../store/uiStore';

function CategoryLimitsNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const openBottomSheet = useUIStore((state) => state.openBottomSheet);
  const { deleteElements } = useReactFlow();
  
  const handleEditCategory = (category: any, index: number) => {
    openBottomSheet('category', { category, index, nodeId: id }, id);
  };
  
  const handleAddCategory = () => {
    openBottomSheet('category', { 
      category: { name: '', limit: 0, currency: 'INR', period: 'year' }, 
      index: -1, // -1 indicates new category
      nodeId: id 
    }, id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    const symbols: Record<string, string> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
    };
    return `${symbols[currency] || currency}${amount.toLocaleString()}`;
  };
  
  const formatPeriod = (period: string) => {
    return period.replace('_', ' ');
  };
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative rounded-xl border-2 transition-all duration-200
        w-[360px] min-h-[200px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-[#F3E8FF] dark:bg-[#3A2E4A]
        border-[#A855F7]
      `}
    >
      {/* Delete Button - shown when selected */}
      {selected && (
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors"
          aria-label="Delete node"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-purple-300 dark:border-purple-700">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-purple-600 flex items-center justify-center">
          <Grid3X3 className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-purple-900 dark:text-purple-50">Category Limits</div>
      </div>
      
      {/* Body */}
      <div className="px-4 py-3 space-y-2">
        {data.categories && data.categories.length > 0 ? (
          data.categories.map((category, index) => (
            <div
              key={index}
              onClick={() => handleEditCategory(category, index)}
              className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded p-2 transition-colors flex items-center justify-between"
            >
              <div className="flex-1">
                <div className="font-semibold text-sm text-purple-900 dark:text-purple-50">
                  {category.name}
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-300">
                  per {formatPeriod(category.period)}
                </div>
              </div>
              <div className="font-bold text-base text-purple-900 dark:text-purple-50">
                {formatCurrency(category.limit, category.currency)}
              </div>
            </div>
          ))
        ) : (
          <div className="font-medium text-base text-gray-900 dark:text-gray-100">
            {data.label}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 border-t border-purple-100 dark:border-purple-900/30">
        <button 
          onClick={handleAddCategory}
          className="text-xs text-purple-700 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add category
        </button>
      </div>
      
      {/* Pass handle on right side */}
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Reject handle on bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="reject"
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(CategoryLimitsNode);

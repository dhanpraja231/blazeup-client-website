import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { TrendingUp, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';

function BudgetTrackerNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const budget = data.metadata?.totalBudget || 100000;
  const spent = data.metadata?.spent || 0;
  const period = data.metadata?.period || 'month';
  const percentage = Math.min((spent / budget) * 100, 100);
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative rounded-xl border-2 transition-all duration-200
        w-[340px] min-h-[160px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-[#D1FAE5] dark:bg-[#1E4A3A]
        border-[#10B981]
      `}
    >
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
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <div className="flex items-center gap-3 px-4 py-3 border-b border-emerald-300 dark:border-emerald-700">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-emerald-900 dark:text-emerald-50">Budget Tracker</div>
      </div>
      
      <div className="px-4 py-3">
        <div className="font-semibold text-base text-emerald-900 dark:text-emerald-50 mb-2">
          {data.label || 'Department Budget'}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-emerald-700 dark:text-emerald-200">Spent</span>
            <span className="font-bold text-emerald-900 dark:text-emerald-50">
              ₹{spent.toLocaleString()} / ₹{budget.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-emerald-200 dark:bg-emerald-900/30 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all" 
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-300">
            {percentage.toFixed(1)}% used this {period}
          </div>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="reject"
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(BudgetTrackerNode);

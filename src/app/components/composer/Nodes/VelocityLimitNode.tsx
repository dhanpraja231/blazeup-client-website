import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { TrendingUp, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';
import { useUIStore } from '../store/uiStore';

function VelocityLimitNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const openBottomSheet = useUIStore((state) => state.openBottomSheet);
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const handleEdit = () => {
    openBottomSheet('velocity', {
      metadata: data.metadata || { transactionLimit: 10, period: 'day' }
    }, id);
  };
  
  const limit = data.metadata?.transactionLimit || 10;
  const period = data.metadata?.period || 'day';
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={handleEdit}
      className={`
        relative rounded-xl border-2 transition-all duration-200 cursor-pointer
        w-[320px] min-h-[140px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-[#FED7AA] dark:bg-[#4A2E1A]
        border-[#FB923C]
        hover:shadow-xl
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
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <div className="flex items-center gap-3 px-4 py-3 border-b border-orange-300 dark:border-orange-700">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-orange-600 flex items-center justify-center">
          <TrendingUp className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-orange-900 dark:text-orange-50">Velocity Limit</div>
      </div>
      
      <div className="px-4 py-3">
        <div className="font-semibold text-base text-orange-900 dark:text-orange-50 mb-1">
          {data.label || 'Transaction Frequency'}
        </div>
        <div className="text-sm text-orange-700 dark:text-orange-200">
          Max {limit} transactions per {period}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="reject"
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(VelocityLimitNode);

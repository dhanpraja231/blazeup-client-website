import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { CreditCard, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';
import { useUIStore } from '../store/uiStore';

function MCCCheckNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const openBottomSheet = useUIStore((state) => state.openBottomSheet);
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const handleEdit = () => {
    openBottomSheet('mcc', {
      metadata: data.metadata || { allowedMCCs: [], restrictionType: 'allow' }
    }, id);
  };
  
  // Common MCC categories
  const mccCategories = data.metadata?.allowedMCCs || [];
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={handleEdit}
      className={`
        relative rounded-xl border-2 transition-all duration-200 cursor-pointer
        w-[340px] min-h-[160px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-[#E0F2FE] dark:bg-[#1E3A4A]
        border-[#0EA5E9]
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
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <div className="flex items-center gap-3 px-4 py-3 border-b border-cyan-300 dark:border-cyan-700">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-cyan-600 flex items-center justify-center">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-cyan-900 dark:text-cyan-50">MCC Code Check</div>
      </div>
      
      <div className="px-4 py-3">
        <div className="font-semibold text-base text-cyan-900 dark:text-cyan-50 mb-2">
          {data.label || 'Merchant Category Codes'}
        </div>
        {mccCategories.length > 0 ? (
          <div className="space-y-1">
            {mccCategories.slice(0, 3).map((mcc: string, idx: number) => (
              <div key={idx} className="text-xs text-cyan-700 dark:text-cyan-200 bg-cyan-50 dark:bg-cyan-900/30 px-2 py-1 rounded">
                {mcc}
              </div>
            ))}
            {mccCategories.length > 3 && (
              <div className="text-xs text-cyan-600 dark:text-cyan-300">
                +{mccCategories.length - 3} more
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-cyan-700 dark:text-cyan-200">
            Click to configure allowed MCCs
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="reject"
        className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(MCCCheckNode);

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { GitBranch, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';
import { useUIStore } from '../store/uiStore';

function ConditionNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const openBottomSheet = useUIStore((state) => state.openBottomSheet);
  const { deleteElements } = useReactFlow();
  
  const handleEditCondition = () => {
    openBottomSheet('condition', { condition: data.conditions?.[0] || { field: '', operator: '>', value: '', valueType: 'number' }, index: 0, nodeId: id }, id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const condition = data.conditions?.[0];
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative rounded-xl border-2 transition-all duration-200
        w-[280px] min-h-[120px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-[#FEF3C7] dark:bg-[#4A3520]
        border-[#F59E0B]
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
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-amber-300 dark:border-amber-700">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-amber-600 flex items-center justify-center">
          <GitBranch className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-amber-900 dark:text-amber-50">Condition</div>
      </div>
      
      {/* Body */}
      <div 
        className="px-4 py-3 cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded transition-colors"
        onClick={handleEditCondition}
      >
        {condition ? (
          <>
            <div className="font-semibold text-sm text-amber-900 dark:text-amber-50">
              {condition.field}
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-200 mt-0.5">
              <span className="font-mono">{condition.operator}</span>{' '}
              <span className="font-semibold">{condition.value}</span>
            </div>
          </>
        ) : (
          <div className="font-semibold text-base text-amber-900 dark:text-amber-50">
            {data.label || 'Click to set condition'}
          </div>
        )}
      </div>
      
      {/* Accept handle on right side (middle) */}
      <Handle
        type="source"
        position={Position.Right}
        id="yes"
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Reject handle on bottom (center) */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(ConditionNode);

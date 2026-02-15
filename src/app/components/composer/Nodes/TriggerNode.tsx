import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Zap, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';
import { useUIStore } from '../store/uiStore';

function TriggerNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const openBottomSheet = useUIStore((state) => state.openBottomSheet);
  const { deleteElements } = useReactFlow();
  
  const handleEdit = () => {
    openBottomSheet('trigger', { trigger: data }, id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative rounded-xl border-2 transition-all duration-200
        w-[300px] shadow-lg overflow-hidden
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]
        dark:from-[#1E3A5F] dark:to-[#2A4A6F]
        border-[#3B82F6]
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
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-blue-200 dark:border-blue-800">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-blue-900 dark:text-blue-50">Trigger</div>
      </div>
      
      {/* Body */}
      <div 
        className="px-4 py-3 cursor-pointer hover:bg-blue-500/10 transition-colors"
        onClick={handleEdit}
      >
        <div className="font-semibold text-base text-blue-900 dark:text-blue-50 mb-1 line-clamp-2">
          {data.label}
        </div>
        {data.description && (
          <div className="text-sm text-blue-700 dark:text-blue-200 line-clamp-2">
            {data.description}
          </div>
        )}
      </div>
      
      {/* Footer */}
      {(data.event || data.frequency) && (
        <div className="px-4 py-2 text-xs text-blue-600 dark:text-blue-300 border-t border-blue-200 dark:border-blue-800">
          {data.frequency && <span className="capitalize">{data.frequency}</span>}
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(TriggerNode);

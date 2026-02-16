import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Clock, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';
import { useUIStore } from '../store/uiStore';

function TimeRestrictionNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const openBottomSheet = useUIStore((state) => state.openBottomSheet);
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const handleEdit = () => {
    openBottomSheet('time', {
      metadata: data.metadata || { startTime: '09:00', endTime: '17:00', allowedDays: [] }
    }, id);
  };
  
  const startTime = data.metadata?.startTime || '09:00';
  const endTime = data.metadata?.endTime || '17:00';
  const days = data.metadata?.allowedDays || ['Mon-Fri'];
  
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
        bg-[#CCFBF1] dark:bg-[#1E4A4A]
        border-[#14B8A6]
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
        className="!w-3 !h-3 !bg-teal-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <div className="flex items-center gap-3 px-4 py-3 border-b border-teal-300 dark:border-teal-700">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center">
          <Clock className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-teal-900 dark:text-teal-50">Time Restriction</div>
      </div>
      
      <div className="px-4 py-3">
        <div className="font-semibold text-base text-teal-900 dark:text-teal-50 mb-1">
          {data.label || 'Business Hours'}
        </div>
        <div className="text-sm text-teal-700 dark:text-teal-200">
          {startTime} - {endTime}
        </div>
        <div className="text-xs text-teal-600 dark:text-teal-300 mt-1">
          {days.join(', ')}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        className="!w-3 !h-3 !bg-teal-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="reject"
        className="!w-3 !h-3 !bg-teal-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(TimeRestrictionNode);

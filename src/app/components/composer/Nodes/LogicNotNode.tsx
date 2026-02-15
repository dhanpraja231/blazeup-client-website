import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Ban, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';

function LogicNotNode({ selected, id }: NodeProps<PolicyNodeData>) {
  const { deleteElements } = useReactFlow();
  
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
        w-[240px] min-h-[120px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-[#FEE2E2] dark:bg-[#4A1E1E]
        border-[#EF4444]
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
      
      {/* Single target handle for input */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-red-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <div className="flex flex-col items-center justify-center h-full px-4 py-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center mb-2">
          <Ban className="w-6 h-6 text-white" />
        </div>
        <div className="font-bold text-2xl text-red-900 dark:text-red-50">NOT</div>
        <div className="text-xs text-red-700 dark:text-red-200 mt-1 text-center">
          Inverts the condition
        </div>
      </div>
      
      {/* Pass handle on right */}
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        className="!w-3 !h-3 !bg-red-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Fail handle on bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="fail"
        className="!w-3 !h-3 !bg-red-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(LogicNotNode);

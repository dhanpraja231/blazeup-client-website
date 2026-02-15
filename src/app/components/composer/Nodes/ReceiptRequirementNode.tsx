import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Receipt, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';

function ReceiptRequirementNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const threshold = data.metadata?.threshold || 1000;
  const required = data.metadata?.alwaysRequired || false;
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative rounded-xl border-2 transition-all duration-200
        w-[320px] min-h-[140px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-[#ECFCCB] dark:bg-[#3A4A1E]
        border-[#84CC16]
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
        className="!w-3 !h-3 !bg-lime-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <div className="flex items-center gap-3 px-4 py-3 border-b border-lime-300 dark:border-lime-700">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-lime-600 flex items-center justify-center">
          <Receipt className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-lime-900 dark:text-lime-50">Receipt Check</div>
      </div>
      
      <div className="px-4 py-3">
        <div className="font-semibold text-base text-lime-900 dark:text-lime-50 mb-1">
          {data.label || 'Receipt Requirement'}
        </div>
        <div className="text-sm text-lime-700 dark:text-lime-200">
          {required ? 'Always required' : `Required for amounts ≥ ₹${threshold.toLocaleString()}`}
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        className="!w-3 !h-3 !bg-lime-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="reject"
        className="!w-3 !h-3 !bg-lime-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(ReceiptRequirementNode);

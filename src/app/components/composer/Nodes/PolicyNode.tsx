import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Shield, ExternalLink, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';
import { useUIStore } from '../store/uiStore';

function PolicyNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const { openModal, openBottomSheet } = useUIStore();
  const { deleteElements } = useReactFlow();
  
  const handleOpenPolicy = () => {
    if (data.policyType === 'vendor_list') {
      openModal('vendor_list', { items: data.items || [] }, id);
    } else {
      // Open bottom sheet for editing
      openBottomSheet('policy', { policy: data }, id);
    }
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
        w-[340px] min-h-[180px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-[#E0E7FF] dark:bg-[#2E3A54]
        border-[#6366F1]
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
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-indigo-300 dark:border-indigo-700">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-indigo-900 dark:text-indigo-50">Policy Check</div>
      </div>
      
      {/* Body */}
      <div className="px-4 py-3">
        <div
          onClick={handleOpenPolicy}
          className="cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded p-2 -m-2 transition-colors group"
        >
          <div className="font-semibold text-base text-indigo-900 dark:text-indigo-50 mb-1 flex items-center gap-2">
            {data.label}
            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {data.description && (
            <div className="text-sm text-indigo-700 dark:text-indigo-200">
              {data.description}
            </div>
          )}
          {data.items && data.items.length > 0 && (
            <div className="text-xs text-indigo-600 dark:text-indigo-300 mt-2">
              {data.items.length} items configured
            </div>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-500 border-t border-indigo-100 dark:border-indigo-900/30">
        {data.policyType && (
          <span className="capitalize">{data.policyType.replace('_', ' ')}</span>
        )}
      </div>
      
      {/* Compliant handle on right side */}
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Reject handle on bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="reject"
        className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(PolicyNode);

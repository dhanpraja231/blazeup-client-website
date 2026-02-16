import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Bell, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';

function NotificationNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const recipients = data.metadata?.recipients || [];
  const channels = data.metadata?.channels || ['email'];
  
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
        bg-[#FEF3C7] dark:bg-[#4A3520]
        border-[#FBBF24]
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
        className="!w-3 !h-3 !bg-yellow-500 !border-2 !border-white dark:!border-gray-800"
      />
      
      <div className="flex items-center gap-3 px-4 py-3 border-b border-yellow-300 dark:border-yellow-700">
        <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-yellow-500 flex items-center justify-center">
          <Bell className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-yellow-900 dark:text-yellow-50">Notification</div>
      </div>
      
      <div className="px-4 py-3">
        <div className="font-semibold text-base text-yellow-900 dark:text-yellow-50 mb-1">
          {data.label || 'Send Notification'}
        </div>
        <div className="text-sm text-yellow-700 dark:text-yellow-200">
          Via: {channels.join(', ')}
        </div>
        {recipients.length > 0 && (
          <div className="text-xs text-yellow-600 dark:text-yellow-300 mt-1">
            To: {recipients.join(', ')}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-yellow-500 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(NotificationNode);

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Check, X, Clock } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';
import { useUIStore } from '../store/uiStore';

function ActionNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const openBottomSheet = useUIStore((state) => state.openBottomSheet);
  const { deleteElements } = useReactFlow();
  
  const handleEdit = () => {
    openBottomSheet('action', { action: data }, id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const getColors = () => {
    switch (data.actionType) {
      case 'approve':
        return {
          bg: 'bg-[#D1FAE5] dark:bg-[#1E4A3A]',
          border: 'border-[#10B981]',
          icon: Check,
          iconBg: 'bg-emerald-500',
        };
      case 'reject':
        return {
          bg: 'bg-[#FEE2E2] dark:bg-[#4A1E1E]',
          border: 'border-[#EF4444]',
          icon: X,
          iconBg: 'bg-red-500',
        };
      case 'request_approval':
        return {
          bg: 'bg-[#F3F4F6] dark:bg-[#3A3A3A]',
          border: 'border-[#9CA3AF]',
          icon: Clock,
          iconBg: 'bg-gray-500',
        };
      default:
        return {
          bg: 'bg-[#D1FAE5] dark:bg-[#1E4A3A]',
          border: 'border-[#10B981]',
          icon: Check,
          iconBg: 'bg-emerald-500',
        };
    }
  };
  
  const colors = getColors();
  const Icon = colors.icon;
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative rounded-xl border-2 transition-all duration-200
        w-[300px] min-h-[120px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${colors.bg} ${colors.border}
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
      
      {/* Target handle on Top for reject actions, Left for others */}
      <Handle
        type="target"
        position={data.actionType === 'reject' ? Position.Top : Position.Left}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300 dark:border-gray-700">
        <div className={`flex-shrink-0 w-6 h-6 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-sm text-gray-900 dark:text-gray-50">Action</div>
      </div>
      
      {/* Body */}
      <div className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/30 rounded-lg transition-colors" onClick={handleEdit}>
        <div className="font-semibold text-base text-gray-900 dark:text-gray-50 mb-1">
          {data.label}
        </div>
        {data.message && (
          <div className="text-sm text-gray-700 dark:text-gray-200">
            {data.message}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(ActionNode);

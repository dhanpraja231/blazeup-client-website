import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Mail, MessageSquare, Sheet, Calendar, Database, Box, X } from 'lucide-react';
import type { PolicyNodeData, IntegrationService } from '../types/flow';
import { useUIStore } from '../store/uiStore';

const serviceIcons: Record<IntegrationService, any> = {
  slack: MessageSquare,
  sheets: Sheet,
  calendar: Calendar,
  email: Mail,
  salesforce: Database,
  jira: Box,
};

const serviceColors: Record<IntegrationService, { accent: string; bg: string }> = {
  slack: { accent: '#4A154B', bg: 'bg-purple-50 dark:bg-purple-950' },
  sheets: { accent: '#0F9D58', bg: 'bg-green-50 dark:bg-green-950' },
  calendar: { accent: '#4285F4', bg: 'bg-blue-50 dark:bg-blue-950' },
  email: { accent: '#EA4335', bg: 'bg-red-50 dark:bg-red-950' },
  salesforce: { accent: '#00A1E0', bg: 'bg-cyan-50 dark:bg-cyan-950' },
  jira: { accent: '#0052CC', bg: 'bg-blue-50 dark:bg-blue-950' },
};

function IntegrationNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const openBottomSheet = useUIStore((state) => state.openBottomSheet);
  const { deleteElements } = useReactFlow();
  const Icon = data.service ? serviceIcons[data.service] : MessageSquare;
  const colors = data.service ? serviceColors[data.service] : serviceColors.email;
  
  const handleEditIntegration = () => {
    openBottomSheet('message', { config: data.config, service: data.service }, id);
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
        w-[320px] min-h-[140px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        bg-white dark:bg-[#2A2A2A]
        border-gray-200 dark:border-gray-700
        border-l-4
      `}
      style={{ borderLeftColor: colors.accent }}
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
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white dark:!border-gray-800"
      />
      
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-300 dark:border-gray-700">
        <div 
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: colors.accent }}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm text-gray-900 dark:text-gray-50">
            {data.service && data.service.charAt(0).toUpperCase() + data.service.slice(1)}
          </div>
          {data.config?.channel && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {data.config.channel}
            </div>
          )}
        </div>
      </div>
      
      {/* Body */}
      <div 
        className="px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
        onClick={handleEditIntegration}
      >
        <div className="font-semibold text-sm text-gray-900 dark:text-gray-50 mb-1">
          {data.label}
        </div>
        {data.config?.template && (
          <div className="text-xs text-gray-700 dark:text-gray-200 line-clamp-2">
            {data.config.template}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="px-4 py-2 text-xs text-gray-600 dark:text-gray-300 border-t border-gray-100 dark:border-gray-800">
        <span className="inline-flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Connected
        </span>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white dark:!border-gray-800"
      />
    </motion.div>
  );
}

export default memo(IntegrationNode);

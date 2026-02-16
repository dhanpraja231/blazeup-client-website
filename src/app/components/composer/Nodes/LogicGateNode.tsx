import { memo } from 'react';
import { motion } from 'framer-motion';
import { Handle, Position, useReactFlow } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { Network, X } from 'lucide-react';
import type { PolicyNodeData } from '../types/flow';

function LogicGateNode({ data, selected, id }: NodeProps<PolicyNodeData>) {
  const { deleteElements } = useReactFlow();
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };
  
  const gateType = data.metadata?.gateType || 'AND';
  const inputCount = data.metadata?.inputCount || 2;
  
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative rounded-xl border-2 transition-all duration-200
        w-[280px] min-h-[140px] shadow-lg
        ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${gateType === 'AND' ? 'bg-[#DBEAFE] dark:bg-[#1E3A5F] border-[#3B82F6]' : 
          gateType === 'OR' ? 'bg-[#FEF3C7] dark:bg-[#4A3520] border-[#FBBF24]' :
          'bg-[#FCE7F3] dark:bg-[#4A1E3A] border-[#EC4899]'}
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
      
      {/* Multiple input handles on left */}
      {Array.from({ length: inputCount }).map((_, i) => (
        <Handle
          key={`input-${i}`}
          type="target"
          position={Position.Left}
          id={`input-${i}`}
          style={{ top: `${((i + 1) / (inputCount + 1)) * 100}%` }}
          className="!w-3 !h-3 !bg-gray-500 !border-2 !border-white dark:!border-gray-800"
        />
      ))}
      
      <div className={`flex items-center gap-3 px-4 py-3 border-b ${
        gateType === 'AND' ? 'border-blue-300 dark:border-blue-700' :
        gateType === 'OR' ? 'border-yellow-300 dark:border-yellow-700' :
        'border-pink-300 dark:border-pink-700'
      }`}>
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${
          gateType === 'AND' ? 'bg-blue-600' :
          gateType === 'OR' ? 'bg-yellow-600' :
          'bg-pink-600'
        } flex items-center justify-center`}>
          <Network className="w-5 h-5 text-white" />
        </div>
        <div className={`font-bold text-lg ${
          gateType === 'AND' ? 'text-blue-900 dark:text-blue-50' :
          gateType === 'OR' ? 'text-yellow-900 dark:text-yellow-50' :
          'text-pink-900 dark:text-pink-50'
        }`}>
          {gateType}
        </div>
      </div>
      
      <div className="px-4 py-4">
        <div className={`font-semibold text-base mb-2 ${
          gateType === 'AND' ? 'text-blue-900 dark:text-blue-50' :
          gateType === 'OR' ? 'text-yellow-900 dark:text-yellow-50' :
          'text-pink-900 dark:text-pink-50'
        }`}>
          {data.label || `${gateType} Gate`}
        </div>
        <div className={`text-sm ${
          gateType === 'AND' ? 'text-blue-700 dark:text-blue-200' :
          gateType === 'OR' ? 'text-yellow-700 dark:text-yellow-200' :
          'text-pink-700 dark:text-pink-200'
        }`}>
          {gateType === 'AND' ? 'All inputs must pass' :
           gateType === 'OR' ? 'Any input can pass' :
           'Inverts the input'}
        </div>
      </div>
      
      {/* True output on right */}
      <Handle
        type="source"
        position={Position.Right}
        id="pass"
        className={`!w-3 !h-3 !border-2 !border-white dark:!border-gray-800 ${
          gateType === 'AND' ? '!bg-blue-500' :
          gateType === 'OR' ? '!bg-yellow-500' :
          '!bg-pink-500'
        }`}
      />
      
      {/* False output on bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="reject"
        className={`!w-3 !h-3 !border-2 !border-white dark:!border-gray-800 ${
          gateType === 'AND' ? '!bg-blue-500' :
          gateType === 'OR' ? '!bg-yellow-500' :
          '!bg-pink-500'
        }`}
      />
    </motion.div>
  );
}

export default memo(LogicGateNode);

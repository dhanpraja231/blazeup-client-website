import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Plus, Play, GitBranch, Zap, Shield, Grid3X3, Mail, MessageSquare, Sheet, Calendar, CreditCard, Clock, MapPin, Receipt, TrendingUp, Bell, Layers, Ban } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useState } from 'react';
import type { NodeType } from '../types/flow';

interface NodeTemplate {
  type: NodeType;
  label: string;
  icon: any;
  color: string;
  category: string;
  description: string;
}

const nodeTemplates: NodeTemplate[] = [
  {
    type: 'trigger',
    label: 'Trigger',
    icon: Play,
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    category: 'Triggers',
    description: 'Start a workflow'
  },
  {
    type: 'condition',
    label: 'Condition',
    icon: GitBranch,
    color: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    category: 'Conditions',
    description: 'Single condition check'
  },
  {
    type: 'logic_and',
    label: 'AND Gate',
    icon: Layers,
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    category: 'Logic Gates',
    description: 'All inputs must be true'
  },
  {
    type: 'logic_or',
    label: 'OR Gate',
    icon: Layers,
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    category: 'Logic Gates',
    description: 'At least one input true'
  },
  {
    type: 'logic_xor',
    label: 'XOR Gate',
    icon: Layers,
    color: 'bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300',
    category: 'Logic Gates',
    description: 'Exactly one input true'
  },
  {
    type: 'logic_not',
    label: 'NOT Gate',
    icon: Ban,
    color: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    category: 'Logic Gates',
    description: 'Invert condition'
  },
  {
    type: 'policy',
    label: 'Policy Check',
    icon: Shield,
    color: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
    category: 'Policies',
    description: 'Verify policy rules'
  },
  {
    type: 'category_limits',
    label: 'Category Limits',
    icon: Grid3X3,
    color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    category: 'Policies',
    description: 'Set spending limits'
  },
  {
    type: 'mcc_check',
    label: 'MCC Code Check',
    icon: CreditCard,
    color: 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
    category: 'Policies',
    description: 'Merchant category codes'
  },
  {
    type: 'velocity_limit',
    label: 'Velocity Limit',
    icon: TrendingUp,
    color: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
    category: 'Policies',
    description: 'Transaction frequency'
  },
  {
    type: 'geo_restriction',
    label: 'Geo Restriction',
    icon: MapPin,
    color: 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300',
    category: 'Policies',
    description: 'Location-based rules'
  },
  {
    type: 'time_restriction',
    label: 'Time Restriction',
    icon: Clock,
    color: 'bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300',
    category: 'Policies',
    description: 'Time-based rules'
  },
  {
    type: 'receipt_requirement',
    label: 'Receipt Check',
    icon: Receipt,
    color: 'bg-lime-100 dark:bg-lime-900 text-lime-700 dark:text-lime-300',
    category: 'Compliance',
    description: 'Receipt requirements'
  },
  {
    type: 'budget_tracker',
    label: 'Budget Tracker',
    icon: TrendingUp,
    color: 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
    category: 'Compliance',
    description: 'Track budget usage'
  },
  {
    type: 'action',
    label: 'Action',
    icon: Zap,
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    category: 'Actions',
    description: 'Perform an action'
  },
  {
    type: 'notification',
    label: 'Notification',
    icon: Bell,
    color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
    category: 'Actions',
    description: 'Send notification'
  },
  {
    type: 'integration',
    label: 'Slack',
    icon: MessageSquare,
    color: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
    category: 'Integrations',
    description: 'Send Slack message'
  },
  {
    type: 'integration',
    label: 'Sheets',
    icon: Sheet,
    color: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
    category: 'Integrations',
    description: 'Log to Google Sheets'
  },
  {
    type: 'integration',
    label: 'Calendar',
    icon: Calendar,
    color: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    category: 'Integrations',
    description: 'Create calendar event'
  },
  {
    type: 'integration',
    label: 'Email',
    icon: Mail,
    color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    category: 'Integrations',
    description: 'Send email'
  },
];

interface SidePanelProps {
  onAddNode: (type: NodeType, label: string) => void;
}

export default function SidePanel({ onAddNode }: SidePanelProps) {
  const { sidePanelOpen, toggleSidePanel } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredNodes = nodeTemplates.filter(node =>
    node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const groupedNodes = filteredNodes.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, NodeTemplate[]>);
  
  const handleAddNode = (template: NodeTemplate) => {
    onAddNode(template.type, template.label);
  };
  
  const onDragStart = (event: React.DragEvent, template: NodeTemplate) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(template));
    event.dataTransfer.effectAllowed = 'move';
  };
  
  return (
    <AnimatePresence>
      {sidePanelOpen && (
        <>
          {/* Overlay for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-30 lg:hidden"
            onClick={toggleSidePanel}
          />
          
          {/* Side Panel */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-16 bottom-0 w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 z-40 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700">
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-50">Add Nodes</h2>
              <button
                onClick={toggleSidePanel}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
            
            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-300 dark:border-gray-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search nodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            
            {/* Node List */}
            <div className="flex-1 overflow-y-auto px-4 py-3">
              {Object.entries(groupedNodes).map(([category, nodes]) => (
                <div key={category} className="mb-6">
                  <h3 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-2">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {nodes.map((node, index) => {
                      const Icon = node.icon;
                      return (
                        <motion.div
                          key={`${node.type}-${index}`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div
                            draggable
                            onDragStart={(e) => onDragStart(e, node)}
                            onClick={() => handleAddNode(node)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors group cursor-move bg-white dark:bg-gray-800/50 shadow-sm"
                          >
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${node.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">
                              {node.label}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {node.description}
                            </div>
                            </div>
                            <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
              
              {filteredNodes.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                  No nodes found
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

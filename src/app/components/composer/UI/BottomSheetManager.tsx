import BottomSheet from './BottomSheet';
import AmountEditor from '../BottomSheets/AmountEditor';
import CategoryLimitEditor from '../BottomSheets/CategoryLimitEditor';
import TriggerEditor from '../BottomSheets/TriggerEditor';
import PolicyEditor from '../BottomSheets/PolicyEditor';
import ActionEditor from '../BottomSheets/ActionEditor';
import ConditionEditor from '../BottomSheets/ConditionEditor';
import MCCEditor from '../BottomSheets/MCCEditor';
import VelocityEditor from '../BottomSheets/VelocityEditor';
import GeoEditor from '../BottomSheets/GeoEditor';
import TimeEditor from '../BottomSheets/TimeEditor';
import { useUIStore } from '../store/uiStore';
import { useState } from 'react';
import { useReactFlow } from 'reactflow';

export default function BottomSheetManager() {
  const { bottomSheet, updateBottomSheetData, closeBottomSheet } = useUIStore();
  const { setNodes } = useReactFlow();
  const [tempValue, setTempValue] = useState<any>(null);
  
  const renderContent = () => {
    switch (bottomSheet.content) {
      case 'trigger':
        return (
          <TriggerEditor
            initialData={bottomSheet.data?.trigger || { label: '', description: '', event: '', frequency: 'real-time' }}
            onValueChange={setTempValue}
          />
        );
      
      case 'policy':
        return (
          <PolicyEditor
            initialData={bottomSheet.data?.policy || { label: '', description: '', policyType: 'vendor_list', items: [] }}
            onValueChange={setTempValue}
          />
        );
      
      case 'action':
        return (
          <ActionEditor
            initialData={bottomSheet.data?.action || { actionType: 'approve', label: '', description: '', message: '', recipient: '' }}
            onValueChange={setTempValue}
          />
        );
      
      case 'amount':
        return (
          <AmountEditor
            initialValue={bottomSheet.data?.value || 0}
            currency={bottomSheet.data?.currency || 'INR'}
            onValueChange={setTempValue}
          />
        );
      
      case 'category':
        return (
          <CategoryLimitEditor
            initialCategory={bottomSheet.data?.category || {
              name: '',
              limit: 0,
              currency: 'INR',
              period: 'year'
            }}
            onValueChange={setTempValue}
          />
        );
      
      case 'condition':
        return (
          <ConditionEditor
            initialCondition={bottomSheet.data?.condition || { field: '', operator: '>', value: '', valueType: 'number' }}
            onValueChange={setTempValue}
          />
        );
      
      case 'mcc':
        return (
          <MCCEditor
            initialData={bottomSheet.data?.metadata || { allowedMCCs: [], restrictionType: 'allow' }}
            onValueChange={setTempValue}
          />
        );
      
      case 'velocity':
        return (
          <VelocityEditor
            initialData={bottomSheet.data?.metadata || { transactionLimit: 10, period: 'day' }}
            onValueChange={setTempValue}
          />
        );
      
      case 'geo':
        return (
          <GeoEditor
            initialData={bottomSheet.data?.metadata || { allowedCountries: [], restrictionType: 'allow' }}
            onValueChange={setTempValue}
          />
        );
      
      case 'time':
        return (
          <TimeEditor
            initialData={bottomSheet.data?.metadata || { startTime: '09:00', endTime: '17:00', allowedDays: [] }}
            onValueChange={setTempValue}
          />
        );
      
      case 'message':
        return (
          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-gray-50 mb-2">
              Message Template
            </label>
            <textarea
              defaultValue={bottomSheet.data?.config?.template || ''}
              rows={6}
              className="w-full px-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              placeholder="Enter message template..."
            />
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
              Use {'{'}variable{'}'} for dynamic values
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const getTitle = () => {
    switch (bottomSheet.content) {
      case 'trigger':
        return 'Edit Trigger';
      case 'policy':
        return 'Edit Policy Check';
      case 'action':
        return 'Edit Action';
      case 'amount':
        return 'Edit Amount';
      case 'category':
        return 'Edit Category Limit';
      case 'condition':
        return 'Edit Condition';
      case 'mcc':
        return 'Edit MCC Codes';
      case 'velocity':
        return 'Edit Velocity Limit';
      case 'geo':
        return 'Edit Geo Restriction';
      case 'time':
        return 'Edit Time Restriction';
      case 'message':
        return 'Edit Message Template';
      default:
        return 'Edit';
    }
  };
  
  const handleSave = () => {
    if (tempValue !== null && bottomSheet.nodeId) {
      // Update node data based on content type
      setNodes((nodes) => 
        nodes.map((node) => {
          if (node.id === bottomSheet.nodeId) {
            switch (bottomSheet.content) {
              case 'trigger':
                return { ...node, data: { ...node.data, ...tempValue } };
              case 'policy':
                return { ...node, data: { ...node.data, ...tempValue } };
              case 'action':
                return { ...node, data: { ...node.data, ...tempValue } };
              case 'category':
                const index = bottomSheet.data?.index ?? -1;
                if (index === -1) {
                  // Add new category
                  const categories = [...(node.data.categories || []), tempValue];
                  return { ...node, data: { ...node.data, categories } };
                } else {
                  // Update existing category
                  const categories = [...(node.data.categories || [])];
                  categories[index] = tempValue;
                  return { ...node, data: { ...node.data, categories } };
                }
              case 'condition':
                const condIndex = bottomSheet.data?.index ?? -1;
                if (condIndex === -1) {
                  // Add new condition
                  const conditions = [...(node.data.conditions || []), tempValue];
                  return { ...node, data: { ...node.data, conditions } };
                } else {
                  // Update existing condition
                  const conditions = [...(node.data.conditions || [])];
                  conditions[condIndex] = tempValue;
                  return { ...node, data: { ...node.data, conditions } };
                }
              case 'mcc':
              case 'velocity':
              case 'geo':
              case 'time':
                return { ...node, data: { ...node.data, metadata: { ...node.data.metadata, ...tempValue } } };
              case 'message':
                return { ...node, data: { ...node.data, config: { ...node.data.config, ...tempValue } } };
              default:
                return node;
            }
          }
          return node;
        })
      );
      updateBottomSheetData(tempValue);
    }
    closeBottomSheet();
  };
  
  return (
    <BottomSheet title={getTitle()} onSave={handleSave}>
      {renderContent()}
    </BottomSheet>
  );
}

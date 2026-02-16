import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useEffect } from 'react';

interface BottomSheetProps {
  children: React.ReactNode;
  title: string;
  onSave?: () => void;
  onCancel?: () => void;
}

export default function BottomSheet({ children, title, onSave, onCancel }: BottomSheetProps) {
  const { bottomSheet, closeBottomSheet } = useUIStore();
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && bottomSheet.isOpen) {
        handleCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [bottomSheet.isOpen]);
  
  const handleCancel = () => {
    if (onCancel) onCancel();
    closeBottomSheet();
  };
  
  const handleSave = () => {
    if (onSave) onSave();
    closeBottomSheet();
  };
  
  return (
    <AnimatePresence>
      {bottomSheet.isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 dark:bg-black/60 z-40"
            onClick={handleCancel}
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#2A2A2A] rounded-t-2xl shadow-2xl max-h-[60vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">{title}</h2>
              <button
                onClick={handleCancel}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {children}
            </div>
            
            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

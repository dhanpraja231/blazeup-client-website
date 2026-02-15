import { motion, AnimatePresence } from 'framer-motion';
import { X, Search } from 'lucide-react';
import { useUIStore } from '../store/uiStore';
import { useState, useEffect } from 'react';
import type { PolicyItem } from '../types/flow';

export default function VendorListModal() {
  const { modal, closeModal } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<PolicyItem[]>([]);
  
  useEffect(() => {
    if (modal.isOpen && modal.content === 'vendor_list' && modal.data?.items) {
      setItems(modal.data.items);
    }
  }, [modal]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modal.isOpen) {
        closeModal();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modal.isOpen]);
  
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, PolicyItem[]>);
  
  return (
    <AnimatePresence>
      {modal.isOpen && modal.content === 'vendor_list' && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#2A2A2A] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                  Policy Items
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              {/* Search */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-gray-900 dark:text-gray-50 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {Object.entries(groupedItems).map(([category, categoryItems]) => (
                  <div key={category} className="mb-6">
                    <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-3">
                      {category.replace('_', ' ')}
                    </h3>
                    <div className="space-y-2">
                      {categoryItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            {item.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {filteredItems.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No items found
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

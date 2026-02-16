import { create } from 'zustand';

interface BottomSheetState {
  isOpen: boolean;
  content: 'amount' | 'condition' | 'category' | 'message' | 'trigger' | 'policy' | 'action' | 'mcc' | 'velocity' | 'geo' | 'time' | null;
  data: any;
  nodeId: string | null;
}

interface ModalState {
  isOpen: boolean;
  content: 'vendor_list' | 'policy_details' | null;
  data: any;
  nodeId: string | null;
}

interface UIState {
  sidePanelOpen: boolean;
  bottomSheet: BottomSheetState;
  modal: ModalState;
  
  toggleSidePanel: () => void;
  setSidePanelOpen: (open: boolean) => void;
  
  openBottomSheet: (content: BottomSheetState['content'], data: any, nodeId: string) => void;
  closeBottomSheet: () => void;
  updateBottomSheetData: (data: any) => void;
  
  openModal: (content: ModalState['content'], data: any, nodeId: string) => void;
  closeModal: () => void;
  updateModalData: (data: any) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidePanelOpen: true,
  bottomSheet: {
    isOpen: false,
    content: null,
    data: null,
    nodeId: null,
  },
  modal: {
    isOpen: false,
    content: null,
    data: null,
    nodeId: null,
  },
  
  toggleSidePanel: () => set((state) => ({ sidePanelOpen: !state.sidePanelOpen })),
  setSidePanelOpen: (open) => set({ sidePanelOpen: open }),
  
  openBottomSheet: (content, data, nodeId) =>
    set({ bottomSheet: { isOpen: true, content, data, nodeId } }),
  closeBottomSheet: () =>
    set({ bottomSheet: { isOpen: false, content: null, data: null, nodeId: null } }),
  updateBottomSheetData: (data) =>
    set((state) => ({ bottomSheet: { ...state.bottomSheet, data } })),
  
  openModal: (content, data, nodeId) =>
    set({ modal: { isOpen: true, content, data, nodeId } }),
  closeModal: () =>
    set({ modal: { isOpen: false, content: null, data: null, nodeId: null } }),
  updateModalData: (data) =>
    set((state) => ({ modal: { ...state.modal, data } })),
}));

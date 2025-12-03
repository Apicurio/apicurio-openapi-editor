/**
 * Custom hook for managing UI state
 */

import { useUIStore } from '@stores/uiStore';
import { ModalType } from '@models/UITypes';

/**
 * Hook for working with UI state
 */
export const useUI = () => {
    // Subscribe to UI store state
    const isProblemsDrawerOpen = useUIStore((state) => state.isProblemsDrawerOpen);
    const activeModal = useUIStore((state) => state.activeModal);
    const modalData = useUIStore((state) => state.modalData);
    const isMasterPanelExpanded = useUIStore((state) => state.isMasterPanelExpanded);
    const theme = useUIStore((state) => state.theme);

    // Get actions from store
    const {
        openProblemsDrawer,
        closeProblemsDrawer,
        toggleProblemsDrawer,
        openModal,
        closeModal,
        toggleMasterPanel,
        setTheme,
        reset,
    } = useUIStore.getState();

    return {
        // State
        isProblemsDrawerOpen,
        activeModal,
        modalData,
        isMasterPanelExpanded,
        theme,

        // Actions
        openProblemsDrawer,
        closeProblemsDrawer,
        toggleProblemsDrawer,
        openModal: (modalType: ModalType | string, data?: unknown) => openModal(modalType, data),
        closeModal,
        toggleMasterPanel,
        setTheme,
        reset,
    };
};

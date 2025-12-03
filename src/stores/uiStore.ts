/**
 * Zustand store for UI state
 */

import { create } from 'zustand/react';
import { UIState, ModalType } from '@models/UITypes';

interface UIStore extends UIState {
    /**
     * Open the problems drawer
     */
    openProblemsDrawer: () => void;

    /**
     * Close the problems drawer
     */
    closeProblemsDrawer: () => void;

    /**
     * Toggle the problems drawer
     */
    toggleProblemsDrawer: () => void;

    /**
     * Open a modal dialog
     */
    openModal: (modalType: ModalType | string, data?: unknown) => void;

    /**
     * Close the active modal
     */
    closeModal: () => void;

    /**
     * Toggle the master panel (for responsive layouts)
     */
    toggleMasterPanel: () => void;

    /**
     * Set the theme
     */
    setTheme: (theme: 'light' | 'dark') => void;

    /**
     * Reset the store to initial state
     */
    reset: () => void;
}

const initialState: UIState = {
    isProblemsDrawerOpen: false,
    activeModal: null,
    modalData: null,
    isMasterPanelExpanded: true,
    theme: 'light',
};

export const useUIStore = create<UIStore>((set) => ({
    ...initialState,

    openProblemsDrawer: () => {
        set({ isProblemsDrawerOpen: true });
    },

    closeProblemsDrawer: () => {
        set({ isProblemsDrawerOpen: false });
    },

    toggleProblemsDrawer: () => {
        set((state) => ({ isProblemsDrawerOpen: !state.isProblemsDrawerOpen }));
    },

    openModal: (modalType: ModalType | string, data?: unknown) => {
        set({ activeModal: modalType, modalData: data });
    },

    closeModal: () => {
        set({ activeModal: null, modalData: null });
    },

    toggleMasterPanel: () => {
        set((state) => ({ isMasterPanelExpanded: !state.isMasterPanelExpanded }));
    },

    setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
    },

    reset: () => {
        set(initialState);
    },
}));

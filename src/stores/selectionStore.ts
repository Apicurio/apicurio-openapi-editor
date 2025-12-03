/**
 * Zustand store for selection state
 */

import { create } from 'zustand';
import { Node } from '@apicurio/data-models';
import { SelectionState } from '@models/SelectionTypes';

interface SelectionStore extends SelectionState {
    /**
     * Select a node by path
     */
    selectNode: (path: string, node: Node | null, type: string | null) => void;

    /**
     * Clear the current selection
     */
    clearSelection: () => void;

    /**
     * Toggle highlight on the selected node
     */
    setHighlight: (highlight: boolean) => void;

    /**
     * Reset the store to initial state
     */
    reset: () => void;
}

const initialState: SelectionState = {
    selectedPath: null,
    selectedNode: null,
    selectedType: null,
    highlightSelection: false,
};

export const useSelectionStore = create<SelectionStore>((set) => ({
    ...initialState,

    selectNode: (path: string, node: Node | null, type: string | null) => {
        set({
            selectedPath: path,
            selectedNode: node,
            selectedType: type,
            highlightSelection: false,
        });
    },

    clearSelection: () => {
        set({
            selectedPath: null,
            selectedNode: null,
            selectedType: null,
            highlightSelection: false,
        });
    },

    setHighlight: (highlight: boolean) => {
        set({ highlightSelection: highlight });
    },

    reset: () => {
        set(initialState);
    },
}));

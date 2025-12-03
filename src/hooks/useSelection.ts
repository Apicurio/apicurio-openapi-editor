/**
 * Custom hook for managing node selection
 */

import { useSelectionStore } from '@stores/selectionStore';
import { useEditorServices } from '@services/EditorContext';
import { Node } from '@apicurio/data-models';

/**
 * Hook for working with node selection
 */
export const useSelection = () => {
    const { selectionService } = useEditorServices();

    // Subscribe to selection store state
    const selectedPath = useSelectionStore((state) => state.selectedPath);
    const selectedNode = useSelectionStore((state) => state.selectedNode);
    const selectedType = useSelectionStore((state) => state.selectedType);
    const highlightSelection = useSelectionStore((state) => state.highlightSelection);

    return {
        // State
        selectedPath,
        selectedNode,
        selectedType,
        highlightSelection,

        // Actions
        selectByPath: (path: string, highlight?: boolean) =>
            selectionService.selectByPath(path, highlight),
        selectNode: (node: Node, path: string, type?: string) =>
            selectionService.selectNode(node, path, type),
        clearSelection: () => selectionService.clearSelection(),
        selectRoot: () => selectionService.selectRoot(),
        highlightCurrent: () => selectionService.highlightSelection(),
        reset: () => selectionService.reset(),
    };
};

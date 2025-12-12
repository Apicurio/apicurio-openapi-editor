/**
 * Custom hook for managing node selection
 */

import { useSelectionStore } from '@stores/selectionStore';
import { useEditorServices } from '@services/EditorContext';
import { Node, NodePath } from '@apicurio/data-models';

/**
 * Hook for working with node selection
 */
export const useSelection = () => {
    const { selectionService } = useEditorServices();

    // Subscribe to selection store state
    const selectedPath = useSelectionStore((state) => state.selectedPath);
    const selectedNode = useSelectionStore((state) => state.selectedNode);
    const navigationObject = useSelectionStore((state) => state.navigationObject);
    const navigationObjectType = useSelectionStore((state) => state.navigationObjectType);
    const highlightSelection = useSelectionStore((state) => state.highlightSelection);

    return {
        // State
        selectedPath,
        selectedNode,
        navigationObject,
        navigationObjectType,
        highlightSelection,

        // Actions
        select: (target: Node | NodePath, highlight?: boolean) =>
            selectionService.select(target, highlight),
        clearSelection: () => selectionService.clearSelection(),
        selectRoot: () => selectionService.selectRoot(),
        highlightCurrent: () => selectionService.highlightSelection(),
        reset: () => selectionService.reset(),
    };
};

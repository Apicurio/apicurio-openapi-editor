/**
 * Types related to node selection in the editor
 */

import { Node } from '@apicurio/data-models';

/**
 * Represents the current selection state in the editor
 */
export interface SelectionState {
    /**
     * The path to the currently selected node (e.g., "/paths/~1pets/get")
     */
    selectedPath: string | null;

    /**
     * The actual selected node from the document
     */
    selectedNode: Node | null;

    /**
     * The type of the selected node (e.g., "path", "operation", "schema")
     */
    selectedType: string | null;

    /**
     * Whether to highlight the selected node in the UI
     */
    highlightSelection: boolean;
}

/**
 * Selection event payload
 */
export interface SelectionEvent {
    path: string;
    node: Node | null;
    type: string | null;
}

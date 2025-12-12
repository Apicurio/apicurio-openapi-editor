/**
 * Types related to node selection in the editor
 */

import {Node, NodePath} from '@apicurio/data-models';

/**
 * Represents the current selection state in the editor
 */
export interface SelectionState {
    /**
     * The path to the currently selected node (e.g., "/paths/~1pets/get")
     */
    selectedPath: NodePath | null;

    /**
     * The actual selected node from the document
     */
    selectedNode: Node | null;

    /**
     * The top-level navigation object (PathItem, Schema, etc.) that contains the selected node
     * This is maintained separately to support granular selection without breaking navigation
     */
    navigationObject: Node | null;

    /**
     * The type of the selected navigation node (e.g., "path", "operation", "schema")
     */
    navigationObjectType: string | null;

    /**
     * Whether to highlight the selected node in the UI
     */
    highlightSelection: boolean;
}

/**
 * Selection event payload
 */
export interface SelectionEvent {
    path: NodePath;
    node: Node | null;
}

/**
 * Service for managing node selection in the editor
 */

import { Node, NodePath } from '@apicurio/data-models';
import { useSelectionStore } from '@stores/selectionStore';
import { useDocumentStore } from '@stores/documentStore';

/**
 * SelectionService handles node selection and navigation
 */
export class SelectionService {
    /**
     * Select a node by path string
     */
    selectByPath(path: string, highlight: boolean = false): void {
        const doc = useDocumentStore.getState().document;
        if (!doc) {
            console.warn('Cannot select: no document loaded');
            return;
        }

        try {
            // For now, we'll use a simplified approach
            // TODO: Implement proper node path resolution when we need it
            NodePath.parse(path);

            // For root selection, use the document itself
            if (path === '/' || path === '') {
                useSelectionStore.getState().selectNode(path, doc as any, 'info');
                if (highlight) {
                    useSelectionStore.getState().setHighlight(true);
                }
                return;
            }

            // Determine type from path
            let nodeType = 'unknown';
            if (path.startsWith('/paths/')) {
                nodeType = 'path';
            } else if (path.startsWith('/components/schemas/')) {
                nodeType = 'schema';
            } else if (path.startsWith('/components/responses/')) {
                nodeType = 'response';
            } else if (path.startsWith('/components/parameters/')) {
                nodeType = 'parameter';
            } else if (path.startsWith('/components/securitySchemes/')) {
                nodeType = 'security-scheme';
            }

            // Store the path with determined type
            useSelectionStore.getState().selectNode(path, null, nodeType);

            if (highlight) {
                useSelectionStore.getState().setHighlight(true);
            }
        } catch (error) {
            console.error('Error selecting node:', error);
        }
    }

    /**
     * Select a node directly
     */
    selectNode(node: Node, path: string, type?: string): void {
        const nodeType = type || this.determineNodeType(node);
        useSelectionStore.getState().selectNode(path, node, nodeType);
    }

    /**
     * Clear the current selection
     */
    clearSelection(): void {
        useSelectionStore.getState().clearSelection();
    }

    /**
     * Select the root (main info object)
     */
    selectRoot(): void {
        this.selectByPath('/');
    }

    /**
     * Get the currently selected node
     */
    getSelectedNode(): Node | null {
        return useSelectionStore.getState().selectedNode;
    }

    /**
     * Get the currently selected path
     */
    getSelectedPath(): string | null {
        return useSelectionStore.getState().selectedPath;
    }

    /**
     * Get the type of the currently selected node
     */
    getSelectedType(): string | null {
        return useSelectionStore.getState().selectedType;
    }

    /**
     * Highlight the current selection (scroll into view, etc.)
     */
    highlightSelection(): void {
        useSelectionStore.getState().setHighlight(true);
    }

    /**
     * Determine the type of a node
     */
    private determineNodeType(node: Node): string {
        const nodeType = (node as any)._type;

        if (!nodeType) {
            return 'unknown';
        }

        // Map internal types to our display types
        if (nodeType.includes('PathItem')) {
            return 'path';
        }
        if (nodeType.includes('Operation')) {
            return 'operation';
        }
        if (nodeType.includes('Schema')) {
            return 'schema';
        }
        if (nodeType.includes('Response')) {
            return 'response';
        }
        if (nodeType.includes('Parameter')) {
            return 'parameter';
        }
        if (nodeType.includes('SecurityScheme')) {
            return 'security-scheme';
        }
        if (nodeType.includes('Server')) {
            return 'server';
        }
        if (nodeType.includes('Info')) {
            return 'info';
        }

        return 'unknown';
    }

    /**
     * Reset the selection state
     */
    reset(): void {
        useSelectionStore.getState().reset();
    }
}

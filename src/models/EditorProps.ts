import { SelectionChangeEvent } from './SelectionTypes';

// Re-export SelectionChangeEvent for convenience
export type { SelectionChangeEvent };

/**
 * Event fired when the document changes
 */
export interface DocumentChangeEvent {
    /**
     * Whether the document has unsaved changes
     */
    isDirty: boolean;

    /**
     * Document version number that increments with each change.
     * Use this to track when the document has been modified.
     */
    version: number;

    /**
     * Accessor function to retrieve the current document content.
     * This is a callback to avoid serializing the document until it's actually needed.
     * Only call this when you need to save the content (e.g., when user clicks Save button).
     */
    getContent: () => object | null;
}

/**
 * Properties for the OpenAPIEditor component
 */
export interface OpenAPIEditorProps {
    /**
     * The initial OpenAPI content (as JSON object or JSON string)
     */
    initialContent?: object | string;

    /**
     * Callback fired when the OpenAPI document changes.
     * The event contains isDirty flag and a getContent() accessor.
     * Call getContent() only when you need to retrieve the content (e.g., to save it).
     * Multiple onChange events may fire before getContent() is called.
     */
    onChange?: (event: DocumentChangeEvent) => void;

    /**
     * Callback fired when the editor selection changes.
     * The event contains the path to the selected node and optional property name.
     */
    onSelectionChange?: (event: SelectionChangeEvent) => void;

    /**
     * Optional features configuration
     */
    features?: EditorFeatures;
}

/**
 * Feature flags for the editor
 */
export interface EditorFeatures {
    /**
     * Enable/disable specific editor features
     */
    allowImports?: boolean;
    allowCustomValidations?: boolean;
}

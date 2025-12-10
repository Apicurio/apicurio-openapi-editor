/**
 * Main entry point for the Apicurio OpenAPI Editor library
 */

// Main component
export { OpenAPIEditor } from './components/editor/OpenAPIEditor';

// Types
export type { OpenAPIEditorProps, EditorFeatures, DocumentChangeEvent } from './models/EditorProps';
export type { ValidationProblem } from './models/DocumentTypes';
export type { SelectionEvent } from './models/SelectionTypes';

// Hooks (for advanced usage)
export { useDocument } from './hooks/useDocument';
export { useCommand } from './hooks/useCommand';
export { useSelection } from './hooks/useSelection';
export { useUI } from './hooks/useUI';

// Context (for advanced usage)
export { EditorProvider, useEditorServices } from './services/EditorContext';
export type { EditorServices } from './services/EditorContext';

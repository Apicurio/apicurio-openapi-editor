/**
 * Custom hook for accessing document state and operations
 */

import { useDocumentStore } from '@stores/documentStore';
import { useEditorServices } from '@services/EditorContext';

/**
 * Hook for working with the OpenAPI document
 */
export const useDocument = () => {
    const { documentService } = useEditorServices();

    // Subscribe to document store state
    const document = useDocumentStore((state) => state.document);
    const isDirty = useDocumentStore((state) => state.isDirty);
    const isLoading = useDocumentStore((state) => state.isLoading);
    const error = useDocumentStore((state) => state.error);

    return {
        // State
        document,
        isDirty,
        isLoading,
        error,

        // Actions
        loadDocument: (content: object | string) => documentService.loadDocument(content),
        getDocument: () => documentService.getDocument(),
        toObject: () => documentService.toObject(),
        toJSON: () => documentService.toJSON(),
        validateDocument: () => documentService.validateDocument(),
        reset: () => documentService.reset(),
    };
};

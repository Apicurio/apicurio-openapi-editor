/**
 * Main OpenAPI Editor component
 */

import React from 'react';
import { OpenAPIEditorProps } from '@models/EditorProps';
import { EditorProvider } from '@services/EditorContext';
import { OpenAPIEditorContent } from './OpenAPIEditorContent';

/**
 * The main OpenAPI Editor component.
 * This is a reusable React component for visual OpenAPI editing.
 *
 * This component wraps the editor content with the EditorProvider to make
 * all services available via context.
 */
export const OpenAPIEditor: React.FC<OpenAPIEditorProps> = ({ initialContent, onChange, features }) => {
    return (
        <EditorProvider>
            <OpenAPIEditorContent
                initialContent={initialContent}
                onChange={onChange}
                features={features}
            />
        </EditorProvider>
    );
};

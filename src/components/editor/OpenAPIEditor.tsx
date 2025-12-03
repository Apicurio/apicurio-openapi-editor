/**
 * Main OpenAPI Editor component
 */

import React from 'react';
import { OpenAPIEditorProps } from '@models/EditorProps';

/**
 * The main OpenAPI Editor component.
 * This is a reusable React component for visual OpenAPI editing.
 */
export const OpenAPIEditor: React.FC<OpenAPIEditorProps> = ({ initialContent }) => {
    return (
        <div className="apicurio-openapi-editor">
            <h1>Apicurio OpenAPI Editor</h1>
            <p>Initial implementation in progress...</p>
            {initialContent && (
                <pre>
                    {typeof initialContent === 'string'
                        ? initialContent
                        : JSON.stringify(initialContent, null, 2)}
                </pre>
            )}
        </div>
    );
};

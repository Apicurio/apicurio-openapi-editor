/**
 * OpenAPI Editor content (wrapped by EditorProvider)
 */

import React, { useEffect, useState } from 'react';
import { OpenAPIEditorProps } from '@models/EditorProps';
import { useDocument } from '@hooks/useDocument';
import { useSelection } from '@hooks/useSelection';
import { EditorLayout } from './EditorLayout';
import { EditorToolbar, EditorView } from './EditorToolbar';
import './OpenAPIEditorContent.css';

/**
 * The content of the OpenAPI Editor (requires EditorProvider)
 */
export const OpenAPIEditorContent: React.FC<OpenAPIEditorProps> = ({
    initialContent,
    onChange,
}) => {
    const { document, isDirty, version, loadDocument, toObject } = useDocument();
    const { selectRoot } = useSelection();
    const [currentView, setCurrentView] = useState<EditorView>('navigation');

    /**
     * Load content when initialContent changes (only on first load)
     */
    useEffect(() => {
        if (initialContent) {
            loadDocument(initialContent, true);
            selectRoot();
        }
    }, [initialContent]); // Only run on initial load

    /**
     * Notify parent when document changes
     * Use callback pattern to avoid serializing document until needed
     */
    useEffect(() => {
        // Fire onChange event when document becomes dirty
        if (onChange) {
            onChange({
                isDirty,
                version,
                getContent: () => toObject(),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [version]);

    return (
        <div className="apicurio-openapi-editor">
            {/* Toolbar */}
            <EditorToolbar
                currentView={currentView}
                onViewChange={setCurrentView}
            />

            {/* Editor content */}
            <div className="editor-content">
                {!document ? (
                    <div style={{ padding: '1rem' }}>
                        <p>Loading OpenAPI document...</p>
                        {initialContent && (
                            <pre style={{ fontSize: '0.85em', maxHeight: '400px', overflow: 'auto' }}>
                                {typeof initialContent === 'string'
                                    ? initialContent
                                    : JSON.stringify(initialContent, null, 2)}
                            </pre>
                        )}
                    </div>
                ) : (
                    <EditorLayout showValidationPanel={currentView === 'validation'} />
                )}
            </div>
        </div>
    );
};

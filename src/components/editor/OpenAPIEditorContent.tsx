/**
 * OpenAPI Editor content (wrapped by EditorProvider)
 */

import React, { useEffect, useRef } from 'react';
import { OpenAPIEditorProps } from '@models/EditorProps';
import { useDocument } from '@hooks/useDocument';
import { useSelection } from '@hooks/useSelection';
import { EditorLayout } from './EditorLayout';
import { EditorToolbar } from './EditorToolbar';
import './OpenAPIEditorContent.css';

/**
 * The content of the OpenAPI Editor (requires EditorProvider)
 */
export const OpenAPIEditorContent: React.FC<OpenAPIEditorProps> = ({
    initialContent,
    onChange,
}) => {
    const { document, isDirty, loadDocument, toObject } = useDocument();
    const { selectRoot } = useSelection();
    const prevInitialContentRef = useRef<object | string | undefined>(undefined);

    /**
     * Load content when initialContent changes (but only select root on first load)
     */
    useEffect(() => {
        if (initialContent && initialContent !== prevInitialContentRef.current) {
            const isFirstLoad = prevInitialContentRef.current === undefined;
            loadDocument(initialContent);
            if (isFirstLoad) {
                selectRoot();
            }
            prevInitialContentRef.current = initialContent;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialContent]); // Reload when initialContent changes

    /**
     * Notify parent when document changes (but not on initial load)
     * We use isDirty to track if the document has been modified by user actions
     */
    useEffect(() => {
        // Only call onChange if the document is dirty (has been modified)
        // This prevents infinite loops from initial document load
        if (document && isDirty && onChange) {
            const obj = toObject();
            if (obj) {
                onChange(obj);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [document, isDirty]); // Don't include onChange to avoid re-firing on prop change

    return (
        <div className="apicurio-openapi-editor">
            {/* Toolbar */}
            <EditorToolbar />

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
                    <EditorLayout />
                )}
            </div>
        </div>
    );
};

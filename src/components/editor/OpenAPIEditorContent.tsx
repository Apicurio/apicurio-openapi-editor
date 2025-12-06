/**
 * OpenAPI Editor content (wrapped by EditorProvider)
 */

import React, {useEffect} from 'react';
import {Button, Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem,} from '@patternfly/react-core';
import {RedoIcon, UndoIcon} from '@patternfly/react-icons';
import {OpenAPIEditorProps} from '@models/EditorProps';
import {useDocument} from '@hooks/useDocument';
import {useCommand} from '@hooks/useCommand';
import {useSelection} from '@hooks/useSelection';
import {EditorLayout} from './EditorLayout';
import './OpenAPIEditorContent.css';

/**
 * The content of the OpenAPI Editor (requires EditorProvider)
 */
export const OpenAPIEditorContent: React.FC<OpenAPIEditorProps> = ({
    initialContent,
    onChange,
}) => {
    const { document, isDirty, loadDocument, toObject } = useDocument();
    const { canUndo, canRedo, undo, redo } = useCommand();
    const { selectRoot } = useSelection();

    /**
     * Load content when initialContent changes
     */
    useEffect(() => {
        if (initialContent) {
            loadDocument(initialContent);
            selectRoot();
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

    /**
     * Handle undo button click
     */
    const handleUndo = () => {
        undo();
    };

    /**
     * Handle redo button click
     */
    const handleRedo = () => {
        redo();
    };

    return (
        <div className="apicurio-openapi-editor">
            {/* Toolbar */}
            <div className="editor-toolbar">
                <Toolbar>
                    <ToolbarContent>
                        <ToolbarGroup>
                            <ToolbarItem>
                                <Button
                                    variant="plain"
                                    aria-label="Undo"
                                    isDisabled={!canUndo}
                                    onClick={handleUndo}
                                >
                                    <UndoIcon />
                                </Button>
                            </ToolbarItem>
                            <ToolbarItem>
                                <Button
                                    variant="plain"
                                    aria-label="Redo"
                                    isDisabled={!canRedo}
                                    onClick={handleRedo}
                                >
                                    <RedoIcon />
                                </Button>
                            </ToolbarItem>
                        </ToolbarGroup>
                    </ToolbarContent>
                </Toolbar>
            </div>

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

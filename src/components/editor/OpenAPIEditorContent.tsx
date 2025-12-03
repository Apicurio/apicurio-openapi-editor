/**
 * OpenAPI Editor content (wrapped by EditorProvider)
 */

import React, { useEffect } from 'react';
import {
    Page,
    PageSection,
    Masthead,
    MastheadMain,
    MastheadContent,
    Title,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
    Button,
} from '@patternfly/react-core';
import { UndoIcon, RedoIcon, BarsIcon } from '@patternfly/react-icons';
import { OpenAPIEditorProps } from '@models/EditorProps';
import { useDocument } from '@hooks/useDocument';
import { useCommand } from '@hooks/useCommand';
import { useSelection } from '@hooks/useSelection';
import { useUI } from '@hooks/useUI';
import { EditorLayout } from './EditorLayout';

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
    const { isMasterPanelExpanded, toggleMasterPanel } = useUI();

    /**
     * Load initial content when component mounts (only once)
     */
    useEffect(() => {
        if (initialContent) {
            loadDocument(initialContent);
            selectRoot();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount

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

    /**
     * Get document title for display
     */
    const getDocumentTitle = (): string => {
        if (!document) {
            return 'OpenAPI Editor';
        }

        const info = (document as any).info;
        if (info && info.title) {
            return info.title;
        }

        return 'Untitled API';
    };

    return (
        <Page
            className="apicurio-openapi-editor"
            masthead={
                <Masthead>
                    <MastheadMain>
                        <Title headingLevel="h1" size="lg">
                            {getDocumentTitle()}
                        </Title>
                    </MastheadMain>
                    <MastheadContent>
                        <Toolbar>
                            <ToolbarContent>
                                <ToolbarGroup>
                                    <ToolbarItem>
                                        <Button
                                            variant="plain"
                                            aria-label="Toggle navigation"
                                            onClick={toggleMasterPanel}
                                        >
                                            <BarsIcon />
                                        </Button>
                                    </ToolbarItem>
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
                    </MastheadContent>
                </Masthead>
            }
        >
            <PageSection padding={{ default: 'noPadding' }}>
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
                    <EditorLayout
                        isDrawerExpanded={isMasterPanelExpanded}
                        onDrawerToggle={toggleMasterPanel}
                    />
                )}
            </PageSection>
        </Page>
    );
};

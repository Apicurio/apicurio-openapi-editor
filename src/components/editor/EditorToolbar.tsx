/**
 * Toolbar for the OpenAPI Editor
 */

import React from 'react';
import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { UndoIcon, RedoIcon } from '@patternfly/react-icons';
import { useCommand } from '@hooks/useCommand';

/**
 * Editor toolbar component with undo/redo buttons
 */
export const EditorToolbar: React.FC = () => {
    const { canUndo, canRedo, undo, redo } = useCommand();

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
    );
};

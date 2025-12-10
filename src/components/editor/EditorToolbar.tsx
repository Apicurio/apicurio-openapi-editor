/**
 * Toolbar for the OpenAPI Editor
 */

import React from 'react';
import { Toolbar, ToolbarContent, ToolbarGroup, ToolbarItem, Button } from '@patternfly/react-core';
import { UndoIcon, RedoIcon } from '@patternfly/react-icons';
import { useCommand } from '@hooks/useCommand';
import { ValidationIndicator } from './ValidationIndicator';

export interface EditorToolbarProps {
    /**
     * Callback when validation indicator is clicked
     */
    onValidationClick: () => void;
}

/**
 * Editor toolbar component with undo/redo buttons and validation indicator
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onValidationClick }) => {
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
                    <ToolbarGroup align={{ default: 'alignEnd' }}>
                        <ToolbarItem>
                            <ValidationIndicator onClick={onValidationClick} />
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarContent>
            </Toolbar>
        </div>
    );
};

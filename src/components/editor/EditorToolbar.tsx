/**
 * Toolbar for the OpenAPI Editor
 */

import React from 'react';
import {
    Button,
    Label,
    ToggleGroup,
    ToggleGroupItem,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem
} from '@patternfly/react-core';
import {CheckIcon, CodeIcon, ExclamationTriangleIcon, ListIcon, PencilAltIcon, RedoIcon, UndoIcon} from '@patternfly/react-icons';
import {useCommand} from '@hooks/useCommand';
import {useValidation} from '@hooks/useValidation';

export type EditorView = 'navigation' | 'validation';
export type EditorMode = 'design' | 'source';

export interface EditorToolbarProps {
    /**
     * Current view being displayed
     */
    currentView?: EditorView;

    /**
     * Callback when view selection changes
     */
    onViewChange?: (view: EditorView) => void;

    /**
     * Current mode (design or source)
     */
    currentMode?: EditorMode;

    /**
     * Callback when mode selection changes
     */
    onModeChange?: (mode: EditorMode) => void;
}

/**
 * Editor toolbar component with view toggle and undo/redo buttons
 */
export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    currentView = 'navigation',
    onViewChange,
    currentMode = 'design',
    onModeChange
}) => {
    const { canUndo, canRedo, undo, redo } = useCommand();
    const { errorCount, warningCount } = useValidation();

    // Derived value - always in sync with errorCount and warningCount
    const problemCount = errorCount + warningCount;

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
     * Handle view toggle
     */
    const handleViewChange = (_event: React.MouseEvent, isSelected: boolean, view: EditorView) => {
        if (isSelected && onViewChange) {
            onViewChange(view);
        }
    };

    /**
     * Handle mode toggle
     */
    const handleModeChange = (_event: React.MouseEvent, isSelected: boolean, mode: EditorMode) => {
        if (isSelected && onModeChange) {
            onModeChange(mode);
        }
    };

    return (
        <div className="editor-toolbar">
            <Toolbar>
                <ToolbarContent>
                    {/* View toggle */}
                    <ToolbarGroup>
                        <ToolbarItem>
                            <ToggleGroup aria-label="Editor view" style={{ marginLeft: "10px" }}>
                                <ToggleGroupItem
                                    icon={<ListIcon />}
                                    aria-label="Navigation view"
                                    buttonId="navigation-view"
                                    isSelected={currentView === 'navigation'}
                                    onChange={(event, isSelected) =>
                                        handleViewChange(event as any, isSelected, 'navigation')}
                                />
                                <ToggleGroupItem
                                    icon={<span>{ (errorCount===0) ? <CheckIcon /> : <ExclamationTriangleIcon />} <Label variant="filled" isCompact color={(errorCount===0) ? "grey" : "red"}>{problemCount}</Label></span>}
                                    aria-label="Validation view"
                                    buttonId="validation-view"
                                    isSelected={currentView === 'validation'}
                                    onChange={(event, isSelected) =>
                                        handleViewChange(event as any, isSelected, 'validation')}
                                />
                            </ToggleGroup>
                        </ToolbarItem>
                    </ToolbarGroup>

                    {/* Mode toggle (Design/Source) */}
                    <ToolbarGroup>
                        <ToolbarItem>
                            <ToggleGroup aria-label="Editor mode">
                                <ToggleGroupItem
                                    icon={<PencilAltIcon />}
                                    text="Design"
                                    aria-label="Design mode"
                                    buttonId="design-mode"
                                    isSelected={currentMode === 'design'}
                                    onChange={(event, isSelected) =>
                                        handleModeChange(event as any, isSelected, 'design')}
                                />
                                <ToggleGroupItem
                                    icon={<CodeIcon />}
                                    text="Source"
                                    aria-label="Source mode"
                                    buttonId="source-mode"
                                    isSelected={currentMode === 'source'}
                                    onChange={(event, isSelected) =>
                                        handleModeChange(event as any, isSelected, 'source')}
                                />
                            </ToggleGroup>
                        </ToolbarItem>
                    </ToolbarGroup>

                    {/* Undo/Redo buttons */}
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

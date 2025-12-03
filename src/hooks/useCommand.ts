/**
 * Custom hook for executing commands and managing undo/redo
 */

import { useCommandStore } from '@stores/commandStore';
import { useEditorServices } from '@services/EditorContext';
import { ICommand } from '@apicurio/data-models';

/**
 * Hook for working with commands and undo/redo
 */
export const useCommand = () => {
    const { commandService } = useEditorServices();

    // Subscribe to command store state
    const undoCount = useCommandStore((state) => state.undoStack.length);
    const redoCount = useCommandStore((state) => state.redoStack.length);
    const canUndo = undoCount > 0;
    const canRedo = redoCount > 0;

    return {
        // State
        canUndo,
        canRedo,
        undoCount,
        redoCount,

        // Actions
        executeCommand: (command: ICommand, description?: string) =>
            commandService.executeCommand(command, description),
        undo: () => commandService.undo(),
        redo: () => commandService.redo(),
        reset: () => commandService.reset(),
    };
};

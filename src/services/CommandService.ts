/**
 * Service for executing commands and managing undo/redo
 */

import { ICommand } from '@apicurio/data-models';
import { useCommandStore } from '@stores/commandStore';
import { useDocumentStore } from '@stores/documentStore';

/**
 * CommandService handles command execution with undo/redo support
 */
export class CommandService {
    /**
     * Execute a command on the current document
     */
    executeCommand(command: ICommand, description?: string): void {
        const docStore = useDocumentStore.getState();
        const doc = docStore.document;

        if (!doc) {
            console.error('Cannot execute command: no document loaded');
            return;
        }

        try {
            // Execute the command (mutates the document)
            command.execute(doc);

            // Add to undo stack
            const cmdStore = useCommandStore.getState();
            cmdStore.addCommand(command, description);

            // Mark document as dirty and trigger update
            docStore.updateDocument(doc);
        } catch (error) {
            console.error('Failed to execute command:', error);
            throw error;
        }
    }

    /**
     * Undo the last command
     */
    undo(): boolean {
        const cmdStore = useCommandStore.getState();

        if (!cmdStore.canUndo()) {
            return false;
        }

        const entry = cmdStore.popUndo();
        if (!entry) {
            return false;
        }

        const docStore = useDocumentStore.getState();
        const doc = docStore.document;

        if (!doc) {
            console.error('Cannot undo: no document loaded');
            return false;
        }

        try {
            // Undo the command (mutates the document)
            entry.command.undo(doc);

            // Push to redo stack
            cmdStore.pushRedo(entry);

            // Update document
            docStore.updateDocument(doc);

            return true;
        } catch (error) {
            console.error('Failed to undo command:', error);
            return false;
        }
    }

    /**
     * Redo the last undone command
     */
    redo(): boolean {
        const cmdStore = useCommandStore.getState();

        if (!cmdStore.canRedo()) {
            return false;
        }

        const entry = cmdStore.popRedo();
        if (!entry) {
            return false;
        }

        const docStore = useDocumentStore.getState();
        const doc = docStore.document;

        if (!doc) {
            console.error('Cannot redo: no document loaded');
            return false;
        }

        try {
            // Re-execute the command (mutates the document)
            entry.command.execute(doc);

            // Push back to undo stack (without clearing redo stack)
            cmdStore.pushUndo(entry);

            // Update document
            docStore.updateDocument(doc);

            return true;
        } catch (error) {
            console.error('Failed to redo command:', error);
            return false;
        }
    }

    /**
     * Check if undo is available
     */
    canUndo(): boolean {
        return useCommandStore.getState().canUndo();
    }

    /**
     * Check if redo is available
     */
    canRedo(): boolean {
        return useCommandStore.getState().canRedo();
    }

    /**
     * Get the number of commands in the undo stack
     */
    getUndoCount(): number {
        return useCommandStore.getState().undoStack.length;
    }

    /**
     * Get the number of commands in the redo stack
     */
    getRedoCount(): number {
        return useCommandStore.getState().redoStack.length;
    }

    /**
     * Reset the command history
     */
    reset(): void {
        useCommandStore.getState().reset();
    }
}

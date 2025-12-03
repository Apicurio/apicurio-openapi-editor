/**
 * Types related to commands and undo/redo functionality
 */

import { ICommand } from '@apicurio/data-models';

/**
 * Represents a command in the history stack
 */
export interface CommandHistoryEntry {
    /**
     * The command that was executed
     */
    command: ICommand;

    /**
     * Timestamp when the command was executed
     */
    timestamp: number;

    /**
     * Optional description for debugging
     */
    description?: string;
}

/**
 * Command history state for undo/redo
 */
export interface CommandState {
    /**
     * Stack of executed commands (for undo)
     */
    undoStack: CommandHistoryEntry[];

    /**
     * Stack of undone commands (for redo)
     */
    redoStack: CommandHistoryEntry[];

    /**
     * Maximum size of undo stack (to prevent memory issues)
     */
    maxUndoStackSize: number;
}

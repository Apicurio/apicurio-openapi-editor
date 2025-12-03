/**
 * Zustand store for command history (undo/redo)
 */

import { create } from 'zustand';
import { ICommand } from '@apicurio/data-models';
import { CommandState, CommandHistoryEntry } from '@models/CommandTypes';

interface CommandStore extends CommandState {
    /**
     * Add a command to the undo stack
     */
    addCommand: (command: ICommand, description?: string) => void;

    /**
     * Get the command to undo (without removing it)
     */
    peekUndo: () => CommandHistoryEntry | null;

    /**
     * Pop a command from the undo stack
     */
    popUndo: () => CommandHistoryEntry | null;

    /**
     * Get the command to redo (without removing it)
     */
    peekRedo: () => CommandHistoryEntry | null;

    /**
     * Pop a command from the redo stack
     */
    popRedo: () => CommandHistoryEntry | null;

    /**
     * Push a command back onto the redo stack (after undo)
     */
    pushRedo: (entry: CommandHistoryEntry) => void;

    /**
     * Clear the redo stack (called after a new command is executed)
     */
    clearRedo: () => void;

    /**
     * Check if undo is available
     */
    canUndo: () => boolean;

    /**
     * Check if redo is available
     */
    canRedo: () => boolean;

    /**
     * Reset the store to initial state
     */
    reset: () => void;
}

const initialState: CommandState = {
    undoStack: [],
    redoStack: [],
    maxUndoStackSize: 100,
};

export const useCommandStore = create<CommandStore>((set, get) => ({
    ...initialState,

    addCommand: (command: ICommand, description?: string) => {
        set((state) => {
            const entry: CommandHistoryEntry = {
                command,
                timestamp: Date.now(),
                description,
            };

            const newUndoStack = [...state.undoStack, entry];

            // Limit stack size
            if (newUndoStack.length > state.maxUndoStackSize) {
                newUndoStack.shift();
            }

            return {
                undoStack: newUndoStack,
                redoStack: [], // Clear redo stack when a new command is executed
            };
        });
    },

    peekUndo: () => {
        const state = get();
        return state.undoStack.length > 0 ? state.undoStack[state.undoStack.length - 1] : null;
    },

    popUndo: () => {
        let entry: CommandHistoryEntry | null = null;
        set((state) => {
            if (state.undoStack.length === 0) {
                return state;
            }
            const newStack = [...state.undoStack];
            entry = newStack.pop()!;
            return { undoStack: newStack };
        });
        return entry;
    },

    peekRedo: () => {
        const state = get();
        return state.redoStack.length > 0 ? state.redoStack[state.redoStack.length - 1] : null;
    },

    popRedo: () => {
        let entry: CommandHistoryEntry | null = null;
        set((state) => {
            if (state.redoStack.length === 0) {
                return state;
            }
            const newStack = [...state.redoStack];
            entry = newStack.pop()!;
            return { redoStack: newStack };
        });
        return entry;
    },

    pushRedo: (entry: CommandHistoryEntry) => {
        set((state) => ({
            redoStack: [...state.redoStack, entry],
        }));
    },

    clearRedo: () => {
        set({ redoStack: [] });
    },

    canUndo: () => {
        return get().undoStack.length > 0;
    },

    canRedo: () => {
        return get().redoStack.length > 0;
    },

    reset: () => {
        set(initialState);
    },
}));

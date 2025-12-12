/**
 * Local command interface for undo/redo operations
 */

import {Document, NodePath} from '@apicurio/data-models';

/**
 * Interface for commands that can be executed and undone
 */
export interface ICommand {
    /**
     * Returns the type/name of the command
     */
    type(): string;

    /**
     * Execute the command
     * @param document The OpenAPI document to modify
     */
    execute(document: Document): void;

    /**
     * Undo the command
     * @param document The OpenAPI document to restore
     */
    undo(document: Document): void;

    /**
     * Get the selection path that was active when this command was created
     * This allows undo/redo to restore the visual selection
     */
    getSelection(): NodePath | null;

    /**
     * Set the selection path for this command
     * @param selection The selection path (e.g., "/paths//pets", "/components/schemas/Pet")
     */
    setSelection(selection: NodePath | null): void;
}

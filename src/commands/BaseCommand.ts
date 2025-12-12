/**
 * Base command class with selection tracking
 */

import {Document, NodePath} from '@apicurio/data-models';
import { ICommand } from './ICommand';

/**
 * Abstract base class for commands that includes selection tracking
 */
export abstract class BaseCommand implements ICommand {
    private _selection: NodePath | null = null;

    /**
     * Returns the type/name of the command
     */
    abstract type(): string;

    /**
     * Execute the command
     * @param document The OpenAPI document to modify
     */
    abstract execute(document: Document): void;

    /**
     * Undo the command
     * @param document The OpenAPI document to restore
     */
    abstract undo(document: Document): void;

    /**
     * Get the selection path that was active when this command was created
     */
    getSelection(): NodePath | null {
        return this._selection;
    }

    /**
     * Set the selection path for this command
     * @param selection The selection path (e.g., "/paths//pets", "/components/schemas/Pet")
     */
    setSelection(selection: NodePath | null): void {
        this._selection = selection;
    }
}

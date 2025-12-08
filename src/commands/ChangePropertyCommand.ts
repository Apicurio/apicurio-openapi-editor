/**
 * Command to change a property on a node
 */

import { Document, Node } from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to change a property value on a node
 */
export class ChangePropertyCommand extends BaseCommand {
    private _node: Node;
    private _property: string;
    private _newValue: any;
    private _oldValue: any;

    /**
     * Constructor
     * @param node The node whose property to change
     * @param property The property name
     * @param newValue The new value for the property
     */
    constructor(node: Node, property: string, newValue: any) {
        super();
        this._node = node;
        this._property = property;
        this._newValue = newValue;
        this._oldValue = undefined;
    }

    /**
     * Returns the type of the command
     */
    type(): string {
        return 'ChangePropertyCommand';
    }

    /**
     * Execute the command - change the property
     */
    execute(_document: Document): void {
        // Save the old value
        this._oldValue = (this._node as any)[this._property];

        // Set the new value
        (this._node as any)[this._property] = this._newValue;
    }

    /**
     * Undo the command - restore the old value
     */
    undo(_document: Document): void {
        // Restore the old value
        (this._node as any)[this._property] = this._oldValue;
    }
}

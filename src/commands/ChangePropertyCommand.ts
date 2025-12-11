/**
 * Command to change a property on a node
 */

import {Document, Node, NodePath, NodePathUtil} from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to change a property value on a node
 */
export class ChangePropertyCommand extends BaseCommand {
    private _nodePath: NodePath;
    private _property: string;
    private _newValue: any;
    private _oldValue: any;

    /**
     * Constructor
     * @param nodeOrPath The node, node path, or node path string
     * @param property The property name
     * @param newValue The new value for the property
     */
    constructor(nodeOrPath: Node | NodePath | string, property: string, newValue: any) {
        super();

        // Convert to NodePath based on input type
        if (typeof nodeOrPath === 'string') {
            // String path - parse it
            this._nodePath = NodePathUtil.parseNodePath(nodeOrPath);
        } else if ((nodeOrPath as any).segments !== undefined) {
            // Already a NodePath
            this._nodePath = nodeOrPath as NodePath;
        } else {
            // Node - create path from it
            this._nodePath = NodePathUtil.createNodePath(nodeOrPath as Node);
        }

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
    execute(document: Document): void {
        // Resolve the node from the path
        const node = NodePathUtil.resolveNodePath(this._nodePath, document);

        if (!node) {
            throw new Error(`Cannot resolve node path: ${this._nodePath.toString()}`);
        }

        // Save the old value
        this._oldValue = (node as any)[this._property];

        // Set the new value
        (node as any)[this._property] = this._newValue;
    }

    /**
     * Undo the command - restore the old value
     */
    undo(document: Document): void {
        // Resolve the node from the path
        const node = NodePathUtil.resolveNodePath(this._nodePath, document);

        if (!node) {
            throw new Error(`Cannot resolve node path: ${this._nodePath.toString()}`);
        }

        // Restore the old value
        (node as any)[this._property] = this._oldValue;
    }
}

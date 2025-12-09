/**
 * Command to create a new schema in the components section
 */

import { Document, OpenApi30Document, OpenApi30Schema } from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to create a new schema definition
 */
export class CreateSchemaCommand extends BaseCommand {
    private _schemaName: string;
    private _schemaExisted: boolean = false;

    /**
     * Constructor
     * @param schemaName The name of the schema to create
     */
    constructor(schemaName: string) {
        super();
        this._schemaName = schemaName;
    }

    /**
     * Returns the type of the command
     */
    type(): string {
        return 'CreateSchemaCommand';
    }

    /**
     * Execute the command - create a new schema
     */
    execute(document: Document): void {
        const oaiDoc = document as OpenApi30Document;

        // Ensure components section exists
        let components = oaiDoc.getComponents();
        if (!components) {
            components = oaiDoc.createComponents();
            oaiDoc.setComponents(components);
        }

        // Check if schema already exists
        const schemas = components.getSchemas();
        if (schemas && schemas[this._schemaName]) {
            this._schemaExisted = true;
            return;
        }

        // Create new schema with default object type
        const newSchema = components.createSchema() as OpenApi30Schema;
        (newSchema as any).type = 'object';

        // Add the schema to components
        components.addSchema(this._schemaName, newSchema);
        this._schemaExisted = false;
    }

    /**
     * Undo the command - remove the schema
     */
    undo(document: Document): void {
        if (this._schemaExisted) {
            // Schema already existed, don't remove it
            return;
        }

        const oaiDoc = document as OpenApi30Document;
        const components = oaiDoc.getComponents();

        if (!components) {
            return;
        }

        // Remove the schema
        components.removeSchema(this._schemaName);
    }

    /**
     * Get the schema name that was created
     */
    getSchemaName(): string {
        return this._schemaName;
    }
}

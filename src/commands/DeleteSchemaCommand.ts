/**
 * Command to delete a schema from the components section
 */

import { Document, OpenApi30Document, OpenApi30Schema, Library } from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to delete a schema definition (e.g., Pet, User)
 */
export class DeleteSchemaCommand extends BaseCommand {
    private _schemaName: string;
    private _oldSchema: any = null;
    private _schemaExisted: boolean = false;

    /**
     * Constructor
     * @param schemaName The schema name to delete (e.g., "Pet", "User")
     */
    constructor(schemaName: string) {
        super();
        this._schemaName = schemaName;
    }

    /**
     * Returns the type of the command
     */
    type(): string {
        return 'DeleteSchemaCommand';
    }

    /**
     * Execute the command - delete the schema
     */
    execute(document: Document): void {
        const oaiDoc = document as OpenApi30Document;
        const components = oaiDoc.getComponents();

        if (!components) {
            // No components section, nothing to delete
            this._schemaExisted = false;
            return;
        }

        const schemas = components.getSchemas();

        if (!schemas) {
            // No schemas object, nothing to delete
            this._schemaExisted = false;
            return;
        }

        // Get the schema to delete
        const schema = schemas[this._schemaName] as OpenApi30Schema;

        if (!schema) {
            // Schema doesn't exist, nothing to delete
            this._schemaExisted = false;
            return;
        }

        // Save the schema for undo
        this._oldSchema = Library.writeNode(schema);
        this._schemaExisted = true;

        // Remove the schema
        delete schemas[this._schemaName];
    }

    /**
     * Undo the command - restore the schema
     */
    undo(document: Document): void {
        if (!this._schemaExisted || !this._oldSchema) {
            return;
        }

        const oaiDoc = document as OpenApi30Document;
        let components = oaiDoc.getComponents();

        // Create components object if it doesn't exist
        if (!components) {
            components = oaiDoc.createComponents();
            oaiDoc.setComponents(components);
        }

        let schemas = components.getSchemas();

        // Create schemas object if it doesn't exist
        if (!schemas) {
            schemas = {};
            components.setSchemas(schemas);
        }

        // Recreate the schema
        const newSchema = components.createSchema(this._schemaName) as OpenApi30Schema;
        Library.readNode(this._oldSchema, newSchema);

        // Add it back
        schemas[this._schemaName] = newSchema;
    }

    /**
     * Get the schema name that was deleted
     */
    getSchemaName(): string {
        return this._schemaName;
    }
}

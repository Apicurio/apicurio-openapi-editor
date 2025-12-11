/**
 * Command to ensure Contact object exists in Info
 */

import { Document, OpenApiDocument } from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to ensure the Contact object exists in the Info object, creating it if necessary.
 * Assumes Info object already exists.
 */
export class EnsureContactCommand extends BaseCommand {
    private _contactExisted: boolean = false;

    /**
     * Constructor
     */
    constructor() {
        super();
    }

    /**
     * Returns the type of the command
     */
    type(): string {
        return 'EnsureContactCommand';
    }

    /**
     * Execute the command - create Contact if it doesn't exist
     */
    execute(document: Document): void {
        const oaiDoc = document as OpenApiDocument;
        const info = oaiDoc.getInfo();

        if (!info) {
            // Info doesn't exist - this is an error condition
            throw new Error('Info object must exist before creating Contact');
        }

        // Check if Contact exists
        const contact = info.getContact();
        if (contact) {
            // Contact already exists, nothing to do
            this._contactExisted = true;
            return;
        }

        // Contact doesn't exist, create it
        this._contactExisted = false;
        const newContact = info.createContact();
        info.setContact(newContact);
    }

    /**
     * Undo the command - remove Contact if we created it
     */
    undo(document: Document): void {
        if (this._contactExisted) {
            // Contact existed before, don't remove it
            return;
        }

        // We created the Contact, so remove it
        const oaiDoc = document as OpenApiDocument;
        const info = oaiDoc.getInfo();

        if (info) {
            info.setContact(null as any);
        }
    }
}

/**
 * Command to ensure License object exists in Info
 */

import { Document, OpenApiDocument } from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to ensure the License object exists in the Info object, creating it if necessary.
 * Assumes Info object already exists.
 */
export class EnsureLicenseCommand extends BaseCommand {
    private _licenseExisted: boolean = false;

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
        return 'EnsureLicenseCommand';
    }

    /**
     * Execute the command - create License if it doesn't exist
     */
    execute(document: Document): void {
        const oaiDoc = document as OpenApiDocument;
        const info = oaiDoc.getInfo();

        if (!info) {
            // Info doesn't exist - this is an error condition
            throw new Error('Info object must exist before creating License');
        }

        // Check if License exists
        const license = info.getLicense();
        if (license) {
            // License already exists, nothing to do
            this._licenseExisted = true;
            return;
        }

        // License doesn't exist, create it
        this._licenseExisted = false;
        const newLicense = info.createLicense();
        info.setLicense(newLicense);
    }

    /**
     * Undo the command - remove License if we created it
     */
    undo(document: Document): void {
        if (this._licenseExisted) {
            // License existed before, don't remove it
            return;
        }

        // We created the License, so remove it
        const oaiDoc = document as OpenApiDocument;
        const info = oaiDoc.getInfo();

        if (info) {
            info.setLicense(null as any);
        }
    }
}

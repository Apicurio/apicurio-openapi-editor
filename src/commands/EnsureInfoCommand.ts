/**
 * Command to ensure Info object exists on the document
 */

import {Document, OpenApiDocument} from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to ensure the Info object exists on the document, creating it if necessary
 */
export class EnsureInfoCommand extends BaseCommand {
    private _infoExisted: boolean = false;

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
        return 'EnsureInfoCommand';
    }

    /**
     * Execute the command - create Info if it doesn't exist
     */
    execute(document: Document): void {
        const oaiDoc = document as OpenApiDocument;
        const info = oaiDoc.getInfo();

        if (info) {
            // Info already exists, nothing to do
            this._infoExisted = true;
            return;
        }

        // Info doesn't exist, create it
        this._infoExisted = false;
        const newInfo = oaiDoc.createInfo();
        oaiDoc.setInfo(newInfo);
    }

    /**
     * Undo the command - remove Info if we created it
     */
    undo(document: Document): void {
        if (this._infoExisted) {
            // Info existed before, don't remove it
            return;
        }

        // We created the Info, so remove it
        const oaiDoc = document as OpenApiDocument;
        oaiDoc.setInfo(null as any);
    }
}

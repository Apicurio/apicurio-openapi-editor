/**
 * Command to add a new security requirement to the document
 */

import {
    Document,
    ModelTypeUtil,
    OpenApi20Document,
    OpenApi30Document,
    OpenApi31Document
} from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';
import { SecurityRequirementData } from '@components/modals/SecurityRequirementModal';

/**
 * Command to add a new security requirement to the document
 */
export class AddSecurityRequirementCommand extends BaseCommand {
    private _data: SecurityRequirementData;
    private _index?: number;
    private _requirementAdded: boolean = false;

    /**
     * Constructor
     * @param data Security requirement data
     * @param index Optional index to insert the requirement at (for maintaining order during edits)
     */
    constructor(data: SecurityRequirementData, index?: number) {
        super();
        this._data = data;
        this._index = index;
    }

    /**
     * Returns the type of the command
     */
    type(): string {
        return 'AddSecurityRequirementCommand';
    }

    /**
     * Execute the command - add a new security requirement
     */
    execute(document: Document): void {
        const oaiDoc = document as OpenApi20Document | OpenApi30Document | OpenApi31Document;

        let security = oaiDoc.getSecurity();
        if (!security) {
            security = [];
        }

        // Create new security requirement
        const newRequirement = oaiDoc.createSecurityRequirement();

        // Add scheme references and scopes
        Object.keys(this._data.schemes).forEach(schemeName => {
            const scopes = this._data.schemes[schemeName];
            newRequirement.addSecurityRequirementItem(schemeName, scopes);
        });

        // Handle index-based insertion for maintaining order
        if (this._index !== undefined && this._index < security.length) {
            // Insert at specific index
            security.splice(this._index, 0, newRequirement);
        } else {
            // Append at end
            security.push(newRequirement);
        }

        oaiDoc.setSecurity(security);
        this._requirementAdded = true;
    }

    /**
     * Undo the command - remove the security requirement
     */
    undo(document: Document): void {
        if (!this._requirementAdded) {
            return;
        }

        const oaiDoc = document as OpenApi20Document | OpenApi30Document | OpenApi31Document;
        const security = oaiDoc.getSecurity();

        if (security) {
            const index = this._index !== undefined && this._index < security.length
                ? this._index
                : security.length - 1;

            if (index >= 0 && index < security.length) {
                security.splice(index, 1);
                oaiDoc.setSecurity(security);
            }
        }
    }
}

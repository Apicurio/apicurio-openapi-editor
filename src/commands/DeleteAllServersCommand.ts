/**
 * Command to delete all servers from the document
 */

import { Document, OpenApi30Document, OpenApiServer, Library } from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to delete all server definitions
 */
export class DeleteAllServersCommand extends BaseCommand {
    private _oldServers: any[] = [];

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
        return 'DeleteAllServersCommand';
    }

    /**
     * Execute the command - delete all servers
     */
    execute(document: Document): void {
        const oaiDoc = document as OpenApi30Document;
        const servers = oaiDoc.getServers();

        if (!servers || servers.length === 0) {
            return;
        }

        // Save all servers for undo
        this._oldServers = servers.map((server: OpenApiServer) => Library.writeNode(server));

        // Clear all servers
        oaiDoc.clearServers();
    }

    /**
     * Undo the command - restore all servers
     */
    undo(document: Document): void {
        if (this._oldServers.length === 0) {
            return;
        }

        const oaiDoc = document as OpenApi30Document;

        // Recreate all servers in original order
        this._oldServers.forEach((serverData: any) => {
            const newServer = oaiDoc.createServer();
            Library.readNode(serverData, newServer);
            oaiDoc.addServer(newServer);
        });
    }
}

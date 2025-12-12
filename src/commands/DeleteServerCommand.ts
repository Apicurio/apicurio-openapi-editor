/**
 * Command to delete a server from the document
 */

import { Document, OpenApi30Document, OpenApiServer, Library } from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to delete a server definition
 */
export class DeleteServerCommand extends BaseCommand {
    private _serverUrl: string;
    private _oldServer: any = null;
    private _serverExisted: boolean = false;
    private _serverIndex: number = -1;

    /**
     * Constructor
     * @param serverUrl The server URL to delete
     */
    constructor(serverUrl: string) {
        super();
        this._serverUrl = serverUrl;
    }

    /**
     * Returns the type of the command
     */
    type(): string {
        return 'DeleteServerCommand';
    }

    /**
     * Execute the command - delete the server
     */
    execute(document: Document): void {
        const oaiDoc = document as OpenApi30Document;
        const servers = oaiDoc.getServers();

        if (!servers) {
            this._serverExisted = false;
            return;
        }

        // Find the server to delete
        const serverIndex = servers.findIndex((s: OpenApiServer) => s.getUrl() === this._serverUrl);

        if (serverIndex < 0) {
            this._serverExisted = false;
            return;
        }

        const server = servers[serverIndex];

        // Save the server and its index for undo
        this._oldServer = Library.writeNode(server);
        this._serverIndex = serverIndex;
        this._serverExisted = true;

        // Remove the server
        oaiDoc.removeServer(server);
    }

    /**
     * Undo the command - restore the server
     */
    undo(document: Document): void {
        if (!this._serverExisted || !this._oldServer) {
            return;
        }

        const oaiDoc = document as OpenApi30Document;

        // Recreate the server
        const newServer = oaiDoc.createServer();
        Library.readNode(this._oldServer, newServer);

        // Add it back at the same position
        oaiDoc.insertServer(newServer, this._serverIndex);
    }
}

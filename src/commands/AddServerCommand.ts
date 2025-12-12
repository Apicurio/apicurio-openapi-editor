/**
 * Command to add a new server to the document
 */

import {Document, OpenApi30Document, OpenApi30Server, OpenApiServer} from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';

/**
 * Command to add a new server definition to the document
 */
export class AddServerCommand extends BaseCommand {
    private _serverUrl: string;
    private _serverDescription: string;
    private _serverCreated: boolean = false;

    /**
     * Constructor
     * @param serverUrl The URL of the server to create
     * @param serverDescription Optional description for the server
     */
    constructor(serverUrl: string, serverDescription?: string) {
        super();
        this._serverUrl = serverUrl;
        this._serverDescription = serverDescription || '';
    }

    /**
     * Returns the type of the command
     */
    type(): string {
        return 'AddServerCommand';
    }

    /**
     * Extract variable names from a server URL
     * Example: "http://{domain}.example.com:{port}/api" returns ["domain", "port"]
     */
    private extractVariables(url: string): string[] {
        const variables: string[] = [];
        const regex = /\{([^}]+)\}/g;
        let match;

        while ((match = regex.exec(url)) !== null) {
            variables.push(match[1]);
        }

        return variables;
    }

    /**
     * Execute the command - add a new server
     */
    execute(document: Document): void {
        const oaiDoc = document as OpenApi30Document;

        // Check if server already exists
        const existingServers = oaiDoc.getServers();
        if (existingServers) {
            const existingServer = existingServers.find((server: OpenApiServer) => server.getUrl() === this._serverUrl);
            if (existingServer) {
                this._serverCreated = false;
                return;
            }
        }

        // Create new server
        const newServer = oaiDoc.createServer() as OpenApi30Server;
        newServer.setUrl(this._serverUrl);
        if (this._serverDescription) {
            newServer.setDescription(this._serverDescription);
        }

        // Extract and create server variables
        const variableNames = this.extractVariables(this._serverUrl);
        for (const variableName of variableNames) {
            const serverVariable = newServer.createServerVariable();
            newServer.addVariable(variableName, serverVariable);
        }

        // Add the server to the document
        oaiDoc.addServer(newServer);
        this._serverCreated = true;
    }

    /**
     * Undo the command - remove the server
     */
    undo(document: Document): void {
        if (!this._serverCreated) {
            // Server wasn't created, nothing to undo
            return;
        }

        const oaiDoc = document as OpenApi30Document;
        const servers = oaiDoc.getServers();

        if (!servers) {
            return;
        }

        // Find and remove the server
        const server = servers.find((s: OpenApiServer) => s.getUrl() === this._serverUrl);
        if (server) {
            oaiDoc.removeServer(server);
        }
    }

}

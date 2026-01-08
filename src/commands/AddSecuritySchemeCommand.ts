/**
 * Command to add a new security scheme to the document
 */

import {
    Document,
    ModelTypeUtil,
    OpenApi20Document,
    OpenApi20SecurityScheme,
    OpenApi30Document,
    OpenApi30SecurityScheme,
    OpenApi31Document
} from '@apicurio/data-models';
import { BaseCommand } from './BaseCommand';
import { SecuritySchemeData } from '@components/modals/NewSecuritySchemeModal';

/**
 * Command to add a new security scheme definition to the document
 */
export class AddSecuritySchemeCommand extends BaseCommand {
    private _data: SecuritySchemeData;
    private _schemeCreated: boolean = false;

    /**
     * Constructor
     * @param data Security scheme data
     */
    constructor(data: SecuritySchemeData) {
        super();
        this._data = data;
    }

    /**
     * Returns the type of the command
     */
    type(): string {
        return 'AddSecuritySchemeCommand';
    }

    /**
     * Execute the command - add a new security scheme
     */
    execute(document: Document): void {
        if (ModelTypeUtil.isOpenApi2Model(document)) {
            this.executeForOpenApi20(document as OpenApi20Document);
        } else {
            this.executeForOpenApi30(document as OpenApi30Document | OpenApi31Document);
        }
    }

    /**
     * Execute for OpenAPI 2.0
     */
    private executeForOpenApi20(oaiDoc: OpenApi20Document): void {
        let definitions = oaiDoc.getSecurityDefinitions();
        if (!definitions) {
            definitions = oaiDoc.createSecurityDefinitions();
            oaiDoc.setSecurityDefinitions(definitions);
        }

        // Check if scheme already exists
        const existingScheme = definitions.getItem(this._data.name);
        if (existingScheme) {
            this._schemeCreated = false;
            return;
        }

        // Create new security scheme
        const newScheme = definitions.createSecurityScheme() as OpenApi20SecurityScheme;
        newScheme.setType(this._data.type);

        if (this._data.description) {
            newScheme.setDescription(this._data.description);
        }

        // Type-specific fields
        if (this._data.type === 'apiKey') {
            if (this._data.parameterName) {
                newScheme.setName(this._data.parameterName);
            }
            if (this._data.in) {
                newScheme.setIn(this._data.in);
            }
        } else if (this._data.type === 'oauth2') {
            if (this._data.flow) {
                newScheme.setFlow(this._data.flow);
            }
            if (this._data.authorizationUrl) {
                newScheme.setAuthorizationUrl(this._data.authorizationUrl);
            }
            if (this._data.tokenUrl) {
                newScheme.setTokenUrl(this._data.tokenUrl);
            }
            // Create empty scopes object
            const scopes = newScheme.createScopes();
            newScheme.setScopes(scopes);
        }

        definitions.addItem(this._data.name, newScheme);
        this._schemeCreated = true;
    }

    /**
     * Execute for OpenAPI 3.0/3.1
     */
    private executeForOpenApi30(oaiDoc: OpenApi30Document | OpenApi31Document): void {
        let components = oaiDoc.getComponents();
        if (!components) {
            components = oaiDoc.createComponents();
            oaiDoc.setComponents(components);
        }

        let securitySchemes = components.getSecuritySchemes();
        if (!securitySchemes) {
            securitySchemes = {};
        }

        // Check if scheme already exists
        if (securitySchemes[this._data.name]) {
            this._schemeCreated = false;
            return;
        }

        // Create new security scheme
        const newScheme = components.createSecurityScheme() as OpenApi30SecurityScheme;
        newScheme.setType(this._data.type);

        if (this._data.description) {
            newScheme.setDescription(this._data.description);
        }

        // Type-specific fields
        if (this._data.type === 'apiKey') {
            if (this._data.parameterName) {
                newScheme.setName(this._data.parameterName);
            }
            if (this._data.in) {
                newScheme.setIn(this._data.in);
            }
        } else if (this._data.type === 'http') {
            if (this._data.scheme) {
                newScheme.setScheme(this._data.scheme);
            }
            if (this._data.bearerFormat) {
                newScheme.setBearerFormat(this._data.bearerFormat);
            }
        } else if (this._data.type === 'oauth2') {
            if (this._data.flow) {
                // Create OAuth flows object
                const flows = newScheme.createOAuthFlows();

                // Create the appropriate flow
                if (this._data.flow === 'implicit') {
                    const implicitFlow = flows.createImplicitOAuthFlow();
                    if (this._data.authorizationUrl) {
                        implicitFlow.setAuthorizationUrl(this._data.authorizationUrl);
                    }
                    // Create empty scopes
                    const scopes = implicitFlow.createScopes();
                    implicitFlow.setScopes(scopes);
                    flows.setImplicit(implicitFlow);
                } else if (this._data.flow === 'password') {
                    const passwordFlow = flows.createPasswordOAuthFlow();
                    if (this._data.tokenUrl) {
                        passwordFlow.setTokenUrl(this._data.tokenUrl);
                    }
                    // Create empty scopes
                    const scopes = passwordFlow.createScopes();
                    passwordFlow.setScopes(scopes);
                    flows.setPassword(passwordFlow);
                } else if (this._data.flow === 'clientCredentials') {
                    const clientCredsFlow = flows.createClientCredentialsOAuthFlow();
                    if (this._data.tokenUrl) {
                        clientCredsFlow.setTokenUrl(this._data.tokenUrl);
                    }
                    // Create empty scopes
                    const scopes = clientCredsFlow.createScopes();
                    clientCredsFlow.setScopes(scopes);
                    flows.setClientCredentials(clientCredsFlow);
                } else if (this._data.flow === 'authorizationCode') {
                    const authCodeFlow = flows.createAuthorizationCodeOAuthFlow();
                    if (this._data.authorizationUrl) {
                        authCodeFlow.setAuthorizationUrl(this._data.authorizationUrl);
                    }
                    if (this._data.tokenUrl) {
                        authCodeFlow.setTokenUrl(this._data.tokenUrl);
                    }
                    // Create empty scopes
                    const scopes = authCodeFlow.createScopes();
                    authCodeFlow.setScopes(scopes);
                    flows.setAuthorizationCode(authCodeFlow);
                }

                newScheme.setFlows(flows);
            }
        } else if (this._data.type === 'openIdConnect') {
            if (this._data.openIdConnectUrl) {
                newScheme.setOpenIdConnectUrl(this._data.openIdConnectUrl);
            }
        }

        components.addSecurityScheme(this._data.name, newScheme);
        this._schemeCreated = true;
    }

    /**
     * Undo the command - remove the security scheme
     */
    undo(document: Document): void {
        if (!this._schemeCreated) {
            return;
        }

        if (ModelTypeUtil.isOpenApi2Model(document)) {
            const oaiDoc = document as OpenApi20Document;
            const definitions = oaiDoc.getSecurityDefinitions();
            if (definitions) {
                definitions.removeItem(this._data.name);
            }
        } else {
            const oaiDoc = document as OpenApi30Document | OpenApi31Document;
            const components = oaiDoc.getComponents();
            if (components) {
                components.removeSecurityScheme(this._data.name);
            }
        }
    }
}

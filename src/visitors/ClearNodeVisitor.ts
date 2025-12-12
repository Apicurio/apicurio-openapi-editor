/**
 * Visitor to clear all data from a node
 * This is used before applying new content to ensure old properties don't linger
 */

import {
    CombinedOpenApiVisitorAdapter,
    OpenApi30Document,
    OpenApi30Info,
    OpenApi30Contact,
    OpenApi30License,
    OpenApi30Server,
    OpenApi30ServerVariable,
    OpenApi30Operation,
    OpenApi30ExternalDocumentation,
    OpenApi30Parameter,
    OpenApi30RequestBody,
    OpenApi30MediaType,
    OpenApi30Encoding,
    OpenApi30Responses,
    OpenApi30Response,
    OpenApi30Header,
    OpenApi30Schema,
    OpenApi30Discriminator,
    OpenApi30XML,
    OpenApi30SecurityScheme,
    OpenApi30SecurityRequirement,
    OpenApi30Tag,
    OpenApi30Example,
    OpenApi30Link,
    OpenApi30Callback,
    OpenApi30Components,
    OpenApiPathItem,
} from '@apicurio/data-models';

/**
 * Visitor that clears all properties from nodes
 * Each visit method should clear all the properties specific to that node type
 */
export class ClearNodeVisitor extends CombinedOpenApiVisitorAdapter {
    /**
     * Clear all properties from the document
     */
    visitDocument(node: OpenApi30Document): void {
        node.openapi = null as any;
        node.info = null as any;
        node.servers = null as any;
        node.paths = null as any;
        node.components = null as any;
        node.security = null as any;
        node.tags = null as any;
        node.externalDocs = null as any;
    }

    /**
     * Clear all properties from info
     */
    visitInfo(node: OpenApi30Info): void {
        node.title = null as any;
        node.description = null as any;
        node.termsOfService = null as any;
        node.contact = null as any;
        node.license = null as any;
        node.version = null as any;
    }

    /**
     * Clear all properties from contact
     */
    visitContact(node: OpenApi30Contact): void {
        node.name = null as any;
        node.url = null as any;
        node.email = null as any;
    }

    /**
     * Clear all properties from license
     */
    visitLicense(node: OpenApi30License): void {
        node.name = null as any;
        node.url = null as any;
    }

    /**
     * Clear all properties from server
     */
    visitServer(node: OpenApi30Server): void {
        node.url = null as any;
        node.description = null as any;
        node.variables = null as any;
    }

    /**
     * Clear all properties from server variable
     */
    visitServerVariable(node: OpenApi30ServerVariable): void {
        node.enum = null as any;
        node.default = null as any;
        node.description = null as any;
    }

    /**
     * Clear all properties from path item
     */
    visitPathItem(node: OpenApiPathItem): void {
        node.summary = null as any;
        node.description = null as any;
        node.get = null as any;
        node.put = null as any;
        node.post = null as any;
        node.delete = null as any;
        node.options = null as any;
        node.head = null as any;
        node.patch = null as any;
        node.trace = null as any;
        node.servers = null as any;
        node.parameters = null as any;
    }

    /**
     * Clear all properties from operation
     */
    visitOperation(node: OpenApi30Operation): void {
        node.tags = null as any;
        node.summary = null as any;
        node.description = null as any;
        node.externalDocs = null as any;
        node.operationId = null as any;
        node.parameters = null as any;
        node.requestBody = null as any;
        node.responses = null as any;
        node.callbacks = null as any;
        node.deprecated = null as any;
        node.security = null as any;
        node.servers = null as any;
    }

    /**
     * Clear all properties from external documentation
     */
    visitExternalDocumentation(node: OpenApi30ExternalDocumentation): void {
        node.description = null as any;
        node.url = null as any;
    }

    /**
     * Clear all properties from parameter
     */
    visitParameter(node: OpenApi30Parameter): void {
        node.name = null as any;
        node.in = null as any;
        node.description = null as any;
        node.required = null as any;
        node.deprecated = null as any;
        node.allowEmptyValue = null as any;
        node.style = null as any;
        node.explode = null as any;
        node.allowReserved = null as any;
        node.schema = null as any;
        node.example = null as any;
        node.examples = null as any;
        node.content = null as any;
    }

    /**
     * Clear all properties from request body
     */
    visitRequestBody(node: OpenApi30RequestBody): void {
        node.description = null as any;
        node.content = null as any;
        node.required = null as any;
    }

    /**
     * Clear all properties from media type
     */
    visitMediaType(node: OpenApi30MediaType): void {
        node.schema = null as any;
        node.example = null as any;
        node.examples = null as any;
        node.encoding = null as any;
    }

    /**
     * Clear all properties from encoding
     */
    visitEncoding(node: OpenApi30Encoding): void {
        node.contentType = null as any;
        node.headers = null as any;
        node.style = null as any;
        node.explode = null as any;
        node.allowReserved = null as any;
    }

    /**
     * Clear all properties from responses
     */
    visitResponses(node: OpenApi30Responses): void {
        node.default = null as any;
        // Clear all status code responses
        const keys = Object.keys(node);
        keys.forEach(key => {
            if (key !== 'default' && key !== '_ownerDocument' && key !== '_parent') {
                (node as any)[key] = null;
            }
        });
    }

    /**
     * Clear all properties from response
     */
    visitResponse(node: OpenApi30Response): void {
        node.description = null as any;
        node.headers = null as any;
        node.content = null as any;
        node.links = null as any;
    }

    /**
     * Clear all properties from header
     */
    visitHeader(node: OpenApi30Header): void {
        node.description = null as any;
        node.required = null as any;
        node.deprecated = null as any;
        node.allowEmptyValue = null as any;
        node.style = null as any;
        node.explode = null as any;
        node.allowReserved = null as any;
        node.schema = null as any;
        node.example = null as any;
        node.examples = null as any;
        node.content = null as any;
    }

    /**
     * Clear all properties from schema
     */
    visitSchema(node: OpenApi30Schema): void {
        node.title = null as any;
        node.multipleOf = null as any;
        node.maximum = null as any;
        node.exclusiveMaximum = null as any;
        node.minimum = null as any;
        node.exclusiveMinimum = null as any;
        node.maxLength = null as any;
        node.minLength = null as any;
        node.pattern = null as any;
        node.maxItems = null as any;
        node.minItems = null as any;
        node.uniqueItems = null as any;
        node.maxProperties = null as any;
        node.minProperties = null as any;
        node.required = null as any;
        node.enum = null as any;
        node.type = null as any;
        node.allOf = null as any;
        node.oneOf = null as any;
        node.anyOf = null as any;
        node.not = null as any;
        node.items = null as any;
        node.properties = null as any;
        node.additionalProperties = null as any;
        node.description = null as any;
        node.format = null as any;
        node.default = null as any;
        node.nullable = null as any;
        node.discriminator = null as any;
        node.readOnly = null as any;
        node.writeOnly = null as any;
        node.xml = null as any;
        node.externalDocs = null as any;
        node.example = null as any;
        node.deprecated = null as any;
    }

    /**
     * Clear all properties from discriminator
     */
    visitDiscriminator(node: OpenApi30Discriminator): void {
        node.propertyName = null as any;
        node.mapping = null as any;
    }

    /**
     * Clear all properties from XML
     */
    visitXML(node: OpenApi30XML): void {
        node.name = null as any;
        node.namespace = null as any;
        node.prefix = null as any;
        node.attribute = null as any;
        node.wrapped = null as any;
    }

    /**
     * Clear all properties from security scheme
     */
    visitSecurityScheme(node: OpenApi30SecurityScheme): void {
        node.type = null as any;
        node.description = null as any;
        node.name = null as any;
        node.in = null as any;
        node.scheme = null as any;
        node.bearerFormat = null as any;
        node.flows = null as any;
        node.openIdConnectUrl = null as any;
    }

    /**
     * Clear all properties from security requirement
     */
    visitSecurityRequirement(node: OpenApi30SecurityRequirement): void {
        const keys = Object.keys(node);
        keys.forEach(key => {
            if (key !== '_ownerDocument' && key !== '_parent') {
                (node as any)[key] = undefined;
            }
        });
    }

    /**
     * Clear all properties from tag
     */
    visitTag(node: OpenApi30Tag): void {
        node.name = null as any;
        node.description = null as any;
        node.externalDocs = null as any;
    }

    /**
     * Clear all properties from example
     */
    visitExample(node: OpenApi30Example): void {
        node.summary = null as any;
        node.description = null as any;
        node.value = null as any;
        node.externalValue = null as any;
    }

    /**
     * Clear all properties from link
     */
    visitLink(node: OpenApi30Link): void {
        node.operationRef = null as any;
        node.operationId = null as any;
        node.parameters = null as any;
        node.requestBody = null as any;
        node.description = null as any;
        node.server = null as any;
    }

    /**
     * Clear all properties from callback
     */
    visitCallback(node: OpenApi30Callback): void {
        const keys = Object.keys(node);
        keys.forEach(key => {
            if (key !== '_ownerDocument' && key !== '_parent') {
                (node as any)[key] = undefined;
            }
        });
    }

    /**
     * Clear all properties from components
     */
    visitComponents(node: OpenApi30Components): void {
        node.schemas = null as any;
        node.responses = null as any;
        node.parameters = null as any;
        node.examples = null as any;
        node.requestBodies = null as any;
        node.headers = null as any;
        node.securitySchemes = null as any;
        node.links = null as any;
        node.callbacks = null as any;
    }
}

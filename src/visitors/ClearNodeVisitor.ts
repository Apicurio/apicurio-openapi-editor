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
        node.setOpenapi(null as any);
        node.setInfo(null as any);
        (node as any).servers = null;
        node.setPaths(null as any);
        node.setComponents(null as any);
        (node as any).security = null;
        (node as any).tags = null;
        node.setExternalDocs(null as any);
    }

    /**
     * Clear all properties from info
     */
    visitInfo(node: OpenApi30Info): void {
        node.setTitle(null as any);
        node.setDescription(null as any);
        node.setTermsOfService(null as any);
        node.setContact(null as any);
        node.setLicense(null as any);
        node.setVersion(null as any);
    }

    /**
     * Clear all properties from contact
     */
    visitContact(node: OpenApi30Contact): void {
        node.setName(null as any);
        node.setUrl(null as any);
        node.setEmail(null as any);
    }

    /**
     * Clear all properties from license
     */
    visitLicense(node: OpenApi30License): void {
        node.setName(null as any);
        node.setUrl(null as any);
    }

    /**
     * Clear all properties from server
     */
    visitServer(node: OpenApi30Server): void {
        node.setUrl(null as any);
        node.setDescription(null as any);
        (node as any).variables = null;
    }

    /**
     * Clear all properties from server variable
     */
    visitServerVariable(node: OpenApi30ServerVariable): void {
        node.setEnum(null as any);
        node.setDefault(null as any);
        node.setDescription(null as any);
    }

    /**
     * Clear all properties from path item
     */
    visitPathItem(node: OpenApiPathItem): void {
        (node as any).summary = null;
        (node as any).description = null;
        node.setGet(null as any);
        node.setPut(null as any);
        node.setPost(null as any);
        node.setDelete(null as any);
        node.setOptions(null as any);
        node.setHead(null as any);
        node.setPatch(null as any);
        (node as any).trace = null;
        (node as any).servers = null;
        (node as any).parameters = null;
    }

    /**
     * Clear all properties from operation
     */
    visitOperation(node: OpenApi30Operation): void {
        node.setTags(null as any);
        node.setSummary(null as any);
        node.setDescription(null as any);
        node.setExternalDocs(null as any);
        node.setOperationId(null as any);
        (node as any).parameters = null;
        node.setRequestBody(null as any);
        node.setResponses(null as any);
        (node as any).callbacks = null;
        node.setDeprecated(null as any);
        (node as any).security = null;
        (node as any).servers = null;
    }

    /**
     * Clear all properties from external documentation
     */
    visitExternalDocumentation(node: OpenApi30ExternalDocumentation): void {
        node.setDescription(null as any);
        node.setUrl(null as any);
    }

    /**
     * Clear all properties from parameter
     */
    visitParameter(node: OpenApi30Parameter): void {
        node.setName(null as any);
        node.setIn(null as any);
        node.setDescription(null as any);
        node.setRequired(null as any);
        node.setDeprecated(null as any);
        node.setAllowEmptyValue(null as any);
        node.setStyle(null as any);
        node.setExplode(null as any);
        node.setAllowReserved(null as any);
        node.setSchema(null as any);
        node.setExample(null as any);
        (node as any).examples = null;
        (node as any).content = null;
    }

    /**
     * Clear all properties from request body
     */
    visitRequestBody(node: OpenApi30RequestBody): void {
        node.setDescription(null as any);
        (node as any).content = null;
        node.setRequired(null as any);
    }

    /**
     * Clear all properties from media type
     */
    visitMediaType(node: OpenApi30MediaType): void {
        node.setSchema(null as any);
        node.setExample(null as any);
        (node as any).examples = null;
        (node as any).encoding = null;
    }

    /**
     * Clear all properties from encoding
     */
    visitEncoding(node: OpenApi30Encoding): void {
        node.setContentType(null as any);
        (node as any).headers = null;
        node.setStyle(null as any);
        node.setExplode(null as any);
        node.setAllowReserved(null as any);
    }

    /**
     * Clear all properties from responses
     */
    visitResponses(node: OpenApi30Responses): void {
        node.setDefault(null as any);
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
        node.setDescription(null as any);
        (node as any).headers = null;
        (node as any).content = null;
        (node as any).links = null;
    }

    /**
     * Clear all properties from header
     */
    visitHeader(node: OpenApi30Header): void {
        node.setDescription(null as any);
        node.setRequired(null as any);
        node.setDeprecated(null as any);
        node.setAllowEmptyValue(null as any);
        node.setStyle(null as any);
        node.setExplode(null as any);
        node.setAllowReserved(null as any);
        node.setSchema(null as any);
        node.setExample(null as any);
        (node as any).examples = null;
        (node as any).content = null;
    }

    /**
     * Clear all properties from schema
     */
    visitSchema(node: OpenApi30Schema): void {
        node.setTitle(null as any);
        node.setMultipleOf(null as any);
        node.setMaximum(null as any);
        node.setExclusiveMaximum(null as any);
        node.setMinimum(null as any);
        node.setExclusiveMinimum(null as any);
        node.setMaxLength(null as any);
        node.setMinLength(null as any);
        node.setPattern(null as any);
        node.setMaxItems(null as any);
        node.setMinItems(null as any);
        node.setUniqueItems(null as any);
        node.setMaxProperties(null as any);
        node.setMinProperties(null as any);
        node.setRequired(null as any);
        node.setEnum(null as any);
        node.setType(null as any);
        (node as any).allOf = null;
        (node as any).oneOf = null;
        (node as any).anyOf = null;
        node.setNot(null as any);
        node.setItems(null as any);
        (node as any).properties = null;
        node.setAdditionalProperties(null as any);
        node.setDescription(null as any);
        node.setFormat(null as any);
        node.setDefault(null as any);
        node.setNullable(null as any);
        node.setDiscriminator(null as any);
        node.setReadOnly(null as any);
        node.setWriteOnly(null as any);
        node.setXml(null as any);
        node.setExternalDocs(null as any);
        node.setExample(null as any);
        node.setDeprecated(null as any);
    }

    /**
     * Clear all properties from discriminator
     */
    visitDiscriminator(node: OpenApi30Discriminator): void {
        node.setPropertyName(null as any);
        node.setMapping(null as any);
    }

    /**
     * Clear all properties from XML
     */
    visitXML(node: OpenApi30XML): void {
        node.setName(null as any);
        node.setNamespace(null as any);
        node.setPrefix(null as any);
        node.setAttribute(null as any);
        node.setWrapped(null as any);
    }

    /**
     * Clear all properties from security scheme
     */
    visitSecurityScheme(node: OpenApi30SecurityScheme): void {
        node.setType(null as any);
        node.setDescription(null as any);
        node.setName(null as any);
        node.setIn(null as any);
        node.setScheme(null as any);
        node.setBearerFormat(null as any);
        node.setFlows(null as any);
        node.setOpenIdConnectUrl(null as any);
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
        node.setName(null as any);
        node.setDescription(null as any);
        node.setExternalDocs(null as any);
    }

    /**
     * Clear all properties from example
     */
    visitExample(node: OpenApi30Example): void {
        node.setSummary(null as any);
        node.setDescription(null as any);
        node.setValue(null as any);
        node.setExternalValue(null as any);
    }

    /**
     * Clear all properties from link
     */
    visitLink(node: OpenApi30Link): void {
        node.setOperationRef(null as any);
        node.setOperationId(null as any);
        node.setParameters(null as any);
        node.setRequestBody(null as any);
        node.setDescription(null as any);
        node.setServer(null as any);
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
        (node as any).schemas = null;
        (node as any).responses = null;
        (node as any).parameters = null;
        (node as any).examples = null;
        (node as any).requestBodies = null;
        (node as any).headers = null;
        (node as any).securitySchemes = null;
        (node as any).links = null;
        (node as any).callbacks = null;
    }
}

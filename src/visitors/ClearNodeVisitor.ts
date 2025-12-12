/**
 * Visitor to clear all data from a node
 * This is used before applying new content to ensure old properties don't linger
 */

import {
    CombinedOpenApiVisitorAdapter,
    OpenApi30Document,
    OpenApi30Response,
    OpenApi30Schema,
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
     * Clear all properties from response
     */
    visitResponse(node: OpenApi30Response): void {
        node.setDescription(null as any);
        (node as any).headers = null;
        (node as any).content = null;
        (node as any).links = null;
    }
}

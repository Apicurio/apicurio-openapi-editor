/**
 * Properties for the OpenAPIEditor component
 */
export interface OpenAPIEditorProps {
    /**
     * The initial OpenAPI content (as JSON object or JSON string)
     */
    initialContent?: object | string;

    /**
     * Callback fired when the OpenAPI document changes
     */
    onChange?: (content: object) => void;

    /**
     * Optional features configuration
     */
    features?: EditorFeatures;
}

/**
 * Feature flags for the editor
 */
export interface EditorFeatures {
    /**
     * Enable/disable specific editor features
     */
    allowImports?: boolean;
    allowCustomValidations?: boolean;
}

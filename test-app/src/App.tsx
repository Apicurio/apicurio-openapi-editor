import { useState, useRef, useEffect } from 'react';
import {
    Page,
    PageSection,
    Masthead,
    MastheadMain,
    MastheadContent,
    Title,
    Button,
    Flex,
    FlexItem,
    Modal,
    ModalVariant,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Switch,
} from '@patternfly/react-core';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { MoonIcon, SunIcon } from '@patternfly/react-icons';
import { OpenAPIEditor } from '../../src/components/editor/OpenAPIEditor';
import './App.css';
import { DocumentChangeEvent, SelectionChangeEvent } from "@models/EditorProps.ts";

/**
 * Empty OpenAPI document
 */
const emptyAPI = {
    openapi: '3.0.3',
    paths: {},
};

/**
 * OpenAPI 2.0 Example API
 */
const openApi20ExampleAPI = {
    swagger: '2.0',
    info: {
        title: 'OpenAPI 2.0 Example API',
        version: '1.0.0',
        description: 'A brand new API with no content.  Go nuts!',
        contact: {
            name: 'Clark Kent',
            url: 'http://www.superman.com',
            email: 'ckent@gmail.com',
        },
        license: {
            name: 'GNU AGPLv3',
            url: 'https://www.gnu.org/licenses/agpl.txt',
        },
    },
    consumes: ['application/json'],
    produces: ['application/json'],
    paths: {
        '/examples': {
            get: {
                responses: {
                    '200': {
                        description: 'Successful response - returns an array of `Example` entities.',
                        schema: {
                            type: 'array',
                            items: {
                                $ref: '#/definitions/Example',
                            },
                        },
                    },
                },
                operationId: 'getexamples',
                summary: 'List All examples',
                description: 'Gets a list of all `Example` entities.',
            },
            post: {
                parameters: [
                    {
                        name: 'body',
                        description: 'A new `Example` to be created.',
                        schema: {
                            $ref: '#/definitions/Example',
                        },
                        in: 'body',
                        required: true,
                    },
                ],
                responses: {
                    '201': {
                        description: 'Successful response.',
                    },
                },
                operationId: 'createExample',
                summary: 'Create a Example',
                description: 'Creates a new instance of a `Example`.',
            },
        },
        '/examples/{exampleId}': {
            get: {
                responses: {
                    '200': {
                        description: 'Successful response - returns a single `Example`.',
                        schema: {
                            $ref: '#/definitions/Example',
                        },
                    },
                },
                operationId: 'getExample',
                summary: 'Get a Example',
                description: 'Gets the details of a single instance of a `Example`.',
            },
            put: {
                parameters: [
                    {
                        name: 'body',
                        description: 'Updated `Example` information.',
                        schema: {
                            $ref: '#/definitions/Example',
                        },
                        in: 'body',
                        required: true,
                    },
                ],
                responses: {
                    '202': {
                        description: 'Successful response.',
                    },
                },
                operationId: 'updateExample',
                summary: 'Update a Example',
                description: 'Updates an existing `Example`.',
            },
            delete: {
                responses: {
                    '204': {
                        description: 'Successful response.',
                    },
                },
                operationId: 'deleteExample',
                summary: 'Delete a Example',
                description: 'Deletes an existing `Example`.',
            },
            parameters: [
                {
                    name: 'exampleId',
                    description: 'A unique identifier for a `Example`.',
                    in: 'path',
                    required: true,
                    type: 'string',
                },
            ],
        },
    },
    definitions: {
        Example: {
            title: 'Root Type for Example',
            description: 'An example data type.',
            type: 'object',
            properties: {
                name: {
                    type: 'string',
                },
                alias: {
                    type: 'string',
                },
                height: {
                    format: 'int32',
                    type: 'integer',
                },
                age: {
                    format: 'int32',
                    type: 'integer',
                },
            },
            example: {
                name: 'Clark Kent',
                alias: 'Superman',
                height: 73,
                age: 33,
            },
        },
    },
    securityDefinitions: {
        basic: {
            type: 'basic',
            description: 'Standard BASIC auth.',
        },
        key: {
            type: 'apiKey',
            description: 'API key based security.',
            name: 'X-API-Key',
            in: 'header',
        },
    },
    security: [
        {
            basic: [],
        },
        {
            key: [],
        },
    ],
};

/**
 * Pet Store API (standard OpenAPI example)
 */
const petStoreAPI = {
    openapi: '3.0.3',
    info: {
        title: 'Swagger Petstore - OpenAPI 3.0',
        version: '1.0.0',
        description: 'This is a sample Pet Store Server based on the OpenAPI 3.0 specification.',
        contact: {
            email: 'apiteam@swagger.io',
        },
        license: {
            name: 'Apache 2.0',
            url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
        },
    },
    servers: [
        {
            url: 'https://petstore3.swagger.io/api/v3',
        },
    ],
    paths: {
        '/pet': {
            put: {
                summary: 'Update an existing pet',
                description: 'Update an existing pet by Id',
                operationId: 'updatePet',
                requestBody: {
                    description: 'Update an existent pet in the store',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Pet',
                            },
                        },
                    },
                    required: true,
                },
                responses: {
                    '200': {
                        description: 'Successful operation',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Pet',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid ID supplied',
                    },
                    '404': {
                        description: 'Pet not found',
                    },
                },
            },
            post: {
                summary: 'Add a new pet to the store',
                description: 'Add a new pet to the store',
                operationId: 'addPet',
                requestBody: {
                    description: 'Create a new pet in the store',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Pet',
                            },
                        },
                    },
                    required: true,
                },
                responses: {
                    '200': {
                        description: 'Successful operation',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Pet',
                                },
                            },
                        },
                    },
                },
            },
        },
        '/pet/{petId}': {
            get: {
                summary: 'Find pet by ID',
                description: 'Returns a single pet',
                operationId: 'getPetById',
                parameters: [
                    {
                        name: 'petId',
                        in: 'path',
                        description: 'ID of pet to return',
                        required: true,
                        schema: {
                            type: 'integer',
                            format: 'int64',
                        },
                    },
                ],
                responses: {
                    '200': {
                        description: 'successful operation',
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/Pet',
                                },
                            },
                        },
                    },
                    '400': {
                        description: 'Invalid ID supplied',
                    },
                    '404': {
                        description: 'Pet not found',
                    },
                },
            },
            delete: {
                summary: 'Deletes a pet',
                description: 'Delete a pet',
                operationId: 'deletePet',
                parameters: [
                    {
                        name: 'petId',
                        in: 'path',
                        description: 'Pet id to delete',
                        required: true,
                        schema: {
                            type: 'integer',
                            format: 'int64',
                        },
                    },
                ],
                responses: {
                    '400': {
                        description: 'Invalid pet value',
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Pet: {
                type: 'object',
                required: ['name', 'photoUrls'],
                properties: {
                    id: {
                        type: 'integer',
                        format: 'int64',
                        example: 10,
                    },
                    name: {
                        type: 'string',
                        example: 'doggie',
                    },
                    category: {
                        $ref: '#/components/schemas/Category',
                    },
                    photoUrls: {
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    tags: {
                        type: 'array',
                        items: {
                            $ref: '#/components/schemas/Tag',
                        },
                    },
                    status: {
                        type: 'string',
                        description: 'pet status in the store',
                        enum: ['available', 'pending', 'sold'],
                    },
                },
            },
            Category: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        format: 'int64',
                        example: 1,
                    },
                    name: {
                        type: 'string',
                        example: 'Dogs',
                    },
                },
            },
            Tag: {
                type: 'object',
                properties: {
                    id: {
                        type: 'integer',
                        format: 'int64',
                    },
                    name: {
                        type: 'string',
                    },
                },
            },
        },
    },
};

/**
 * Test application for the OpenAPI Editor component
 */
function App() {
    const [content, setContent] = useState<object>(petStoreAPI);
    const [loading, setLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
    const [jsonContent, setJsonContent] = useState('');
    const [isDarkTheme, setIsDarkTheme] = useState(() => {
        // Initialize from localStorage or default to light theme
        const savedTheme = localStorage.getItem('pf-theme');
        return savedTheme === 'dark';
    });
    const getContentRef = useRef<(() => object | null) | null>(null);
    const [currentSelection, setCurrentSelection] = useState<SelectionChangeEvent>();

    // Apply theme class to html element
    useEffect(() => {
        const htmlElement = document.documentElement;
        if (isDarkTheme) {
            htmlElement.classList.add('pf-v6-theme-dark');
            localStorage.setItem('pf-theme', 'dark');
        } else {
            htmlElement.classList.remove('pf-v6-theme-dark');
            localStorage.setItem('pf-theme', 'light');
        }
    }, [isDarkTheme]);

    const handleToggleTheme = () => {
        setIsDarkTheme(!isDarkTheme);
    };

    const handleChange = (event: DocumentChangeEvent) => {
        setIsDirty(event.isDirty);
        getContentRef.current = event.getContent;
    };

    const handleSave = () => {
        if (getContentRef.current) {
            const currentContent = getContentRef.current();
            console.log('Saving content:', currentContent);
            // In a real app, you would save to a server here
            // For now, display the JSON in a modal
            if (currentContent) {
                setJsonContent(JSON.stringify(currentContent, null, 2));
                setIsJsonModalOpen(true);
                setIsDirty(false);
            }
        }
    };

    const handleLoadEmpty = () => {
        setContent(emptyAPI);
    };

    const handleLoadPetStore = () => {
        setContent(petStoreAPI);
    };

    const handleLoad20Example = () => {
        setContent(openApi20ExampleAPI);
    };

    const handleLoadApicurioRegistry = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                'https://raw.githubusercontent.com/Apicurio/apicurio-registry/refs/heads/main/common/src/main/resources/META-INF/openapi.json'
            );
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }
            const data = await response.json();
            setContent(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('Error loading Apicurio Registry API:', err, errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseJsonModal = () => {
        setIsJsonModalOpen(false);
        setJsonContent('');
    };

    return (
        <>
            <Modal
                variant={ModalVariant.large}
                isOpen={isJsonModalOpen}
                onClose={handleCloseJsonModal}
                aria-labelledby="json-modal-title"
                aria-describedby="json-modal-body"
            >
                <ModalHeader title="Document JSON" labelId="json-modal-title" />
                <ModalBody id="json-modal-body">
                    <CodeEditor
                        isReadOnly
                        code={jsonContent}
                        language={Language.json}
                        height="600px"
                    />
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={handleCloseJsonModal}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

            <Page
                isContentFilled={true}
                masthead={
                <Masthead>
                    <MastheadMain>
                        <Title headingLevel="h1" size="lg">
                            Apicurio OpenAPI Editor - Test Application
                        </Title>
                    </MastheadMain>
                    <MastheadContent>
                        <Flex style={{ width: "100%" }}>
                            <FlexItem grow={{ default: "grow" }}>
                                <Flex>
                                    <FlexItem>
                                        <span className="sample-label">Load Sample:</span>
                                    </FlexItem>
                                    <FlexItem>
                                        <Button variant="secondary" onClick={handleLoadEmpty} size="sm">
                                            Empty API
                                        </Button>
                                    </FlexItem>
                                    <FlexItem>
                                        <Button variant="secondary" onClick={handleLoadPetStore} size="sm">
                                            Pet Store API
                                        </Button>
                                    </FlexItem>
                                    <FlexItem>
                                        <Button variant="secondary" onClick={handleLoad20Example} size="sm">
                                            2.0 Example API
                                        </Button>
                                    </FlexItem>
                                    <FlexItem>
                                        <Button
                                            variant="secondary"
                                            onClick={handleLoadApicurioRegistry}
                                            isDisabled={loading}
                                            size="sm"
                                        >
                                            {loading ? 'Loading...' : 'Apicurio Registry API'}
                                        </Button>
                                    </FlexItem>
                                </Flex>
                            </FlexItem>
                            <FlexItem>
                                <Flex>
                                    <FlexItem>
                                        <Switch
                                            id="theme-switch"
                                            label={isDarkTheme ? <MoonIcon /> : <SunIcon />}
                                            isChecked={isDarkTheme}
                                            onChange={handleToggleTheme}
                                            aria-label="Toggle dark theme"
                                        />
                                    </FlexItem>
                                    <FlexItem>
                                        <Button
                                            variant="primary"
                                            onClick={handleSave}
                                            isDisabled={!isDirty}
                                            size="sm"
                                        >
                                            Save
                                        </Button>
                                    </FlexItem>
                                </Flex>
                            </FlexItem>
                        </Flex>
                        <div>
                            <span className="sample-label">Current Selection:</span>
                            <span className="selection-path">{ currentSelection?.path.toString() }</span>
                            <span className="selection-property">{ currentSelection?.propertyName }</span>
                        </div>
                    </MastheadContent>
                </Masthead>
            }>
                <PageSection padding={{ default: 'noPadding' }} isFilled className="editor-page-section">
                    <OpenAPIEditor
                        initialContent={content}
                        onChange={handleChange}
                        onSelectionChange={setCurrentSelection}
                        features={{
                            allowImports: true,
                            allowCustomValidations: true,
                        }}
                    />
                </PageSection>
            </Page>
        </>
    );
}

export default App;

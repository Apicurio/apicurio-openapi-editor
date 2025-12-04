import { useState } from 'react';
import { OpenAPIEditor } from '../../src/components/editor/OpenAPIEditor';
import './App.css';

/**
 * Empty OpenAPI document
 */
const emptyAPI = {
    openapi: '3.0.3',
    info: {
        title: 'New API',
        version: '1.0.0',
        description: 'A new API specification',
    },
    paths: {},
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
    const [error, setError] = useState<string | null>(null);

    const handleChange = (newContent: object) => {
        console.log('Editor content changed:', newContent);
        setContent(newContent);
    };

    const handleLoadEmpty = () => {
        setError(null);
        setContent(emptyAPI);
    };

    const handleLoadPetStore = () => {
        setError(null);
        setContent(petStoreAPI);
    };

    const handleLoadApicurioRegistry = async () => {
        setLoading(true);
        setError(null);
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
            setError(`Failed to load Apicurio Registry API: ${errorMessage}`);
            console.error('Error loading Apicurio Registry API:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>Apicurio OpenAPI Editor - Test Application</h1>
                <p>This is a test application for manually testing the OpenAPI Editor component.</p>
                <div className="button-group">
                    <button onClick={handleLoadEmpty}>Empty API</button>
                    <button onClick={handleLoadPetStore}>Pet Store API</button>
                    <button onClick={handleLoadApicurioRegistry} disabled={loading}>
                        {loading ? 'Loading...' : 'Apicurio Registry API'}
                    </button>
                </div>
                {error && (
                    <div style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        {error}
                    </div>
                )}
            </header>

            <main className="app-main">
                <OpenAPIEditor
                    initialContent={content}
                    onChange={handleChange}
                    features={{
                        allowImports: true,
                        allowCustomValidations: true,
                    }}
                />
            </main>

            <footer className="app-footer">
                <p>Check the browser console for onChange events</p>
            </footer>
        </div>
    );
}

export default App;

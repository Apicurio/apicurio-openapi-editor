import React, { useState } from 'react';
import { OpenAPIEditor } from '../../src/components/editor/OpenAPIEditor';
import './App.css';

/**
 * Sample OpenAPI 3.0 document for testing
 */
const sampleOpenAPIDocument = {
    openapi: '3.0.3',
    info: {
        title: 'Sample Pet Store API',
        version: '1.0.0',
        description: 'A sample API for testing the OpenAPI Editor',
    },
    servers: [
        {
            url: 'https://api.example.com/v1',
            description: 'Production server',
        },
    ],
    paths: {
        '/pets': {
            get: {
                summary: 'List all pets',
                operationId: 'listPets',
                tags: ['pets'],
                responses: {
                    '200': {
                        description: 'An array of pets',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: '#/components/schemas/Pet',
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Pet: {
                type: 'object',
                required: ['id', 'name'],
                properties: {
                    id: {
                        type: 'integer',
                        format: 'int64',
                    },
                    name: {
                        type: 'string',
                    },
                    tag: {
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
    const [content, setContent] = useState<object>(sampleOpenAPIDocument);

    const handleChange = (newContent: object) => {
        console.log('Editor content changed:', newContent);
        setContent(newContent);
    };

    const handleLoadEmpty = () => {
        setContent({
            openapi: '3.0.3',
            info: {
                title: 'New API',
                version: '1.0.0',
            },
            paths: {},
        });
    };

    const handleLoadSample = () => {
        setContent(sampleOpenAPIDocument);
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>Apicurio OpenAPI Editor - Test Application</h1>
                <p>This is a test application for manually testing the OpenAPI Editor component.</p>
                <div className="button-group">
                    <button onClick={handleLoadSample}>Load Sample API</button>
                    <button onClick={handleLoadEmpty}>Load Empty API</button>
                </div>
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

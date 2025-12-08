# Apicurio OpenAPI Editor

A reusable React component for visual OpenAPI editing that can be embedded in React applications.

## Overview

The Apicurio OpenAPI Editor is a modern, React-based visual editor for OpenAPI specifications (version 3.0.x). It
provides an intuitive interface for creating, editing, and managing OpenAPI documents without requiring direct YAML
or JSON manipulation.


## Quickstart

To quickly try out the OpenAPI Editor with a test application:

```bash
# Clone the repository
git clone https://github.com/Apicurio/apicurio-openapi-editor.git
cd apicurio-openapi-editor

# Install dependencies
npm install

# Install test app dependencies
npm run test-app:install

# Start the test application
npm run test-app:dev
```

The test application will start on `http://localhost:3000` (or the next available port). This provides a
full-featured demo of the OpenAPI Editor with sample data and all features enabled.

## Usage

```tsx
import { OpenAPIEditor } from '@apicurio/openapi-editor';

function App() {
    const handleChange = (content: string) => {
        console.log('OpenAPI content changed:', content);
    };

    return (
        <OpenAPIEditor
            initialContent={yourOpenAPIDocument}
            onChange={handleChange}
        />
    );
}
```

## Project Status

This project is currently in early development. The initial MVP focuses on core editing features with plans to add
more advanced capabilities in future releases.

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Links

- [GitHub Repository](https://github.com/Apicurio/apicurio-openapi-editor)
- [Issue Tracker](https://github.com/Apicurio/apicurio-openapi-editor/issues)
- [Apicurio Project](https://www.apicur.io/)

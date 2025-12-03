# Apicurio OpenAPI Editor

A reusable React component for visual OpenAPI editing that can be embedded in React applications.

## Overview

The Apicurio OpenAPI Editor is a modern, React-based visual editor for OpenAPI specifications (version 3.0.x). It
provides an intuitive interface for creating, editing, and managing OpenAPI documents without requiring direct YAML
or JSON manipulation.

## Features

- **Visual Editing**: Edit OpenAPI specifications through an intuitive UI
- **OpenAPI 3.0.x Support**: Full support for OpenAPI 3.0.x specifications
- **Validation**: Real-time validation with inline error indicators
- **Undo/Redo**: Command-based architecture with full undo/redo support
- **PatternFly UI**: Built with PatternFly 6 components for enterprise-grade UX
- **TypeScript**: Fully typed for excellent developer experience
- **Embeddable**: Designed as a reusable React component

## Installation

```bash
npm install @apicurio/openapi-editor
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install react react-dom @patternfly/react-core @patternfly/react-table @patternfly/react-icons
```

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

## Development

### Prerequisites

- Node.js 18+ and npm
- React 18+ or 19+

### Setup

```bash
# Clone the repository
git clone https://github.com/Apicurio/apicurio-openapi-editor.git
cd apicurio-openapi-editor

# Install dependencies
npm install

# Start development server
npm run dev

# Build the library
npm run build

# Run linter
npm run lint
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

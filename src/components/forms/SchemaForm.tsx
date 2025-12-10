/**
 * Schema form for editing schema definitions
 */

import React from 'react';
import {
    Form,
    Title,
    Divider,
} from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';
import { useSelection } from '@hooks/useSelection';
import { OpenApi30Document } from '@apicurio/data-models';
import { PropertyInput } from '@components/common/PropertyInput';

/**
 * Schema form component for editing schema definitions
 */
export const SchemaForm: React.FC = () => {
    const { document } = useDocument();
    const { selectedPath } = useSelection();

    // Extract schema information early (before hooks)
    const schemaName = selectedPath ? selectedPath.replace('/components/schemas/', '') : '';
    const oaiDoc = document as OpenApi30Document;
    const components = oaiDoc?.getComponents();
    const schemas = components?.getSchemas();
    const schema = schemas?.[schemaName] as any;

    // Conditional checks after all hooks
    if (!document || !selectedPath) {
        return <div>No schema selected</div>;
    }

    if (!components || !schemas) {
        return <div>No schemas defined</div>;
    }

    if (!schema) {
        return <div>Schema not found: {schemaName}</div>;
    }

    return (
        <div>
            <Title headingLevel="h2" size="xl">
                Schema: {schemaName}
            </Title>
            <p style={{ marginBottom: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Edit schema definition and properties
            </p>

            <Divider style={{ marginBottom: '1rem' }} />

            {/* Schema metadata form */}
            <Form>
                <PropertyInput
                    model={schema}
                    propertyName="title"
                    label="Title"
                    placeholder="Human-readable title for the schema"
                />

                <PropertyInput
                    model={schema}
                    propertyName="type"
                    label="Type"
                    placeholder="object, string, integer, array, etc."
                />

                <PropertyInput
                    model={schema}
                    propertyName="description"
                    label="Description"
                    type="textarea"
                    placeholder="Detailed description of the schema"
                />
            </Form>

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are saved when you press Enter or when a field loses focus. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

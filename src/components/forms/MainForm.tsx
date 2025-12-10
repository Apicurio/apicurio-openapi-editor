/**
 * Main/Info form for editing API metadata
 */

import React from 'react';
import {
    Form,
    Title,
    Divider,
} from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';
import { OpenApi30Document } from '@apicurio/data-models';
import { PropertyInput } from '@components/common/PropertyInput';

/**
 * Main form component for editing API info
 */

export const MainForm: React.FC = () => {
    const { document } = useDocument();

    if (!document) {
        return <div>No document loaded</div>;
    }

    const oaiDoc = document as OpenApi30Document;
    const info = oaiDoc.getInfo();

    return (
        <div>
            <Title headingLevel="h2" size="xl">
                API Information
            </Title>
            <p style={{ marginBottom: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Edit the basic information about your API
            </p>

            <Divider style={{ marginBottom: '1rem' }} />

            <Form>
                <PropertyInput
                    model={info!}
                    propertyName="title"
                    label="Title"
                    isRequired
                />

                <PropertyInput
                    model={info!}
                    propertyName="version"
                    label="Version"
                    isRequired
                />

                <PropertyInput
                    model={info!}
                    propertyName="description"
                    label="Description"
                    type="textarea"
                />

                <PropertyInput
                    model={info!}
                    propertyName="termsOfService"
                    label="Terms of Service"
                    placeholder="URL to terms of service"
                />

                <Divider style={{ margin: '1.5rem 0' }} />

                <Title headingLevel="h3" size="lg" style={{ marginBottom: '0.5rem' }}>
                    Contact Information
                </Title>

                <PropertyInput
                    model={info!.getContact()}
                    propertyName="name"
                    label="Contact Name"
                    placeholder="API contact person or team"
                />

                <PropertyInput
                    model={info!.getContact()}
                    propertyName="url"
                    label="Contact URL"
                    placeholder="URL for contact information"
                />

                <PropertyInput
                    model={info!.getContact()}
                    propertyName="email"
                    label="Contact Email"
                    placeholder="email@example.com"
                />

                <Divider style={{ margin: '1.5rem 0' }} />

                <Title headingLevel="h3" size="lg" style={{ marginBottom: '0.5rem' }}>
                    License
                </Title>

                <PropertyInput
                    model={info!.getLicense()}
                    propertyName="name"
                    label="License Name"
                    placeholder="e.g., Apache 2.0, MIT"
                />

                <PropertyInput
                    model={info!.getLicense()}
                    propertyName="url"
                    label="License URL"
                    placeholder="URL to license text"
                />
            </Form>

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are saved when you press Enter or when a field loses focus. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

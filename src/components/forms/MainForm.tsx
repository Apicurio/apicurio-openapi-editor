/**
 * Main/Info form for editing API metadata
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    Form,
    FormGroup,
    TextInput,
    TextArea,
    Title,
    Divider,
} from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';
import { useCommand } from '@hooks/useCommand';
import { ChangePropertyCommand, OpenApi30Document } from '@apicurio/data-models';

/**
 * Main form component for editing API info
 */

export const MainForm: React.FC = () => {
    const { document } = useDocument();
    const { executeCommand } = useCommand();

    if (!document) {
        return <div>No document loaded</div>;
    }

    const oaiDoc = document as OpenApi30Document;
    const info = oaiDoc.getInfo();
    const openapi = oaiDoc.getOpenapi() || 'N/A';

    // Local state for field values
    const [title, setTitle] = useState(info?.getTitle() || '');
    const [apiVersion, setApiVersion] = useState(info?.getVersion() || '');
    const [description, setDescription] = useState(info?.getDescription() || '');

    // Refs to track initial values
    const initialTitleRef = useRef(info?.getTitle() || '');
    const initialVersionRef = useRef(info?.getVersion() || '');
    const initialDescriptionRef = useRef(info?.getDescription() || '');

    // Update local state when document changes externally (e.g., undo/redo or initial load)
    useEffect(() => {
        if (!info) return;

        const newTitle = info.getTitle() || '';
        const newVersion = info.getVersion() || '';
        const newDescription = info.getDescription() || '';

        setTitle(newTitle);
        setApiVersion(newVersion);
        setDescription(newDescription);
        initialTitleRef.current = newTitle;
        initialVersionRef.current = newVersion;
        initialDescriptionRef.current = newDescription;
    }, [info]);

    // Field commit handlers - update on blur or Enter
    const handleTitleCommit = () => {
        if (info && title !== initialTitleRef.current) {
            const command = new ChangePropertyCommand(info, 'title', title);
            executeCommand(command, `Change API title to "${title}"`);
            initialTitleRef.current = title;
        }
    };

    const handleVersionCommit = () => {
        if (info && apiVersion !== initialVersionRef.current) {
            const command = new ChangePropertyCommand(info, 'version', apiVersion);
            executeCommand(command, `Change API version to "${apiVersion}"`);
            initialVersionRef.current = apiVersion;
        }
    };

    const handleDescriptionCommit = () => {
        if (info && description !== initialDescriptionRef.current) {
            const command = new ChangePropertyCommand(info, 'description', description);
            executeCommand(command, 'Update API description');
            initialDescriptionRef.current = description;
        }
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent, commitFn: () => void) => {
        if (e.key === 'Enter' && !(e.target as HTMLElement).matches('textarea')) {
            e.preventDefault(); // Prevent form submission
            commitFn();
        }
    };

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
                <FormGroup label="OpenAPI Version" fieldId="openapi-version">
                    <TextInput
                        id="openapi-version"
                        value={openapi}
                        readOnly
                        aria-label="OpenAPI version"
                    />
                </FormGroup>

                <FormGroup label="Title" fieldId="api-title" isRequired>
                    <TextInput
                        id="api-title"
                        value={title}
                        onChange={(_event, value) => setTitle(value)}
                        onBlur={handleTitleCommit}
                        onKeyDown={(e) => handleKeyDown(e, handleTitleCommit)}
                        aria-label="API title"
                    />
                </FormGroup>

                <FormGroup label="Version" fieldId="api-version" isRequired>
                    <TextInput
                        id="api-version"
                        value={apiVersion}
                        onChange={(_event, value) => setApiVersion(value)}
                        onBlur={handleVersionCommit}
                        onKeyDown={(e) => handleKeyDown(e, handleVersionCommit)}
                        aria-label="API version"
                    />
                </FormGroup>

                <FormGroup label="Description" fieldId="api-description">
                    <TextArea
                        id="api-description"
                        value={description}
                        onChange={(_event, value) => setDescription(value)}
                        onBlur={handleDescriptionCommit}
                        aria-label="API description"
                        resizeOrientation="vertical"
                    />
                </FormGroup>
            </Form>

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are saved when you press Enter or when a field loses focus. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

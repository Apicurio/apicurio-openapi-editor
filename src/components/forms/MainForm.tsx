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
import { useDocumentStore } from '@stores/documentStore';
import { ChangePropertyCommand, OpenApi30Document } from '@apicurio/data-models';

/**
 * Main form component for editing API info
 */
const DEBOUNCE_DELAY = 500; // milliseconds

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

    // Refs to track current state values (to avoid stale closures in subscription)
    const titleRef = useRef(title);
    const apiVersionRef = useRef(apiVersion);
    const descriptionRef = useRef(description);

    // Update refs whenever state changes
    useEffect(() => {
        titleRef.current = title;
        apiVersionRef.current = apiVersion;
        descriptionRef.current = description;
    }, [title, apiVersion, description]);

    // Refs to track previous committed values
    const prevTitleRef = useRef(info?.getTitle() || '');
    const prevVersionRef = useRef(info?.getVersion() || '');
    const prevDescriptionRef = useRef(info?.getDescription() || '');

    // Debounce timers
    const titleTimerRef = useRef<number | null>(null);
    const versionTimerRef = useRef<number | null>(null);
    const descriptionTimerRef = useRef<number | null>(null);

    // Sync local state with document when document changes externally (e.g., undo/redo)
    // Use a manual subscription to avoid re-rendering the component on every version change
    useEffect(() => {
        const unsubscribe = useDocumentStore.subscribe(() => {
            const currentTitle = info?.getTitle() || '';
            const currentVersion = info?.getVersion() || '';
            const currentDescription = info?.getDescription() || '';

            // Update local state if document value differs from current state
            // Use refs to get current state values (avoid stale closure)
            if (currentTitle !== titleRef.current) {
                setTitle(currentTitle);
                prevTitleRef.current = currentTitle;
            }
            if (currentVersion !== apiVersionRef.current) {
                setApiVersion(currentVersion);
                prevVersionRef.current = currentVersion;
            }
            if (currentDescription !== descriptionRef.current) {
                setDescription(currentDescription);
                prevDescriptionRef.current = currentDescription;
            }
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only set up subscription once

    /**
     * Handle change to title field (debounced)
     */
    const handleTitleChange = (value: string) => {
        setTitle(value);

        // Clear existing timer
        if (titleTimerRef.current) {
            clearTimeout(titleTimerRef.current);
        }

        // Set new timer to execute command after delay
        titleTimerRef.current = setTimeout(() => {
            if (info && value !== prevTitleRef.current) {
                const command = new ChangePropertyCommand(info, 'title', value);
                executeCommand(command, `Change API title to "${value}"`);
                prevTitleRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    /**
     * Handle change to version field (debounced)
     */
    const handleVersionChange = (value: string) => {
        setApiVersion(value);

        // Clear existing timer
        if (versionTimerRef.current) {
            clearTimeout(versionTimerRef.current);
        }

        // Set new timer to execute command after delay
        versionTimerRef.current = setTimeout(() => {
            if (info && value !== prevVersionRef.current) {
                const command = new ChangePropertyCommand(info, 'version', value);
                executeCommand(command, `Change API version to "${value}"`);
                prevVersionRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    /**
     * Handle change to description field (debounced)
     */
    const handleDescriptionChange = (value: string) => {
        setDescription(value);

        // Clear existing timer
        if (descriptionTimerRef.current) {
            clearTimeout(descriptionTimerRef.current);
        }

        // Set new timer to execute command after delay
        descriptionTimerRef.current = setTimeout(() => {
            if (info && value !== prevDescriptionRef.current) {
                const command = new ChangePropertyCommand(info, 'description', value);
                executeCommand(command, `Update API description`);
                prevDescriptionRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (titleTimerRef.current) clearTimeout(titleTimerRef.current);
            if (versionTimerRef.current) clearTimeout(versionTimerRef.current);
            if (descriptionTimerRef.current) clearTimeout(descriptionTimerRef.current);
        };
    }, []);

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
                        onChange={(_event, value) => handleTitleChange(value)}
                        aria-label="API title"
                    />
                </FormGroup>

                <FormGroup label="Version" fieldId="api-version" isRequired>
                    <TextInput
                        id="api-version"
                        value={apiVersion}
                        onChange={(_event, value) => handleVersionChange(value)}
                        aria-label="API version"
                    />
                </FormGroup>

                <FormGroup label="Description" fieldId="api-description">
                    <TextArea
                        id="api-description"
                        value={description}
                        onChange={(_event, value) => handleDescriptionChange(value)}
                        aria-label="API description"
                        resizeOrientation="vertical"
                    />
                </FormGroup>
            </Form>

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are automatically saved. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

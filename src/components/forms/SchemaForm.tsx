/**
 * Schema form for editing schema definitions
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
import { useSelection } from '@hooks/useSelection';
import { OpenApi30Document } from '@apicurio/data-models';
import { ChangePropertyCommand } from '@commands/ChangePropertyCommand';

/**
 * Schema form component for editing schema definitions
 */
export const SchemaForm: React.FC = () => {
    const { document } = useDocument();
    const { executeCommand } = useCommand();
    const { selectedPath } = useSelection();

    // Extract schema information early (before hooks)
    const schemaName = selectedPath ? selectedPath.replace('/components/schemas/', '') : '';
    const oaiDoc = document as OpenApi30Document;
    const components = oaiDoc?.getComponents();
    const schemas = components?.getSchemas();
    const schema = schemas?.[schemaName] as any;

    // Local state for schema fields
    const [title, setTitle] = useState(schema?.getTitle() || '');
    const [description, setDescription] = useState(schema?.getDescription() || '');
    const [type, setType] = useState(schema?.getType() || '');

    // Refs to track initial values
    const initialTitleRef = useRef(schema?.getTitle() || '');
    const initialDescriptionRef = useRef(schema?.getDescription() || '');
    const initialTypeRef = useRef(schema?.getType() || '');

    // Update local state when schema selection changes
    useEffect(() => {
        if (!schema) return;

        const newTitle = schema.getTitle() || '';
        const newDescription = schema.getDescription() || '';
        const newType = schema.getType() || '';

        setTitle(newTitle);
        setDescription(newDescription);
        setType(newType);
        initialTitleRef.current = newTitle;
        initialDescriptionRef.current = newDescription;
        initialTypeRef.current = newType;
    }, [schemaName, schema]);

    // Field commit handlers - update on blur or Enter
    const handleTitleCommit = () => {
        if (schema && title !== initialTitleRef.current) {
            const command = new ChangePropertyCommand(schema, 'title', title);
            executeCommand(command, `Change schema title to "${title}"`);
            initialTitleRef.current = title;
        }
    };

    const handleDescriptionCommit = () => {
        if (schema && description !== initialDescriptionRef.current) {
            const command = new ChangePropertyCommand(schema, 'description', description);
            executeCommand(command, 'Update schema description');
            initialDescriptionRef.current = description;
        }
    };

    const handleTypeCommit = () => {
        if (schema && type !== initialTypeRef.current) {
            const command = new ChangePropertyCommand(schema, 'type', type);
            executeCommand(command, `Change schema type to "${type}"`);
            initialTypeRef.current = type;
        }
    };

    // Handle Enter key press
    const handleKeyDown = (e: React.KeyboardEvent, commitFn: () => void) => {
        if (e.key === 'Enter' && !(e.target as HTMLElement).matches('textarea')) {
            e.preventDefault(); // Prevent form submission
            commitFn();
        }
    };

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
                <FormGroup label="Title" fieldId="schema-title">
                    <TextInput
                        id="schema-title"
                        value={title}
                        onChange={(_event, value) => setTitle(value)}
                        onBlur={handleTitleCommit}
                        onKeyDown={(e) => handleKeyDown(e, handleTitleCommit)}
                        aria-label="Schema title"
                        placeholder="Human-readable title for the schema"
                    />
                </FormGroup>

                <FormGroup label="Type" fieldId="schema-type">
                    <TextInput
                        id="schema-type"
                        value={type}
                        onChange={(_event, value) => setType(value)}
                        onBlur={handleTypeCommit}
                        onKeyDown={(e) => handleKeyDown(e, handleTypeCommit)}
                        aria-label="Schema type"
                        placeholder="object, string, integer, array, etc."
                    />
                </FormGroup>

                <FormGroup label="Description" fieldId="schema-description">
                    <TextArea
                        id="schema-description"
                        value={description}
                        onChange={(_event, value) => setDescription(value)}
                        onBlur={handleDescriptionCommit}
                        aria-label="Schema description"
                        placeholder="Detailed description of the schema"
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

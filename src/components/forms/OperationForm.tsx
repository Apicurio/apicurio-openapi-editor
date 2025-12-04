/**
 * Operation form for editing operation details
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    Form,
    FormGroup,
    TextInput,
    TextArea,
    Title,
    Divider,
    Badge,
} from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';
import { useCommand } from '@hooks/useCommand';
import { useSelection } from '@hooks/useSelection';
import { useDocumentStore } from '@stores/documentStore';
import { ChangePropertyCommand, OpenApi30Document, OpenApi30Operation } from '@apicurio/data-models';

/**
 * Operation form component for editing operation details
 */
const DEBOUNCE_DELAY = 500; // milliseconds

export const OperationForm: React.FC = () => {
    const { document } = useDocument();
    const { executeCommand } = useCommand();
    const { selectedPath } = useSelection();

    // Parse the selection path early (before hooks)
    const pathParts = selectedPath?.split('/') || [];
    const pathName = pathParts[2] || '';
    const method = pathParts[3] || '';

    const oaiDoc = document as OpenApi30Document;
    const paths = oaiDoc?.getPaths();
    const pathItem = paths?.getItem(pathName);

    // Get the operation using the method name
    const getter = method ? `get${method.charAt(0).toUpperCase()}${method.slice(1).toLowerCase()}` : '';
    const operation = pathItem && getter ? (pathItem as any)[getter]?.() as OpenApi30Operation : null;

    // Local state for field values - must be called unconditionally
    const [summary, setSummary] = useState(operation?.getSummary() || '');
    const [description, setDescription] = useState(operation?.getDescription() || '');
    const [operationId, setOperationId] = useState(operation?.getOperationId() || '');

    // Refs to track current state values
    const summaryRef = useRef(summary);
    const descriptionRef = useRef(description);
    const operationIdRef = useRef(operationId);

    // Update refs whenever state changes
    useEffect(() => {
        summaryRef.current = summary;
        descriptionRef.current = description;
        operationIdRef.current = operationId;
    }, [summary, description, operationId]);

    // Refs to track previous committed values
    const prevSummaryRef = useRef(operation?.getSummary() || '');
    const prevDescriptionRef = useRef(operation?.getDescription() || '');
    const prevOperationIdRef = useRef(operation?.getOperationId() || '');

    // Debounce timers
    const summaryTimerRef = useRef<number | null>(null);
    const descriptionTimerRef = useRef<number | null>(null);
    const operationIdTimerRef = useRef<number | null>(null);

    // Sync local state with document when document changes externally
    useEffect(() => {
        if (!operation) return;

        const unsubscribe = useDocumentStore.subscribe(() => {
            const currentSummary = operation?.getSummary() || '';
            const currentDescription = operation?.getDescription() || '';
            const currentOperationId = operation?.getOperationId() || '';

            if (currentSummary !== summaryRef.current) {
                setSummary(currentSummary);
                prevSummaryRef.current = currentSummary;
            }
            if (currentDescription !== descriptionRef.current) {
                setDescription(currentDescription);
                prevDescriptionRef.current = currentDescription;
            }
            if (currentOperationId !== operationIdRef.current) {
                setOperationId(currentOperationId);
                prevOperationIdRef.current = currentOperationId;
            }
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [operation]);

    // Update local state when operation selection changes
    useEffect(() => {
        if (!operation) return;

        setSummary(operation.getSummary() || '');
        setDescription(operation.getDescription() || '');
        setOperationId(operation.getOperationId() || '');
        prevSummaryRef.current = operation.getSummary() || '';
        prevDescriptionRef.current = operation.getDescription() || '';
        prevOperationIdRef.current = operation.getOperationId() || '';
    }, [pathName, method, operation]);

    /**
     * Handle change to summary field (debounced)
     */
    const handleSummaryChange = (value: string) => {
        setSummary(value);

        if (summaryTimerRef.current) {
            clearTimeout(summaryTimerRef.current);
        }

        summaryTimerRef.current = setTimeout(() => {
            if (value !== prevSummaryRef.current) {
                const command = new ChangePropertyCommand(operation, 'summary', value);
                executeCommand(command, `Change operation summary to "${value}"`);
                prevSummaryRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    /**
     * Handle change to description field (debounced)
     */
    const handleDescriptionChange = (value: string) => {
        setDescription(value);

        if (descriptionTimerRef.current) {
            clearTimeout(descriptionTimerRef.current);
        }

        descriptionTimerRef.current = setTimeout(() => {
            if (value !== prevDescriptionRef.current) {
                const command = new ChangePropertyCommand(operation, 'description', value);
                executeCommand(command, 'Update operation description');
                prevDescriptionRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    /**
     * Handle change to operationId field (debounced)
     */
    const handleOperationIdChange = (value: string) => {
        setOperationId(value);

        if (operationIdTimerRef.current) {
            clearTimeout(operationIdTimerRef.current);
        }

        operationIdTimerRef.current = setTimeout(() => {
            if (value !== prevOperationIdRef.current) {
                const command = new ChangePropertyCommand(operation, 'operationId', value);
                executeCommand(command, `Change operationId to "${value}"`);
                prevOperationIdRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (summaryTimerRef.current) clearTimeout(summaryTimerRef.current);
            if (descriptionTimerRef.current) clearTimeout(descriptionTimerRef.current);
            if (operationIdTimerRef.current) clearTimeout(operationIdTimerRef.current);
        };
    }, []);

    // Conditional checks after all hooks
    if (!document || !selectedPath) {
        return <div>No operation selected</div>;
    }

    if (pathParts.length < 4 || pathParts[1] !== 'paths') {
        return <div>Invalid operation path</div>;
    }

    if (!paths) {
        return <div>No paths defined</div>;
    }

    if (!pathItem) {
        return <div>Path not found: {pathName}</div>;
    }

    if (!operation) {
        return <div>Operation not found: {method.toUpperCase()}</div>;
    }

    return (
        <div>
            <Title headingLevel="h2" size="xl">
                <Badge isRead>{method.toUpperCase()}</Badge>
                <span style={{ marginLeft: '0.5rem' }}>{pathName}</span>
            </Title>
            <p style={{ marginBottom: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Edit operation details
            </p>

            <Divider style={{ marginBottom: '1rem' }} />

            <Form>
                <FormGroup label="Summary" fieldId="operation-summary">
                    <TextInput
                        id="operation-summary"
                        value={summary}
                        onChange={(_event, value) => handleSummaryChange(value)}
                        aria-label="Operation summary"
                        placeholder="Short summary of the operation"
                    />
                </FormGroup>

                <FormGroup label="Operation ID" fieldId="operation-id">
                    <TextInput
                        id="operation-id"
                        value={operationId}
                        onChange={(_event, value) => handleOperationIdChange(value)}
                        aria-label="Operation ID"
                        placeholder="Unique operation identifier"
                    />
                </FormGroup>

                <FormGroup label="Description" fieldId="operation-description">
                    <TextArea
                        id="operation-description"
                        value={description}
                        onChange={(_event, value) => handleDescriptionChange(value)}
                        aria-label="Operation description"
                        placeholder="Detailed description of the operation"
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

/**
 * Path form for editing path metadata and operations
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    Form,
    FormGroup,
    TextInput,
    TextArea,
    Title,
    Divider,
    Label,
    EmptyState,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateActions,
    Button,
} from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';
import { useCommand } from '@hooks/useCommand';
import { useDocumentStore } from '@stores/documentStore';
import { ChangePropertyCommand, OpenApi30Document, OpenApi30PathItem, OpenApi30Operation } from '@apicurio/data-models';
import { useSelection } from '@hooks/useSelection';

/**
 * Path form component for editing path metadata and operations
 */
const DEBOUNCE_DELAY = 500; // milliseconds

// HTTP methods in display order with their label colors
const HTTP_METHODS = [
    { method: 'get', label: 'GET', color: 'blue' as const },
    { method: 'put', label: 'PUT', color: 'orange' as const },
    { method: 'post', label: 'POST', color: 'green' as const },
    { method: 'delete', label: 'DELETE', color: 'red' as const },
    { method: 'options', label: 'OPTIONS', color: 'purple' as const },
    { method: 'head', label: 'HEAD', color: 'teal' as const },
    { method: 'patch', label: 'PATCH', color: 'yellow' as const },
    { method: 'trace', label: 'TRACE', color: 'grey' as const },
];

export const PathForm: React.FC = () => {
    const { document } = useDocument();
    const { executeCommand } = useCommand();
    const { selectedPath } = useSelection();

    // Extract path information early (before hooks)
    const pathName = selectedPath ? selectedPath.replace('/paths/', '') : '';
    const oaiDoc = document as OpenApi30Document;
    const paths = oaiDoc?.getPaths();
    const pathItem = paths?.getItem(pathName) as OpenApi30PathItem;

    // Track selected operation tab
    const [selectedOperation, setSelectedOperation] = useState<string>('get');

    // Get the current operation
    const selectedOpGetter = `get${selectedOperation.charAt(0).toUpperCase()}${selectedOperation.slice(1)}`;
    const operation = pathItem ? (pathItem as any)[selectedOpGetter]?.() as OpenApi30Operation | undefined : undefined;

    // Local state for path fields
    const [summary, setSummary] = useState(pathItem?.getSummary() || '');
    const [description, setDescription] = useState(pathItem?.getDescription() || '');

    // Local state for operation fields
    const [opSummary, setOpSummary] = useState(operation?.getSummary() || '');
    const [opDescription, setOpDescription] = useState(operation?.getDescription() || '');
    const [opId, setOpId] = useState(operation?.getOperationId() || '');

    // Refs for path fields
    const summaryRef = useRef(summary);
    const descriptionRef = useRef(description);
    const prevSummaryRef = useRef(pathItem?.getSummary() || '');
    const prevDescriptionRef = useRef(pathItem?.getDescription() || '');
    const summaryTimerRef = useRef<number | null>(null);
    const descriptionTimerRef = useRef<number | null>(null);

    // Refs for operation fields
    const opSummaryRef = useRef(opSummary);
    const opDescriptionRef = useRef(opDescription);
    const opIdRef = useRef(opId);
    const prevOpSummaryRef = useRef(operation?.getSummary() || '');
    const prevOpDescriptionRef = useRef(operation?.getDescription() || '');
    const prevOpIdRef = useRef(operation?.getOperationId() || '');
    const opSummaryTimerRef = useRef<number | null>(null);
    const opDescriptionTimerRef = useRef<number | null>(null);
    const opIdTimerRef = useRef<number | null>(null);

    // Update refs
    useEffect(() => {
        summaryRef.current = summary;
        descriptionRef.current = description;
    }, [summary, description]);

    useEffect(() => {
        opSummaryRef.current = opSummary;
        opDescriptionRef.current = opDescription;
        opIdRef.current = opId;
    }, [opSummary, opDescription, opId]);

    // Sync with document changes (undo/redo)
    useEffect(() => {
        if (!pathItem) return;

        const unsubscribe = useDocumentStore.subscribe(() => {
            const currentSummary = pathItem?.getSummary() || '';
            const currentDescription = pathItem?.getDescription() || '';

            if (currentSummary !== summaryRef.current) {
                setSummary(currentSummary);
                prevSummaryRef.current = currentSummary;
            }
            if (currentDescription !== descriptionRef.current) {
                setDescription(currentDescription);
                prevDescriptionRef.current = currentDescription;
            }

            // Sync operation fields if operation exists
            if (operation) {
                const currentOpSummary = operation.getSummary() || '';
                const currentOpDescription = operation.getDescription() || '';
                const currentOpId = operation.getOperationId() || '';

                if (currentOpSummary !== opSummaryRef.current) {
                    setOpSummary(currentOpSummary);
                    prevOpSummaryRef.current = currentOpSummary;
                }
                if (currentOpDescription !== opDescriptionRef.current) {
                    setOpDescription(currentOpDescription);
                    prevOpDescriptionRef.current = currentOpDescription;
                }
                if (currentOpId !== opIdRef.current) {
                    setOpId(currentOpId);
                    prevOpIdRef.current = currentOpId;
                }
            }
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathItem, operation]);

    // Update local state when path selection changes
    useEffect(() => {
        if (!pathItem) return;

        setSummary(pathItem.getSummary() || '');
        setDescription(pathItem.getDescription() || '');
        prevSummaryRef.current = pathItem.getSummary() || '';
        prevDescriptionRef.current = pathItem.getDescription() || '';
    }, [pathName, pathItem]);

    // Update operation state when selected operation changes
    useEffect(() => {
        if (operation) {
            setOpSummary(operation.getSummary() || '');
            setOpDescription(operation.getDescription() || '');
            setOpId(operation.getOperationId() || '');
            prevOpSummaryRef.current = operation.getSummary() || '';
            prevOpDescriptionRef.current = operation.getDescription() || '';
            prevOpIdRef.current = operation.getOperationId() || '';
        } else {
            setOpSummary('');
            setOpDescription('');
            setOpId('');
            prevOpSummaryRef.current = '';
            prevOpDescriptionRef.current = '';
            prevOpIdRef.current = '';
        }
    }, [selectedOperation, operation]);

    // Path field handlers
    const handleSummaryChange = (value: string) => {
        setSummary(value);
        if (summaryTimerRef.current) clearTimeout(summaryTimerRef.current);
        summaryTimerRef.current = setTimeout(() => {
            if (pathItem && value !== prevSummaryRef.current) {
                const command = new ChangePropertyCommand(pathItem, 'summary', value);
                executeCommand(command, `Change path summary to "${value}"`);
                prevSummaryRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        if (descriptionTimerRef.current) clearTimeout(descriptionTimerRef.current);
        descriptionTimerRef.current = setTimeout(() => {
            if (pathItem && value !== prevDescriptionRef.current) {
                const command = new ChangePropertyCommand(pathItem, 'description', value);
                executeCommand(command, 'Update path description');
                prevDescriptionRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    // Operation field handlers
    const handleOpSummaryChange = (value: string) => {
        setOpSummary(value);
        if (opSummaryTimerRef.current) clearTimeout(opSummaryTimerRef.current);
        opSummaryTimerRef.current = setTimeout(() => {
            if (operation && value !== prevOpSummaryRef.current) {
                const command = new ChangePropertyCommand(operation, 'summary', value);
                executeCommand(command, `Change ${selectedOperation.toUpperCase()} operation summary`);
                prevOpSummaryRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    const handleOpDescriptionChange = (value: string) => {
        setOpDescription(value);
        if (opDescriptionTimerRef.current) clearTimeout(opDescriptionTimerRef.current);
        opDescriptionTimerRef.current = setTimeout(() => {
            if (operation && value !== prevOpDescriptionRef.current) {
                const command = new ChangePropertyCommand(operation, 'description', value);
                executeCommand(command, `Update ${selectedOperation.toUpperCase()} operation description`);
                prevOpDescriptionRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    const handleOpIdChange = (value: string) => {
        setOpId(value);
        if (opIdTimerRef.current) clearTimeout(opIdTimerRef.current);
        opIdTimerRef.current = setTimeout(() => {
            if (operation && value !== prevOpIdRef.current) {
                const command = new ChangePropertyCommand(operation, 'operationId', value);
                executeCommand(command, `Change operationId to "${value}"`);
                prevOpIdRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    // Cleanup timers
    useEffect(() => {
        return () => {
            if (summaryTimerRef.current) clearTimeout(summaryTimerRef.current);
            if (descriptionTimerRef.current) clearTimeout(descriptionTimerRef.current);
            if (opSummaryTimerRef.current) clearTimeout(opSummaryTimerRef.current);
            if (opDescriptionTimerRef.current) clearTimeout(opDescriptionTimerRef.current);
            if (opIdTimerRef.current) clearTimeout(opIdTimerRef.current);
        };
    }, []);

    // Conditional checks after all hooks
    if (!document || !selectedPath) {
        return <div>No path selected</div>;
    }

    if (!paths) {
        return <div>No paths defined</div>;
    }

    if (!pathItem) {
        return <div>Path not found: {pathName}</div>;
    }

    return (
        <div>
            <Title headingLevel="h2" size="xl">
                Path: {pathName}
            </Title>
            <p style={{ marginBottom: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Edit path metadata and operations
            </p>

            <Divider style={{ marginBottom: '1rem' }} />

            {/* Path metadata form */}
            <Form>
                <FormGroup label="Summary" fieldId="path-summary">
                    <TextInput
                        id="path-summary"
                        value={summary}
                        onChange={(_event, value) => handleSummaryChange(value)}
                        aria-label="Path summary"
                        placeholder="Short summary of the path"
                    />
                </FormGroup>

                <FormGroup label="Description" fieldId="path-description">
                    <TextArea
                        id="path-description"
                        value={description}
                        onChange={(_event, value) => handleDescriptionChange(value)}
                        aria-label="Path description"
                        placeholder="Detailed description of the path"
                        resizeOrientation="vertical"
                    />
                </FormGroup>
            </Form>

            <Divider style={{ margin: '1.5rem 0' }} />

            {/* Operation tabs */}
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                Operations
            </Title>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {HTTP_METHODS.map(({ method, label, color }) => {
                    const getter = `get${method.charAt(0).toUpperCase()}${method.slice(1)}`;
                    const exists = !!(pathItem as any)[getter]?.();
                    const isSelected = selectedOperation === method;

                    return (
                        <Label
                            key={method}
                            color={exists ? color : 'grey'}
                            isCompact
                            onClick={() => setSelectedOperation(method)}
                            style={{
                                cursor: 'pointer',
                                fontWeight: isSelected ? 600 : 400,
                                border: isSelected ? '2px solid var(--pf-v6-global--primary-color--100)' : '2px solid transparent',
                                opacity: exists ? 1 : 0.5,
                            }}
                        >
                            {label}
                        </Label>
                    );
                })}
            </div>

            {/* Operation details or empty state */}
            {operation ? (
                <Form>
                    <FormGroup label="Summary" fieldId="operation-summary">
                        <TextInput
                            id="operation-summary"
                            value={opSummary}
                            onChange={(_event, value) => handleOpSummaryChange(value)}
                            aria-label="Operation summary"
                            placeholder="Short summary of the operation"
                        />
                    </FormGroup>

                    <FormGroup label="Operation ID" fieldId="operation-id">
                        <TextInput
                            id="operation-id"
                            value={opId}
                            onChange={(_event, value) => handleOpIdChange(value)}
                            aria-label="Operation ID"
                            placeholder="Unique operation identifier"
                        />
                    </FormGroup>

                    <FormGroup label="Description" fieldId="operation-description">
                        <TextArea
                            id="operation-description"
                            value={opDescription}
                            onChange={(_event, value) => handleOpDescriptionChange(value)}
                            aria-label="Operation description"
                            placeholder="Detailed description of the operation"
                            resizeOrientation="vertical"
                        />
                    </FormGroup>
                </Form>
            ) : (
                <EmptyState>
                    <EmptyStateBody>
                        No {selectedOperation.toUpperCase()} operation defined
                    </EmptyStateBody>
                    <EmptyStateFooter>
                        <EmptyStateActions>
                            <Button variant="primary">
                                Create {selectedOperation.toUpperCase()} operation
                            </Button>
                        </EmptyStateActions>
                    </EmptyStateFooter>
                </EmptyState>
            )}

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are automatically saved. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

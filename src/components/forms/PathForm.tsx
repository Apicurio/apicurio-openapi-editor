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
    List,
    ListItem,
    Badge,
    Button,
} from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';
import { useCommand } from '@hooks/useCommand';
import { useSelection } from '@hooks/useSelection';
import { useDocumentStore } from '@stores/documentStore';
import { ChangePropertyCommand, OpenApi30Document, OpenApi30PathItem } from '@apicurio/data-models';

/**
 * Path form component for editing path metadata
 */
const DEBOUNCE_DELAY = 500; // milliseconds

export const PathForm: React.FC = () => {
    const { document } = useDocument();
    const { executeCommand } = useCommand();
    const { selectedPath, selectByPath } = useSelection();

    if (!document || !selectedPath) {
        return <div>No path selected</div>;
    }

    // Extract the path name from the selection path (e.g., "/paths//pets" -> "/pets")
    const pathName = selectedPath.replace('/paths/', '');

    const oaiDoc = document as OpenApi30Document;
    const paths = oaiDoc.getPaths();

    if (!paths) {
        return <div>No paths defined</div>;
    }

    const pathItem = paths.getItem(pathName) as OpenApi30PathItem;

    if (!pathItem) {
        return <div>Path not found: {pathName}</div>;
    }

    // Local state for field values
    const [summary, setSummary] = useState(pathItem.getSummary() || '');
    const [description, setDescription] = useState(pathItem.getDescription() || '');

    // Refs to track current state values (to avoid stale closures in subscription)
    const summaryRef = useRef(summary);
    const descriptionRef = useRef(description);

    // Update refs whenever state changes
    useEffect(() => {
        summaryRef.current = summary;
        descriptionRef.current = description;
    }, [summary, description]);

    // Refs to track previous committed values
    const prevSummaryRef = useRef(pathItem.getSummary() || '');
    const prevDescriptionRef = useRef(pathItem.getDescription() || '');

    // Debounce timers
    const summaryTimerRef = useRef<number | null>(null);
    const descriptionTimerRef = useRef<number | null>(null);

    // Sync local state with document when document changes externally (e.g., undo/redo)
    // Use a manual subscription to avoid re-rendering the component on every version change
    useEffect(() => {
        const unsubscribe = useDocumentStore.subscribe(() => {
            const currentSummary = pathItem.getSummary() || '';
            const currentDescription = pathItem.getDescription() || '';

            // Update local state if document value differs from current state
            // Use refs to get current state values (avoid stale closure)
            if (currentSummary !== summaryRef.current) {
                setSummary(currentSummary);
                prevSummaryRef.current = currentSummary;
            }
            if (currentDescription !== descriptionRef.current) {
                setDescription(currentDescription);
                prevDescriptionRef.current = currentDescription;
            }
        });

        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only set up subscription once

    // Update local state when path selection changes
    useEffect(() => {
        setSummary(pathItem.getSummary() || '');
        setDescription(pathItem.getDescription() || '');
        prevSummaryRef.current = pathItem.getSummary() || '';
        prevDescriptionRef.current = pathItem.getDescription() || '';
    }, [pathName, pathItem]);

    /**
     * Handle change to summary field (debounced)
     */
    const handleSummaryChange = (value: string) => {
        setSummary(value);

        // Clear existing timer
        if (summaryTimerRef.current) {
            clearTimeout(summaryTimerRef.current);
        }

        // Set new timer to execute command after delay
        summaryTimerRef.current = setTimeout(() => {
            if (value !== prevSummaryRef.current) {
                const command = new ChangePropertyCommand(pathItem, 'summary', value);
                executeCommand(command, `Change path summary to "${value}"`);
                prevSummaryRef.current = value;
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
            if (value !== prevDescriptionRef.current) {
                const command = new ChangePropertyCommand(pathItem, 'description', value);
                executeCommand(command, `Update path description`);
                prevDescriptionRef.current = value;
            }
        }, DEBOUNCE_DELAY);
    };

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            if (summaryTimerRef.current) clearTimeout(summaryTimerRef.current);
            if (descriptionTimerRef.current) clearTimeout(descriptionTimerRef.current);
        };
    }, []);

    /**
     * Get list of operations defined for this path
     */
    const getOperations = (): Array<{ method: string; operation: any }> => {
        const operations: Array<{ method: string; operation: any }> = [];

        const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'];

        for (const method of methods) {
            const getter = `get${method.charAt(0).toUpperCase()}${method.slice(1)}`;
            const operation = (pathItem as any)[getter]?.();
            if (operation) {
                operations.push({ method: method.toUpperCase(), operation });
            }
        }

        return operations;
    };

    const operations = getOperations();

    /**
     * Handle operation click to select it for editing
     */
    const handleOperationClick = (method: string) => {
        // Format: /paths/{pathName}/{method}
        const operationPath = `/paths/${pathName}/${method.toLowerCase()}`;
        selectByPath(operationPath);
    };

    return (
        <div>
            <Title headingLevel="h2" size="xl">
                Path: {pathName}
            </Title>
            <p style={{ marginBottom: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Edit metadata and operations for this path
            </p>

            <Divider style={{ marginBottom: '1rem' }} />

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

            <Title headingLevel="h3" size="lg">
                Operations
            </Title>

            {operations.length === 0 ? (
                <p style={{ color: 'var(--pf-v6-global--Color--200)' }}>
                    No operations defined for this path.
                </p>
            ) : (
                <List isPlain>
                    {operations.map(({ method, operation }) => (
                        <ListItem key={method}>
                            <Button
                                variant="link"
                                isInline
                                onClick={() => handleOperationClick(method)}
                                style={{ padding: 0 }}
                            >
                                <Badge isRead>{method}</Badge>
                                <span style={{ marginLeft: '0.5rem' }}>
                                    {operation.getSummary?.() || 'No summary'}
                                </span>
                            </Button>
                        </ListItem>
                    ))}
                </List>
            )}

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are automatically saved. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

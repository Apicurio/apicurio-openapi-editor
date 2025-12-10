/**
 * Path form for editing path metadata and operations
 */

import React, { useState } from 'react';
import {
    Form,
    Title,
    Divider,
    Label,
    EmptyState,
    EmptyStateBody,
    EmptyStateFooter,
    EmptyStateActions,
    Button,
    Dropdown,
    DropdownList,
    DropdownItem,
    MenuToggle,
    List,
    ListItem,
} from '@patternfly/react-core';
import { EllipsisVIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { useDocument } from '@hooks/useDocument';
import { useCommand } from '@hooks/useCommand';
import { OpenApi30Document, OpenApi30PathItem, OpenApi30Operation } from '@apicurio/data-models';
import { useSelection } from '@hooks/useSelection';
import { CreateOperationCommand } from '@commands/CreateOperationCommand';
import { DeleteOperationCommand } from '@commands/DeleteOperationCommand';
import { DeletePathCommand } from '@commands/DeletePathCommand';
import { CompositeCommand } from '@commands/CompositeCommand';
import { ExpandablePanel } from '@components/common/ExpandablePanel';
import { PropertyInput } from '@components/common/PropertyInput';
import "./PathForm.css";

/**
 * Path form component for editing path metadata and operations
 */

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
    const { selectedPath, selectRoot } = useSelection();

    // Extract path information early (before hooks)
    const pathName = selectedPath ? selectedPath.replace('/paths/', '') : '';
    const oaiDoc = document as OpenApi30Document;
    const paths = oaiDoc?.getPaths();
    const pathItem = paths?.getItem(pathName) as OpenApi30PathItem;

    // Track selected operation tab
    const [selectedOperation, setSelectedOperation] = useState<string>('get');

    // Track dropdown open state
    const [isOperationMenuOpen, setIsOperationMenuOpen] = useState(false);
    const [isPathMenuOpen, setIsPathMenuOpen] = useState(false);

    /**
     * Get parameters filtered by location
     */
    const getParametersByLocation = (location: string): any[] => {
        const parameters = pathItem?.getParameters();
        if (!parameters || parameters.length === 0) {
            return [];
        }
        return parameters.filter((param: any) => {
            const paramIn = param.getIn?.() || param.in;
            return paramIn === location;
        });
    };

    // Track expandable panel state - start expanded if parameters exist
    const [isPathParametersExpanded, setIsPathParametersExpanded] = useState(() => getParametersByLocation('path').length > 0);
    const [isQueryParametersExpanded, setIsQueryParametersExpanded] = useState(() => getParametersByLocation('query').length > 0);
    const [isHeaderParametersExpanded, setIsHeaderParametersExpanded] = useState(() => getParametersByLocation('header').length > 0);
    const [isCookieParametersExpanded, setIsCookieParametersExpanded] = useState(() => getParametersByLocation('cookie').length > 0);

    // Get the current operation
    const selectedOpGetter = `get${selectedOperation.charAt(0).toUpperCase()}${selectedOperation.slice(1)}`;
    const operation = pathItem ? (pathItem as any)[selectedOpGetter]?.() as OpenApi30Operation | undefined : undefined;

    /**
     * Handle creating a new operation using the command pattern
     */
    const handleCreateOperation = () => {
        if (!selectedPath) return;

        const command = new CreateOperationCommand(selectedPath, selectedOperation);
        executeCommand(command, `Create ${selectedOperation.toUpperCase()} operation`);
    };

    /**
     * Handle deleting the selected operation
     */
    const handleDeleteSelectedOperation = () => {
        if (!selectedPath || !operation) return;

        const command = new DeleteOperationCommand(selectedPath, selectedOperation);
        executeCommand(command, `Delete ${selectedOperation.toUpperCase()} operation`);

        // Switch to 'get' after deletion
        setSelectedOperation('get');
        setIsOperationMenuOpen(false);
    };

    /**
     * Handle deleting all operations
     */
    const handleDeleteAllOperations = () => {
        if (!selectedPath || !pathItem) return;

        // Find all existing operations
        const existingMethods = HTTP_METHODS.filter(({ method }) => {
            const getter = `get${method.charAt(0).toUpperCase()}${method.slice(1)}`;
            return !!(pathItem as any)[getter]?.();
        }).map(m => m.method);

        if (existingMethods.length === 0) return;

        // Create a command for each operation to delete
        const deleteCommands = existingMethods.map(method =>
            new DeleteOperationCommand(selectedPath, method)
        );

        // Wrap all delete commands in a composite command
        const compositeCommand = new CompositeCommand(
            deleteCommands,
            `Delete all operations (${existingMethods.length})`
        );

        // Execute the composite command
        executeCommand(compositeCommand, `Delete all operations`);

        // Switch to 'get' after deletion
        setSelectedOperation('get');
        setIsOperationMenuOpen(false);
    };

    /**
     * Handle deleting the path
     */
    const handleDeletePath = () => {
        if (!selectedPath) return;

        const command = new DeletePathCommand(pathName);
        executeCommand(command, `Delete path ${pathName}`);

        // Navigate to root after deletion
        selectRoot();
        setIsPathMenuOpen(false);
    };

    /**
     * Render a parameter list section
     */
    const renderParameterSection = (title: string, location: string, isExpanded: boolean, onToggle: (expanded: boolean) => void) => {
        const parameters = getParametersByLocation(location);

        return (
            <ExpandablePanel
                title={title}
                isExpanded={isExpanded}
                onToggle={onToggle}
                className="parameter-section"
                actions={
                    <Button
                        variant="plain"
                        aria-label={`Add ${location} parameter`}
                        icon={<PlusCircleIcon />}
                        style={{ minWidth: 'auto', padding: '0.25rem' }}
                    />
                }
            >
                {parameters.length === 0 ? (
                    <EmptyState>
                        <EmptyStateBody>
                            No {location} parameters defined
                        </EmptyStateBody>
                        <EmptyStateFooter>
                            <EmptyStateActions>
                                <Button variant="primary">
                                    Add parameter
                                </Button>
                            </EmptyStateActions>
                        </EmptyStateFooter>
                    </EmptyState>
                ) : (
                    <div style={{paddingLeft: "20px", paddingTop: "10px"}}>
                        <List isPlain isBordered>
                            {parameters.map((param: any, index: number) => {
                                const paramName = param.getName?.() || param.name || 'Unnamed';
                                const paramRequired = param.getRequired?.() || param.required || false;
                                const paramType = param.getSchema?.()?.getType?.() || param.schema?.type || 'string';

                                return (
                                    <ListItem key={index}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                            <div>
                                                <strong>{paramName}</strong>
                                                {' '}
                                                <Label isCompact color="grey">{paramType}</Label>
                                                {paramRequired && (
                                                    <>
                                                        {' '}
                                                        <Label isCompact color="orange">required</Label>
                                                    </>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Button variant="link" size="sm">Edit</Button>
                                                <Button variant="link" size="sm" isDanger>Delete</Button>
                                            </div>
                                        </div>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>
                )}
            </ExpandablePanel>
        );
    };

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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Title headingLevel="h2" size="xl">
                    Path: {pathName}
                </Title>
                <Dropdown
                    isOpen={isPathMenuOpen}
                    onOpenChange={setIsPathMenuOpen}
                    popperProps={{ position: 'right' }}
                    toggle={(toggleRef) => (
                        <MenuToggle
                            ref={toggleRef}
                            variant="plain"
                            onClick={() => setIsPathMenuOpen(!isPathMenuOpen)}
                            aria-label="Path menu"
                        >
                            <EllipsisVIcon />
                        </MenuToggle>
                    )}
                >
                    <DropdownList>
                        <DropdownItem
                            key="delete-path"
                            onClick={handleDeletePath}
                        >
                            Delete path
                        </DropdownItem>
                    </DropdownList>
                </Dropdown>
            </div>
            <p style={{ marginBottom: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Edit path metadata and operations
            </p>

            <Divider style={{ marginBottom: '1rem' }} />

            {/* Path metadata form */}
            <Form>
                <PropertyInput
                    model={pathItem}
                    propertyName="summary"
                    label="Summary"
                    placeholder="Short summary of the path"
                />

                <PropertyInput
                    model={pathItem}
                    propertyName="description"
                    label="Description"
                    type="textarea"
                    placeholder="Detailed description of the path"
                />
            </Form>

            <Divider style={{ margin: '1.5rem 0' }} />

            {/* Path Parameters */}
            {renderParameterSection('Path Parameters', 'path', isPathParametersExpanded, setIsPathParametersExpanded)}
            {/* Query Parameters */}
            {renderParameterSection('Query Parameters', 'query', isQueryParametersExpanded, setIsQueryParametersExpanded)}
            {/* Header Parameters */}
            {renderParameterSection('Header Parameters', 'header', isHeaderParametersExpanded, setIsHeaderParametersExpanded)}
            {/* Cookie Parameters */}
            {renderParameterSection('Cookie Parameters', 'cookie', isCookieParametersExpanded, setIsCookieParametersExpanded)}

            <Divider style={{ margin: '1.5rem 0' }} />

            {/* Operation tabs */}
            <Title headingLevel="h3" size="lg" style={{ marginBottom: '1rem' }}>
                Operations
            </Title>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
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
                <Dropdown
                    isOpen={isOperationMenuOpen}
                    onOpenChange={setIsOperationMenuOpen}
                    toggle={(toggleRef) => (
                        <MenuToggle
                            ref={toggleRef}
                            variant="plain"
                            onClick={() => setIsOperationMenuOpen(!isOperationMenuOpen)}
                            aria-label="Operation menu"
                        >
                            <EllipsisVIcon />
                        </MenuToggle>
                    )}
                >
                    <DropdownList>
                        <DropdownItem
                            key="delete-selected"
                            onClick={handleDeleteSelectedOperation}
                            isDisabled={!operation}
                        >
                            Delete selected operation
                        </DropdownItem>
                        <DropdownItem
                            key="delete-all"
                            onClick={handleDeleteAllOperations}
                            isDisabled={!HTTP_METHODS.some(({ method }) => {
                                const getter = `get${method.charAt(0).toUpperCase()}${method.slice(1)}`;
                                return !!(pathItem as any)[getter]?.();
                            })}
                        >
                            Delete all operations
                        </DropdownItem>
                    </DropdownList>
                </Dropdown>
            </div>

            {/* Operation details or empty state */}
            {operation ? (
                <Form>
                    <PropertyInput
                        model={operation}
                        propertyName="summary"
                        label="Summary"
                        placeholder="Short summary of the operation"
                    />

                    <PropertyInput
                        model={operation}
                        propertyName="operationId"
                        label="Operation ID"
                        placeholder="Unique operation identifier"
                    />

                    <PropertyInput
                        model={operation}
                        propertyName="description"
                        label="Description"
                        type="textarea"
                        placeholder="Detailed description of the operation"
                    />
                </Form>
            ) : (
                <EmptyState>
                    <EmptyStateBody>
                        No {selectedOperation.toUpperCase()} operation defined
                    </EmptyStateBody>
                    <EmptyStateFooter>
                        <EmptyStateActions>
                            <Button variant="primary" onClick={handleCreateOperation}>
                                Create {selectedOperation.toUpperCase()} operation
                            </Button>
                        </EmptyStateActions>
                    </EmptyStateFooter>
                </EmptyState>
            )}

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are saved when you press Enter or when a field loses focus. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

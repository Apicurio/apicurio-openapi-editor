/**
 * Path form for editing path metadata and operations
 */

import React, {useState, useEffect} from 'react';
import {
    Button,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownList,
    EmptyState,
    EmptyStateActions,
    EmptyStateBody,
    EmptyStateFooter,
    Form, Label,
    MenuToggle,
    Tab,
    Tabs,
    Title
} from '@patternfly/react-core';
import {EllipsisVIcon} from '@patternfly/react-icons';
import {useDocument} from '@hooks/useDocument';
import {useCommand} from '@hooks/useCommand';
import {OpenApi30Operation, OpenApi30PathItem, NodePathUtil, NodePathSegment} from '@apicurio/data-models';
import {useSelection} from '@hooks/useSelection';
import {useHighlightEffect} from '@hooks/useHighlightEffect';
import {CreateOperationCommand} from '@commands/CreateOperationCommand';
import {DeleteOperationCommand} from '@commands/DeleteOperationCommand';
import {DeletePathCommand} from '@commands/DeletePathCommand';
import {CompositeCommand} from '@commands/CompositeCommand';
import {AddParameterCommand} from '@commands/AddParameterCommand';
import {DeleteParameterCommand} from '@commands/DeleteParameterCommand';
import {PropertyInput} from '@components/common/PropertyInput';
import {PathLabel} from '@components/common/PathLabel';
import {ParameterSection} from '@components/common/ParameterSection';
import {CreateParameterModal} from '@components/modals/CreateParameterModal';
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
    const { selectedPath, selectedNode, selectRoot, navigationObject, select } = useSelection();

    // Enable highlight effect
    useHighlightEffect();

    // Extract path information early (before hooks)
    const pathItem: OpenApi30PathItem = navigationObject as OpenApi30PathItem;
    const pathName = pathItem.mapPropertyName();

    // Track selected operation tab
    const [selectedOperation, setSelectedOperation] = useState<string>('get');

    // Track dropdown open state
    const [isOperationMenuOpen, setIsOperationMenuOpen] = useState(false);
    const [isPathMenuOpen, setIsPathMenuOpen] = useState(false);

    // Sync operation tab when selection changes externally
    useEffect(() => {
        if (!selectedPath || !pathItem || !document) return;

        // Get the method from the node path
        const segments = selectedPath.toSegments();

        if (segments[0] === "/paths" && segments.length >= 3) {
            const method = segments[2].substring(1);
            setSelectedOperation(method);
        }
    }, [selectedPath, selectedNode, pathItem, document]);

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

    // Track expandable panel state
    // Path Parameters: expanded if the path has variables
    // Query, Header, Cookie: always collapsed
    const [isPathParametersExpanded, setIsPathParametersExpanded] = useState(() => true);
    const [isQueryParametersExpanded, setIsQueryParametersExpanded] = useState(false);
    const [isHeaderParametersExpanded, setIsHeaderParametersExpanded] = useState(false);
    const [isCookieParametersExpanded, setIsCookieParametersExpanded] = useState(false);

    // Track modal state
    const [isCreateParameterModalOpen, setIsCreateParameterModalOpen] = useState(false);
    const [createParameterLocation, setCreateParameterLocation] = useState<string>('query');

    /**
     * Handle creating a new operation using the command pattern
     */
    const handleCreateOperation = () => {
        if (!selectedPath) return;

        const command = new CreateOperationCommand(pathItem, selectedOperation);
        executeCommand(command, `Create ${selectedOperation.toUpperCase()} operation`);
    };

    /**
     * Handle deleting the selected operation
     */
    const handleDeleteSelectedOperation = () => {
        if (!selectedPath) return;

        // Get the current operation
        const selectedOpGetter = `get${selectedOperation.charAt(0).toUpperCase()}${selectedOperation.slice(1)}`;
        const operation = pathItem ? (pathItem as any)[selectedOpGetter]?.() as OpenApi30Operation | undefined : undefined;

        if (!operation) return;

        const command = new DeleteOperationCommand(pathItem, selectedOperation);
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
            new DeleteOperationCommand(pathItem, method)
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
     * Handle opening the create parameter modal
     */
    const handleOpenCreateParameterModal = (location: string) => {
        setCreateParameterLocation(location);
        setIsCreateParameterModalOpen(true);
    };

    /**
     * Handle closing the create parameter modal
     */
    const handleCloseCreateParameterModal = () => {
        setIsCreateParameterModalOpen(false);
    };

    /**
     * Handle creating a new parameter
     */
    const handleCreateParameter = (name: string, description: string, required: boolean, type: string) => {
        if (!pathItem) {
            console.error('Cannot create parameter: no path item selected');
            return;
        }

        const command = new AddParameterCommand(
            pathItem,
            name,
            createParameterLocation,
            description || null,
            required,
            type
        );

        const locationDisplayName = createParameterLocation.charAt(0).toUpperCase() + createParameterLocation.slice(1);
        executeCommand(command, `Add ${locationDisplayName} parameter '${name}'`);
    };

    /**
     * Handle editing a parameter
     */
    const handleEditParameter = (parameter: any, index: number) => {
        console.log('Edit parameter:', parameter, index);
        // TODO: Implement parameter editing
    };

    /**
     * Handle deleting a parameter
     */
    const handleDeleteParameter = (parameter: any, index: number) => {
        if (!pathItem) {
            console.error('Cannot delete parameter: no path item selected');
            return;
        }

        // Extract parameter details
        const paramName = parameter.getName?.() || parameter.name;
        const paramLocation = parameter.getIn?.() || parameter.in;

        if (!paramName || !paramLocation) {
            console.error('Cannot delete parameter: invalid parameter');
            return;
        }

        const command = new DeleteParameterCommand(
            pathItem,
            paramName,
            paramLocation
        );

        const locationDisplayName = paramLocation.charAt(0).toUpperCase() + paramLocation.slice(1);
        executeCommand(command, `Delete ${locationDisplayName} parameter '${paramName}'`);
    };

    // Conditional checks after all hooks
    if (!document || !selectedPath) {
        return <div>No path selected</div>;
    }

    if (!pathItem) {
        return <div>Path not found: {pathName}</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <Title headingLevel="h2" size="xl">
                    Path: <PathLabel path={pathName} />
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

            <ParameterSection
                title="Path Parameters"
                location="path"
                isExpanded={isPathParametersExpanded}
                onToggle={setIsPathParametersExpanded}
                parameters={getParametersByLocation('path')}
            />

            <ParameterSection
                title="Query Parameters"
                location="query"
                isExpanded={isQueryParametersExpanded}
                onToggle={setIsQueryParametersExpanded}
                parameters={getParametersByLocation('query')}
                onAddParameter={() => handleOpenCreateParameterModal('query')}
                onEditParameter={handleEditParameter}
                onDeleteParameter={handleDeleteParameter}
            />

            <ParameterSection
                title="Header Parameters"
                location="header"
                isExpanded={isHeaderParametersExpanded}
                onToggle={setIsHeaderParametersExpanded}
                parameters={getParametersByLocation('header')}
                onAddParameter={() => handleOpenCreateParameterModal('header')}
                onEditParameter={handleEditParameter}
                onDeleteParameter={handleDeleteParameter}
            />

            <ParameterSection
                title="Cookie Parameters"
                location="cookie"
                isExpanded={isCookieParametersExpanded}
                onToggle={setIsCookieParametersExpanded}
                parameters={getParametersByLocation('cookie')}
                onAddParameter={() => handleOpenCreateParameterModal('cookie')}
                onEditParameter={handleEditParameter}
                onDeleteParameter={handleDeleteParameter}
            />

            <Divider style={{ margin: '1.5rem 0' }} />

            {/* Operation tabs */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <Title headingLevel="h3" size="lg">
                    Operations
                </Title>
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
                            isDisabled={(() => {
                                const selectedOpGetter = `get${selectedOperation.charAt(0).toUpperCase()}${selectedOperation.slice(1)}`;
                                const operation = pathItem ? (pathItem as any)[selectedOpGetter]?.() : undefined;
                                return !operation;
                            })()}
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

            <Tabs
                activeKey={selectedOperation}
                onSelect={(_event, tabKey) => {
                    const method = tabKey as string;
                    setSelectedOperation(method);

                    // Fire selection event for the operation
                    const getter = `get${method.charAt(0).toUpperCase()}${method.slice(1)}`;
                    const operation = (pathItem as any)[getter]?.() as OpenApi30Operation | undefined;

                    if (operation) {
                        // Operation exists - select it directly
                        select(operation);
                    } else {
                        // Operation doesn't exist - construct NodePath for where it would be
                        const operationPath = NodePathUtil.createNodePath(pathItem);
                        operationPath.append(new NodePathSegment(method, false));
                        select(operationPath);
                    }
                }}
                aria-label="Operations tabs"
                role="region"
            >
                {HTTP_METHODS.map(({ method, label, color }) => {
                    const getter = `get${method.charAt(0).toUpperCase()}${method.slice(1)}`;
                    const currentOperation = (pathItem as any)[getter]?.() as OpenApi30Operation | undefined;
                    const exists = !!currentOperation;

                    return (
                        <Tab
                            key={method}
                            eventKey={method}
                            title={
                                    <Label color={exists ? color : 'grey'}>
                                        {label}
                                    </Label>
                            }
                        >
                            {currentOperation ? (
                                <Form style={{ paddingTop: '1rem' }}>
                                    <PropertyInput
                                        model={currentOperation}
                                        propertyName="summary"
                                        label="Summary"
                                        placeholder="Short summary of the operation"
                                    />

                                    <PropertyInput
                                        model={currentOperation}
                                        propertyName="operationId"
                                        label="Operation ID"
                                        placeholder="Unique operation identifier"
                                    />

                                    <PropertyInput
                                        model={currentOperation}
                                        propertyName="description"
                                        label="Description"
                                        type="textarea"
                                        placeholder="Detailed description of the operation"
                                    />
                                </Form>
                            ) : (
                                <div style={{ paddingTop: '1rem' }}>
                                    <EmptyState>
                                        <EmptyStateBody>
                                            No {label} operation defined
                                        </EmptyStateBody>
                                        <EmptyStateFooter>
                                            <EmptyStateActions>
                                                <Button variant="primary" onClick={handleCreateOperation}>
                                                    Create {label} operation
                                                </Button>
                                            </EmptyStateActions>
                                        </EmptyStateFooter>
                                    </EmptyState>
                                </div>
                            )}
                        </Tab>
                    );
                })}
            </Tabs>

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are saved when you press Enter or when a field loses focus. Use Undo/Redo buttons to revert changes.
            </p>

            {/* Create Parameter Modal */}
            <CreateParameterModal
                isOpen={isCreateParameterModalOpen}
                parameterLocation={createParameterLocation}
                onClose={handleCloseCreateParameterModal}
                onConfirm={handleCreateParameter}
            />
        </div>
    );
};

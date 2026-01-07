/**
 * Navigation panel for the master section
 */

import React, { useState, useMemo } from 'react';
import {
    Nav,
    NavList,
    NavItem,
    Divider,
    Button,
    SearchInput, Tooltip,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { useDocument } from '@hooks/useDocument';
import { useSelection } from '@hooks/useSelection';
import { useCommand } from '@hooks/useCommand';
import {
    OpenApi30Document,
    NodePath,
    OpenApiDocument,
    OpenApi31Document,
    OpenApi20Document
} from '@apicurio/data-models';
import { CreatePathModal } from '@components/modals/CreatePathModal';
import { CreateSchemaModal } from '@components/modals/CreateSchemaModal';
import { CreatePathCommand } from '@commands/CreatePathCommand';
import { CreateSchemaCommand } from '@commands/CreateSchemaCommand';
import { ExpandablePanel } from '@components/common/ExpandablePanel';
import { PathLabel } from '@components/common/PathLabel';
import './NavigationPanel.css';
import {
    OpenApi20Definitions
} from "@apicurio/data-models/src/io/apicurio/datamodels/models/openapi/v20/OpenApi20Definitions";

/**
 * Navigation panel component
 * Shows lists of paths and schemas
 */
export const NavigationPanel: React.FC = () => {
    const { document, specVersion } = useDocument();
    const { select, selectRoot, navigationObject, navigationObjectType } = useSelection();
    const { executeCommand } = useCommand();
    const [isCreatePathModalOpen, setIsCreatePathModalOpen] = useState(false);
    const [isCreateSchemaModalOpen, setIsCreateSchemaModalOpen] = useState(false);
    const [isPathsExpanded, setIsPathsExpanded] = useState(true);
    const [isSchemasExpanded, setIsSchemasExpanded] = useState(true);
    const [filterText, setFilterText] = useState('');

    /**
     * Get list of paths from the document
     */
    const getPaths = (): string[] => {
        if (!document) {
            return [];
        }
        const oaiDoc = document as OpenApiDocument;
        const paths = oaiDoc.getPaths();
        if (!paths) {
            return [];
        }
        return paths.getItemNames();
    };

    /**
     * Get list of schema names from the document
     */
    const getSchemas = (): string[] => {
        if (!document) {
            return [];
        }

        const oaiDoc = document as OpenApiDocument;

        if (specVersion === '2.0') {
            // For OpenAPI 2.0, get schemas from 'definitions'
            const definitions: OpenApi20Definitions = (oaiDoc as OpenApi20Document).getDefinitions();
            if (!definitions) {
                return [];
            }
            return definitions.getItemNames();
        } else {
            // For OpenAPI 3.0 and 3.1, get schemas from 'components.schemas'
            const components = (oaiDoc as OpenApi30Document | OpenApi31Document).getComponents();
            if (!components) {
                return [];
            }
            const schemas = components.getSchemas();
            if (!schemas) {
                return [];
            }
            return Object.keys(schemas);
        }
    };

    const paths = getPaths().sort();
    const schemas = getSchemas().sort();

    /**
     * Filter items based on filter text
     */
    const filterItems = (items: string[]): string[] => {
        if (!filterText.trim()) {
            return items;
        }
        const searchTerm = filterText.toLowerCase();
        return items.filter(item => item.toLowerCase().includes(searchTerm));
    };

    /**
     * Filtered paths and schemas
     */
    const filteredPaths = useMemo(() => filterItems(paths), [paths, filterText]);
    const filteredSchemas = useMemo(() => filterItems(schemas), [schemas, filterText]);

    /**
     * Handle path selection
     */
    const handlePathClick = (path: string) => {
        const oaiDoc = document as OpenApi30Document;
        const pathItem = oaiDoc.getPaths().getItem(path);
        select(pathItem);
    };

    /**
     * Handle schema selection
     */
    const handleSchemaClick = (schemaName: string) => {
        const oaiDoc = document as OpenApiDocument;

        if (specVersion === '2.0') {
            // For OpenAPI 2.0, get schema from 'definitions'
            const definitions = (oaiDoc as any).getDefinitions?.();
            if (definitions) {
                const schema = definitions[schemaName];
                select(schema);
            }
            return;
        } else {
            // For OpenAPI 3.0 and 3.1, get schema from 'components.schemas'
            const components = (oaiDoc as OpenApi30Document | OpenApi31Document).getComponents();
            if (components) {
                const schema = components.getSchemas()[schemaName];
                select(schema);
            }
        }
    };

    /**
     * Handle main/info selection
     */
    const handleMainClick = () => {
        selectRoot();
    };

    /**
     * Handle creating a new path
     */
    const handleCreatePath = (pathName: string) => {
        const command = new CreatePathCommand(pathName);
        executeCommand(command, `Create path ${pathName}`);

        // Select the newly created path
        const nodePath = NodePath.parse(`/paths/${pathName}`);
        select(nodePath);
    };

    /**
     * Handle creating a new schema
     */
    const handleCreateSchema = (schemaName: string) => {
        const command = new CreateSchemaCommand(schemaName);
        executeCommand(command, `Create schema ${schemaName}`);

        // Select the newly created schema
        handleSchemaClick(schemaName);
    };

    return (
        <>
            <Nav aria-label="Navigation" onSelect={() => {}}>
                <NavList>
                    {/* Main/Info Section */}
                    <NavItem
                        itemId="main"
                        isActive={navigationObjectType === "info"}
                        onClick={handleMainClick}
                    >
                        API Info
                    </NavItem>

                    <Divider />

                    {/* Search/Filter Section */}
                    <div style={{ padding: '5px' }}>
                        <SearchInput
                            placeholder="Filter..."
                            value={filterText}
                            onChange={(_event, value) => setFilterText(value)}
                            onClear={() => setFilterText('')}
                        />
                    </div>

                    <Divider />

                    {/* Paths Section */}
                    <ExpandablePanel
                        title="Paths"
                        isExpanded={isPathsExpanded}
                        onToggle={setIsPathsExpanded}
                        badgeCount={filteredPaths.length}
                        actions={
                            <Button
                                variant="plain"
                                aria-label="Add path"
                                onClick={() => setIsCreatePathModalOpen(true)}
                                icon={<PlusCircleIcon />}
                                style={{ minWidth: 'auto', padding: '0.25rem' }}
                            />
                        }
                    >
                        {filteredPaths.length === 0 ? (
                            <NavItem itemId="no-paths" disabled>
                                {filterText ? 'No matching paths' : 'No paths defined'}
                            </NavItem>
                        ) : (
                            filteredPaths.map((path) => {
                                const isActive = navigationObjectType === "pathItem" && navigationObject?.mapPropertyName() === path;
                                return (
                                    <NavItem
                                        key={path}
                                        itemId={`path-${path}`}
                                        isActive={isActive}
                                        onClick={() => handlePathClick(path)}
                                    >
                                        <a style={{width: "100%", overflowX: "hidden", textWrap: "nowrap"}}>
                                            <Tooltip content={<div>{path}</div>}>
                                                <PathLabel path={path} />
                                            </Tooltip>
                                        </a>
                                    </NavItem>
                                );
                            })
                        )}
                    </ExpandablePanel>

                    <Divider />

                    {/* Schemas Section */}
                    <ExpandablePanel
                        title="Schemas"
                        isExpanded={isSchemasExpanded}
                        onToggle={setIsSchemasExpanded}
                        badgeCount={filteredSchemas.length}
                        actions={
                            <Button
                                variant="plain"
                                aria-label="Add schema"
                                onClick={() => setIsCreateSchemaModalOpen(true)}
                                icon={<PlusCircleIcon />}
                                style={{ minWidth: 'auto', padding: '0.25rem' }}
                            />
                        }
                    >
                        {filteredSchemas.length === 0 ? (
                            <NavItem itemId="no-schemas" disabled>
                                {filterText ? 'No matching schemas' : 'No schemas defined'}
                            </NavItem>
                        ) : (
                            filteredSchemas.map((schemaName) => {
                                const isActive = navigationObjectType === "schema" && navigationObject?.mapPropertyName() === schemaName;
                                return (
                                    <NavItem
                                        key={schemaName}
                                        itemId={`schema-${schemaName}`}
                                        isActive={isActive}
                                        onClick={() => handleSchemaClick(schemaName)}
                                    >
                                        {schemaName}
                                    </NavItem>
                                );
                            })
                        )}
                    </ExpandablePanel>
            </NavList>
        </Nav>

        {/* Create Path Modal */}
        <CreatePathModal
            isOpen={isCreatePathModalOpen}
            onClose={() => setIsCreatePathModalOpen(false)}
            onConfirm={handleCreatePath}
        />

        {/* Create Schema Modal */}
        <CreateSchemaModal
            isOpen={isCreateSchemaModalOpen}
            onClose={() => setIsCreateSchemaModalOpen(false)}
            onConfirm={handleCreateSchema}
        />
        </>
    );
};

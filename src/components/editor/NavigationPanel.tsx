/**
 * Navigation panel for the master section
 */

import React from 'react';
import {
    Nav,
    NavList,
    NavItem,
    Divider,
    Title,
} from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';
import { useSelection } from '@hooks/useSelection';
import { OpenApi30Document } from '@apicurio/data-models';
import './NavigationPanel.css';

/**
 * Navigation panel component
 * Shows lists of paths and schemas
 */
export const NavigationPanel: React.FC = () => {
    const { document } = useDocument();
    const { selectedPath, selectByPath, selectRoot } = useSelection();

    /**
     * Get list of paths from the document
     */
    const getPaths = (): string[] => {
        if (!document) {
            return [];
        }
        const oaiDoc = document as OpenApi30Document;
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
        const oaiDoc = document as OpenApi30Document;
        const components = oaiDoc.getComponents();
        if (!components) {
            return [];
        }
        const schemas = components.getSchemas();
        if (!schemas) {
            return [];
        }
        return Object.keys(schemas);
    };

    const paths = getPaths().sort();
    const schemas = getSchemas().sort();

    /**
     * Handle path selection
     */
    const handlePathClick = (path: string) => {
        selectByPath(`/paths/${path}`);
    };

    /**
     * Handle schema selection
     */
    const handleSchemaClick = (schemaName: string) => {
        selectByPath(`/components/schemas/${schemaName}`);
    };

    /**
     * Handle main/info selection
     */
    const handleMainClick = () => {
        selectRoot();
    };

    return (
        <Nav aria-label="Navigation" onSelect={() => {}}>
            <NavList>
                {/* Main/Info Section */}
                <NavItem
                    itemId="main"
                    isActive={selectedPath === '/' || selectedPath === null}
                    onClick={handleMainClick}
                >
                    API Info
                </NavItem>

                <Divider />

                {/* Paths Section */}
                <Title headingLevel="h3" size="md" style={{ padding: '0.5rem 1rem' }}>
                    Paths
                </Title>
                {paths.length === 0 ? (
                    <NavItem itemId="no-paths" disabled>
                        No paths defined
                    </NavItem>
                ) : (
                    paths.map((path) => {
                        const isActive = selectedPath === `/paths/${path}`;
                        return (
                            <NavItem
                                key={path}
                                itemId={`path-${path}`}
                                isActive={isActive}
                                onClick={() => handlePathClick(path)}
                            >
                                {path}
                            </NavItem>
                        );
                    })
                )}

                <Divider />

                {/* Schemas Section */}
                <Title headingLevel="h3" size="md" style={{ padding: '0.5rem 1rem' }}>
                    Schemas
                </Title>
                {schemas.length === 0 ? (
                    <NavItem itemId="no-schemas" disabled>
                        No schemas defined
                    </NavItem>
                ) : (
                    schemas.map((schemaName) => {
                        const isActive = selectedPath === `/components/schemas/${schemaName}`;
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
            </NavList>
        </Nav>
    );
};

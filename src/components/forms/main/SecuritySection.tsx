/**
 * Security section for editing security schemes and requirements
 */

import React, { useState } from 'react';
import {
    Button,
    DataList,
    DataListAction,
    DataListCell,
    DataListItem,
    DataListItemCells,
    DataListItemRow,
    Dropdown,
    DropdownItem,
    DropdownList,
    Label,
    MenuToggle
} from '@patternfly/react-core';
import { EllipsisVIcon, PlusIcon, ShieldAltIcon, TrashIcon } from '@patternfly/react-icons';
import {
    NodePathUtil,
    OpenApi20Document,
    OpenApi30Document,
    OpenApi31Document,
    OpenApiDocument,
    SecurityRequirement,
    SecurityScheme
} from '@apicurio/data-models';
import { useDocument } from '@hooks/useDocument';
import { useCommand } from '@hooks/useCommand';
import { useSelection } from '@hooks/useSelection';
import { ExpandablePanel } from '@components/common/ExpandablePanel';
import { NewSecuritySchemeModal, SecuritySchemeData } from '@components/modals/NewSecuritySchemeModal';
import { AddSecuritySchemeCommand } from '@commands/AddSecuritySchemeCommand';
import { DeleteSecuritySchemeCommand } from '@commands/DeleteSecuritySchemeCommand';
import { DeleteAllSecuritySchemesCommand } from '@commands/DeleteAllSecuritySchemesCommand';

/**
 * Security section component for editing security schemes and requirements
 */
export const SecuritySection: React.FC = () => {
    const { document, specVersion } = useDocument();
    const { executeCommand } = useCommand();
    const { select } = useSelection();

    if (!document) {
        return null;
    }

    const oaiDoc = document as OpenApiDocument;

    const [isSchemesExpanded, setIsSchemesExpanded] = useState(true);
    const [isRequirementsExpanded, setIsRequirementsExpanded] = useState(true);
    const [openSchemeDropdownIndex, setOpenSchemeDropdownIndex] = useState<number | null>(null);
    const [openRequirementDropdownIndex, setOpenRequirementDropdownIndex] = useState<number | null>(null);
    const [isNewSchemeModalOpen, setIsNewSchemeModalOpen] = useState(false);

    /**
     * Get security schemes from the document
     */
    const getSecuritySchemes = (): { name: string; scheme: SecurityScheme }[] => {
        if (specVersion === '2.0') {
            const definitions = (oaiDoc as OpenApi20Document).getSecurityDefinitions();
            if (!definitions) return [];
            const names = definitions.getItemNames();
            return names.map(name => ({
                name,
                scheme: definitions.getItem(name)
            }));
        } else {
            const components = (oaiDoc as OpenApi30Document | OpenApi31Document).getComponents();
            if (!components) return [];
            const schemes = components.getSecuritySchemes();
            if (!schemes) return [];
            return Object.keys(schemes).map(name => ({
                name,
                scheme: schemes[name]
            }));
        }
    };

    /**
     * Get security requirements from the document
     */
    const getSecurityRequirements = (): SecurityRequirement[] => {
        return oaiDoc.getSecurity() || [];
    };

    /**
     * Get display label for security scheme type
     */
    const getSchemeTypeLabel = (scheme: SecurityScheme): string => {
        const type = scheme.getType();
        if (!type) return 'Unknown';

        if (specVersion === '2.0') {
            if (type === 'basic') return 'Basic Auth';
            if (type === 'apiKey') return 'API Key';
            if (type === 'oauth2') return 'OAuth2';
        } else {
            if (type === 'apiKey') return 'API Key';
            if (type === 'http') return 'HTTP';
            if (type === 'oauth2') return 'OAuth2';
            if (type === 'openIdConnect') return 'OpenID Connect';
        }
        return type;
    };

    /**
     * Get color for security scheme type badge
     */
    const getSchemeTypeColor = (scheme: SecurityScheme): "blue" | "cyan" | "green" | "orange" | "purple" | "red" | "grey" => {
        const type = scheme.getType();
        if (type === 'basic' || type === 'http') return 'blue';
        if (type === 'apiKey') return 'green';
        if (type === 'oauth2') return 'purple';
        if (type === 'openIdConnect') return 'cyan';
        return 'grey';
    };

    const securitySchemes = getSecuritySchemes();
    const securityRequirements = getSecurityRequirements();

    /**
     * Handle creating a new security scheme
     */
    const handleCreateSecurityScheme = () => {
        setIsNewSchemeModalOpen(true);
    };

    /**
     * Handle confirming new security scheme
     */
    const handleConfirmNewSecurityScheme = (data: SecuritySchemeData) => {
        const command = new AddSecuritySchemeCommand(data);
        executeCommand(command, `Add security scheme "${data.name}"`);
    };

    /**
     * Handle deleting all security schemes
     */
    const handleDeleteAllSecuritySchemes = () => {
        const command = new DeleteAllSecuritySchemesCommand();
        executeCommand(command, 'Delete all security schemes');
    };

    /**
     * Handle deleting a security scheme
     */
    const handleDeleteSecurityScheme = (name: string) => {
        const command = new DeleteSecuritySchemeCommand(name);
        executeCommand(command, `Delete security scheme "${name}"`);
        setOpenSchemeDropdownIndex(null);
    };

    /**
     * Handle editing a security scheme
     */
    const handleEditSecurityScheme = (name: string) => {
        // TODO: Open edit modal
        console.log('Edit security scheme:', name);
        setOpenSchemeDropdownIndex(null);
    };

    /**
     * Handle creating a new security requirement
     */
    const handleCreateSecurityRequirement = () => {
        // TODO: Open modal
        console.log('Create security requirement');
    };

    /**
     * Handle deleting all security requirements
     */
    const handleDeleteAllSecurityRequirements = () => {
        // TODO: Implement
        console.log('Delete all security requirements');
    };

    /**
     * Handle deleting a security requirement
     */
    const handleDeleteSecurityRequirement = (index: number) => {
        // TODO: Implement
        console.log('Delete security requirement:', index);
        setOpenRequirementDropdownIndex(null);
    };

    /**
     * Handle editing a security requirement
     */
    const handleEditSecurityRequirement = (index: number) => {
        // TODO: Open edit modal
        console.log('Edit security requirement:', index);
        setOpenRequirementDropdownIndex(null);
    };

    /**
     * Get requirement display text
     */
    const getRequirementDisplayText = (requirement: SecurityRequirement): { schemes: string[]; scopes: string[] } => {
        const schemes: string[] = [];
        const scopes: string[] = [];

        const items = requirement.getSecurityRequirementItems();
        if (items) {
            items.forEach(item => {
                const schemeName = item.getName();
                const itemScopes = item.getScopes();
                if (schemeName) {
                    schemes.push(schemeName);
                    if (itemScopes && itemScopes.length > 0) {
                        scopes.push(...itemScopes);
                    }
                }
            });
        }

        return { schemes, scopes };
    };

    return (
        <>
            {/* Security Schemes Section */}
            <ExpandablePanel
                title="Security Schemes"
                nodePath={specVersion === '2.0' ? '/securityDefinitions' : '/components/securitySchemes'}
                isExpanded={isSchemesExpanded}
                onToggle={setIsSchemesExpanded}
                className="main-form__section"
                actions={
                    <>
                        <Button
                            variant="plain"
                            icon={<PlusIcon />}
                            onClick={handleCreateSecurityScheme}
                            aria-label="Add security scheme"
                        />
                        <Button
                            variant="plain"
                            icon={<TrashIcon />}
                            onClick={handleDeleteAllSecuritySchemes}
                            isDisabled={securitySchemes.length === 0}
                            aria-label="Delete all security schemes"
                            isDanger
                        />
                    </>
                }
            >
                <div className="main-form__sectionbody">
                    {securitySchemes.length === 0 ? (
                        <p style={{ color: 'var(--pf-v6-global--Color--200)', fontStyle: 'italic' }}>
                            No security schemes defined. Use the + icon to create one.
                        </p>
                    ) : (
                        <DataList
                            aria-label="Security schemes list"
                            isCompact
                            selectedDataListItemId=""
                        >
                            {securitySchemes.map(({ name, scheme }, index) => (
                                <DataListItem
                                    key={name}
                                    id={`scheme-${index}`}
                                    data-path={NodePathUtil.createNodePath(scheme).toString()}
                                    data-selectable="true"
                                >
                                    <DataListItemRow>
                                        <DataListItemCells
                                            dataListCells={[
                                                <DataListCell key="name">
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <ShieldAltIcon style={{ color: '#666' }} />
                                                            <strong>{name}</strong>
                                                            <Label color={getSchemeTypeColor(scheme)}>
                                                                {getSchemeTypeLabel(scheme)}
                                                            </Label>
                                                        </div>
                                                        {scheme.getDescription() && (
                                                            <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)', marginTop: '0.25rem' }}>
                                                                {scheme.getDescription()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </DataListCell>
                                            ]}
                                        />
                                        <DataListAction
                                            aria-labelledby={`scheme-actions-${index}`}
                                            id={`scheme-actions-${index}`}
                                            aria-label="Security scheme actions"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Dropdown
                                                isOpen={openSchemeDropdownIndex === index}
                                                onSelect={() => setOpenSchemeDropdownIndex(null)}
                                                onOpenChange={(isOpen: boolean) => setOpenSchemeDropdownIndex(isOpen ? index : null)}
                                                popperProps={{ position: 'right' }}
                                                toggle={(toggleRef) => (
                                                    <MenuToggle
                                                        ref={toggleRef}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenSchemeDropdownIndex(openSchemeDropdownIndex === index ? null : index);
                                                        }}
                                                        variant="plain"
                                                        aria-label={`Actions for security scheme ${name}`}
                                                    >
                                                        <EllipsisVIcon />
                                                    </MenuToggle>
                                                )}
                                            >
                                                <DropdownList>
                                                    <DropdownItem
                                                        key="edit"
                                                        onClick={() => handleEditSecurityScheme(name)}
                                                    >
                                                        Edit scheme
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        onClick={() => handleDeleteSecurityScheme(name)}
                                                    >
                                                        Delete scheme
                                                    </DropdownItem>
                                                </DropdownList>
                                            </Dropdown>
                                        </DataListAction>
                                    </DataListItemRow>
                                </DataListItem>
                            ))}
                        </DataList>
                    )}
                </div>
            </ExpandablePanel>

            {/* Security Requirements Section */}
            <ExpandablePanel
                title="Security Requirements"
                nodePath="/security"
                isExpanded={isRequirementsExpanded}
                onToggle={setIsRequirementsExpanded}
                className="main-form__section"
                actions={
                    <>
                        <Button
                            variant="plain"
                            icon={<PlusIcon />}
                            onClick={handleCreateSecurityRequirement}
                            aria-label="Add security requirement"
                        />
                        <Button
                            variant="plain"
                            icon={<TrashIcon />}
                            onClick={handleDeleteAllSecurityRequirements}
                            isDisabled={securityRequirements.length === 0}
                            aria-label="Delete all security requirements"
                            isDanger
                        />
                    </>
                }
            >
                <div className="main-form__sectionbody">
                    {securityRequirements.length === 0 ? (
                        <p style={{ color: 'var(--pf-v6-global--Color--200)', fontStyle: 'italic' }}>
                            No security requirements defined. Use the + icon to create one.
                        </p>
                    ) : (
                        <DataList
                            aria-label="Security requirements list"
                            isCompact
                            selectedDataListItemId=""
                        >
                            {securityRequirements.map((requirement, index) => {
                                const { schemes, scopes } = getRequirementDisplayText(requirement);
                                return (
                                    <DataListItem
                                        key={index}
                                        id={`requirement-${index}`}
                                        data-path={NodePathUtil.createNodePath(requirement).toString()}
                                        data-selectable="true"
                                    >
                                        <DataListItemRow>
                                            <DataListItemCells
                                                dataListCells={[
                                                    <DataListCell key="schemes">
                                                        <div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                                {schemes.map(schemeName => (
                                                                    <Label key={schemeName} color="blue">
                                                                        {schemeName}
                                                                    </Label>
                                                                ))}
                                                            </div>
                                                            {scopes.length > 0 && (
                                                                <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)', marginTop: '0.25rem' }}>
                                                                    Scopes: {scopes.join(', ')}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </DataListCell>
                                                ]}
                                            />
                                            <DataListAction
                                                aria-labelledby={`requirement-actions-${index}`}
                                                id={`requirement-actions-${index}`}
                                                aria-label="Security requirement actions"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Dropdown
                                                    isOpen={openRequirementDropdownIndex === index}
                                                    onSelect={() => setOpenRequirementDropdownIndex(null)}
                                                    onOpenChange={(isOpen: boolean) => setOpenRequirementDropdownIndex(isOpen ? index : null)}
                                                    popperProps={{ position: 'right' }}
                                                    toggle={(toggleRef) => (
                                                        <MenuToggle
                                                            ref={toggleRef}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenRequirementDropdownIndex(openRequirementDropdownIndex === index ? null : index);
                                                            }}
                                                            variant="plain"
                                                            aria-label={`Actions for security requirement ${index}`}
                                                        >
                                                            <EllipsisVIcon />
                                                        </MenuToggle>
                                                    )}
                                                >
                                                    <DropdownList>
                                                        <DropdownItem
                                                            key="edit"
                                                            onClick={() => handleEditSecurityRequirement(index)}
                                                        >
                                                            Edit requirement
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            key="delete"
                                                            onClick={() => handleDeleteSecurityRequirement(index)}
                                                        >
                                                            Delete requirement
                                                        </DropdownItem>
                                                    </DropdownList>
                                                </Dropdown>
                                            </DataListAction>
                                        </DataListItemRow>
                                    </DataListItem>
                                );
                            })}
                        </DataList>
                    )}
                </div>
            </ExpandablePanel>

            {/* Modals */}
            <NewSecuritySchemeModal
                isOpen={isNewSchemeModalOpen}
                onClose={() => setIsNewSchemeModalOpen(false)}
                onConfirm={handleConfirmNewSecurityScheme}
            />
        </>
    );
};

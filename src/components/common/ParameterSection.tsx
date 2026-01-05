/**
 * Reusable component for displaying a section of parameters (query, header, cookie, path)
 */

import React, { useState } from 'react';
import {
    Button,
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells,
    DataListCell,
    DataListAction,
    Dropdown,
    DropdownItem,
    DropdownList,
    Label,
    MenuToggle,
} from '@patternfly/react-core';
import { EllipsisVIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { ExpandablePanel } from './ExpandablePanel';

export interface ParameterSectionProps {
    /**
     * The title of the section (e.g., "Query Parameters")
     */
    title: string;

    /**
     * The location/type of parameters (e.g., "query", "header", "cookie", "path")
     */
    location: string;

    /**
     * Whether the section is expanded
     */
    isExpanded: boolean;

    /**
     * Callback when the section is toggled
     */
    onToggle: (expanded: boolean) => void;

    /**
     * Array of parameters to display
     */
    parameters: any[];

    /**
     * Optional callback when the add parameter button is clicked
     */
    onAddParameter?: () => void;

    /**
     * Optional callback when a parameter edit is requested
     */
    onEditParameter?: (parameter: any, index: number) => void;

    /**
     * Optional callback when a parameter delete is requested
     */
    onDeleteParameter?: (parameter: any, index: number) => void;
}

/**
 * Component for displaying a section of parameters
 */
export const ParameterSection: React.FC<ParameterSectionProps> = ({
    title,
    location,
    isExpanded,
    onToggle,
    parameters,
    onAddParameter,
    onEditParameter,
    onDeleteParameter,
}) => {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

    return (
        <ExpandablePanel
            title={title}
            isExpanded={isExpanded}
            onToggle={onToggle}
            className="parameter-section"
            badgeCount={parameters.length > 0 ? parameters.length : undefined}
            actions={
                <Button
                    variant="plain"
                    aria-label={`Add ${location} parameter`}
                    icon={<PlusCircleIcon />}
                    style={{ minWidth: 'auto', padding: '0.25rem' }}
                    onClick={onAddParameter}
                />
            }
        >
            <div className="path-form__sectionbody">
                {parameters.length === 0 ? (
                    <p style={{ color: 'var(--pf-v6-global--Color--200)', fontStyle: 'italic' }}>
                        No {location} parameters defined. Use the + icon to create one.
                    </p>
                ) : (
                    <DataList
                        aria-label={`${location} parameters list`}
                        isCompact
                        selectedDataListItemId=""
                        onSelectableRowChange={(_evt, idx) => {idx}}
                        onSelectDataListItem={(_evt, idx) => {idx}}
                    >
                        {parameters.map((param: any, index: number) => {
                            const paramName = param.getName?.() || param.name || 'Unnamed';
                            const paramRequired = param.getRequired?.() || param.required || false;
                            const paramType = param.getSchema?.()?.getType?.() || param.schema?.type || 'string';
                            const paramDescription = param.getDescription?.() || param.description || '';
                            const dropdownId = `${location}-${index}`;

                            return (
                                <DataListItem key={index} id={`${index}`}>
                                    <DataListItemRow>
                                        <DataListItemCells
                                            dataListCells={[
                                                <DataListCell key="parameter-info">
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <strong>{paramName}</strong>
                                                            <Label isCompact color="grey">{paramType}</Label>
                                                            {paramRequired && (
                                                                <Label isCompact color="orange">required</Label>
                                                            )}
                                                        </div>
                                                        {paramDescription && (
                                                            <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)', marginTop: '0.25rem' }}>
                                                                {paramDescription}
                                                            </div>
                                                        )}
                                                    </div>
                                                </DataListCell>
                                            ]}
                                        />
                                        <DataListAction
                                            aria-labelledby={`parameter-action-${index}`}
                                            id={`parameter-action-${index}`}
                                            aria-label="Parameter actions"
                                        >
                                            <Dropdown
                                                isOpen={openDropdownId === dropdownId}
                                                onSelect={() => setOpenDropdownId(null)}
                                                onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? dropdownId : null)}
                                                popperProps={{ position: 'right' }}
                                                toggle={(toggleRef) => (
                                                    <MenuToggle
                                                        ref={toggleRef}
                                                        aria-label="Parameter kebab menu"
                                                        variant="plain"
                                                        onClick={() => setOpenDropdownId(openDropdownId === dropdownId ? null : dropdownId)}
                                                        isExpanded={openDropdownId === dropdownId}
                                                    >
                                                        <EllipsisVIcon />
                                                    </MenuToggle>
                                                )}
                                                shouldFocusToggleOnSelect
                                            >
                                                <DropdownList>
                                                    <DropdownItem
                                                        key="edit"
                                                        onClick={() => {
                                                            if (onEditParameter) {
                                                                onEditParameter(param, index);
                                                            }
                                                            setOpenDropdownId(null);
                                                        }}
                                                    >
                                                        Edit parameter
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        onClick={() => {
                                                            if (onDeleteParameter) {
                                                                onDeleteParameter(param, index);
                                                            }
                                                            setOpenDropdownId(null);
                                                        }}
                                                    >
                                                        Delete parameter
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
    );
};

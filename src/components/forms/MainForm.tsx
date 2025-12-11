/**
 * Main/Info form for editing API metadata
 */

import React, { useState } from 'react';
import "./MainForm.css";
import {
    Form,
    Title,
    Button,
    DataList,
    DataListItem,
    DataListItemRow,
    DataListItemCells,
    DataListCell,
    DataListAction,
    Dropdown,
    DropdownList,
    DropdownItem,
    MenuToggle
} from '@patternfly/react-core';
import { PlusIcon, TrashIcon, EllipsisVIcon, TagIcon } from '@patternfly/react-icons';
import { useDocument } from '@hooks/useDocument';
import { useCommand } from '@hooks/useCommand';
import { Node, OpenApiDocument, Tag } from '@apicurio/data-models';
import { PropertyInput } from '@components/common/PropertyInput';
import { ExpandablePanel } from '@components/common/ExpandablePanel';
import { NewTagModal } from '@components/modals/NewTagModal';
import { RenameTagModal } from '@components/modals/RenameTagModal';
import { CompositeCommand } from "@commands/CompositeCommand.ts";
import { EnsureInfoCommand } from "@commands/EnsureInfoCommand.ts";
import { ChangePropertyCommand } from "@commands/ChangePropertyCommand.ts";
import { EnsureContactCommand } from "@commands/EnsureContactCommand.ts";
import { ICommand } from "@commands/ICommand.ts";
import { EnsureLicenseCommand } from "@commands/EnsureLicenseCommand.ts";
import { AddTagCommand } from "@commands/AddTagCommand.ts";
import { DeleteAllTagsCommand } from "@commands/DeleteAllTagsCommand.ts";
import { DeleteTagCommand } from "@commands/DeleteTagCommand.ts";
import { RenameTagCommand } from "@commands/RenameTagCommand.ts";

/**
 * Main form component for editing API info
 */

export const MainForm: React.FC = () => {
    const { document } = useDocument();
    const { executeCommand } = useCommand();
    const [isInfoExpanded, setIsInfoExpanded] = useState(true);
    const [isContactExpanded, setIsContactExpanded] = useState(true);
    const [isLicenseExpanded, setIsLicenseExpanded] = useState(true);
    const [isTagsExpanded, setIsTagsExpanded] = useState(true);
    const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [renameTagName, setRenameTagName] = useState<string | null>(null);

    if (!document) {
        return <div>No document loaded</div>;
    }

    const oaiDoc = document as OpenApiDocument;
    const info = oaiDoc.getInfo();
    const contact = info ? info.getContact() : null;
    const license = info ? info.getLicense() : null;
    const tags = oaiDoc.getTags() || [];

    const ChangeInfoPropertyCommandFactory = (_model: Node, propertyName: string, value: string, description: string): ICommand => {
        return new CompositeCommand([
            new EnsureInfoCommand(),
            new ChangePropertyCommand("/info", propertyName, value)
        ], description)
    };

    const ChangeContactPropertyCommandFactory = (_model: Node, propertyName: string, value: string, description: string): ICommand => {
        return new CompositeCommand([
            new EnsureInfoCommand(),
            new EnsureContactCommand(),
            new ChangePropertyCommand("/info/contact", propertyName, value)
        ], description)
    };

    const ChangeLicensePropertyCommandFactory = (_model: Node, propertyName: string, value: string, description: string): ICommand => {
        return new CompositeCommand([
            new EnsureInfoCommand(),
            new EnsureLicenseCommand(),
            new ChangePropertyCommand("/info/license", propertyName, value)
        ], description)
    };

    /**
     * Handle creating a new tag
     */
    const handleCreateTag = (tagName: string, tagDescription: string) => {
        const command = new AddTagCommand(tagName, tagDescription);
        executeCommand(command, `Add tag "${tagName}"`);
    };

    /**
     * Handle deleting all tags
     */
    const handleDeleteAllTags = () => {
        const command = new DeleteAllTagsCommand();
        executeCommand(command, 'Delete all tags');
    };

    /**
     * Handle deleting a specific tag
     */
    const handleDeleteTag = (tagName: string) => {
        const command = new DeleteTagCommand(tagName);
        executeCommand(command, `Delete tag "${tagName}"`);
        setOpenDropdownIndex(null);
    };

    /**
     * Handle opening rename modal for a tag
     */
    const handleOpenRenameModal = (tagName: string) => {
        setRenameTagName(tagName);
        setOpenDropdownIndex(null);
    };

    /**
     * Handle renaming a tag
     */
    const handleRenameTag = (newName: string) => {
        if (renameTagName) {
            const command = new RenameTagCommand(renameTagName, newName);
            executeCommand(command, `Rename tag "${renameTagName}" to "${newName}"`);
        }
    };

    return (
        <div>
            <Title headingLevel="h2" size="xl">
                API Information
            </Title>
            <p style={{ marginBottom: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Edit the basic information about your API
            </p>

            <ExpandablePanel
                title="API Info"
                isExpanded={isInfoExpanded}
                onToggle={setIsInfoExpanded}
                className="main-form__section"
            >
                <Form className="main-form__sectionbody">
                    <PropertyInput
                        model={info!}
                        propertyName="title"
                        label="Title"
                        commandFactory={ChangeInfoPropertyCommandFactory}
                    />

                    <PropertyInput
                        model={info!}
                        propertyName="version"
                        label="Version"
                        commandFactory={ChangeInfoPropertyCommandFactory}
                    />

                    <PropertyInput
                        model={info!}
                        propertyName="description"
                        label="Description"
                        type="textarea"
                        commandFactory={ChangeInfoPropertyCommandFactory}
                    />

                    <PropertyInput
                        model={info!}
                        propertyName="termsOfService"
                        label="Terms of Service"
                        placeholder="URL to terms of service"
                        commandFactory={ChangeInfoPropertyCommandFactory}
                    />
                </Form>
            </ExpandablePanel>

            <ExpandablePanel
                title="Contact Information"
                isExpanded={isContactExpanded}
                onToggle={setIsContactExpanded}
                className="main-form__section"
            >
                <Form className="main-form__sectionbody">
                    <PropertyInput
                        model={contact}
                        propertyName="name"
                        label="Contact Name"
                        placeholder="API contact person or team"
                        commandFactory={ChangeContactPropertyCommandFactory}
                    />

                    <PropertyInput
                        model={contact}
                        propertyName="url"
                        label="Contact URL"
                        placeholder="URL for contact information"
                        commandFactory={ChangeContactPropertyCommandFactory}
                    />

                    <PropertyInput
                        model={contact}
                        propertyName="email"
                        label="Contact Email"
                        placeholder="email@example.com"
                        commandFactory={ChangeContactPropertyCommandFactory}
                    />
                </Form>
            </ExpandablePanel>

            <ExpandablePanel
                title="License"
                isExpanded={isLicenseExpanded}
                onToggle={setIsLicenseExpanded}
                className="main-form__section"
            >
                <Form className="main-form__sectionbody">
                    <PropertyInput
                        model={license}
                        propertyName="name"
                        label="License Name"
                        placeholder="e.g., Apache 2.0, MIT"
                        commandFactory={ChangeLicensePropertyCommandFactory}
                    />

                    <PropertyInput
                        model={license}
                        propertyName="url"
                        label="License URL"
                        placeholder="URL to license text"
                        commandFactory={ChangeLicensePropertyCommandFactory}
                    />
                </Form>
            </ExpandablePanel>

            <ExpandablePanel
                title="Tag Definitions"
                isExpanded={isTagsExpanded}
                onToggle={setIsTagsExpanded}
                className="main-form__section"
                actions={
                    <>
                        <Button
                            variant="plain"
                            icon={<PlusIcon />}
                            onClick={() => setIsNewTagModalOpen(true)}
                            aria-label="Add tag"
                        />
                        <Button
                            variant="plain"
                            icon={<TrashIcon />}
                            onClick={handleDeleteAllTags}
                            isDisabled={tags.length === 0}
                            aria-label="Delete all tags"
                            isDanger
                        />
                    </>
                }
            >
                <div className="main-form__sectionbody">
                    {tags.length === 0 ? (
                        <p style={{ color: 'var(--pf-v6-global--Color--200)', fontStyle: 'italic' }}>
                            No tags defined. Use the + icon to create one.
                        </p>
                    ) : (
                        <DataList aria-label="Tag definitions list" isCompact>
                            {tags.map((tag: Tag, index: number) => (
                                <DataListItem key={index}>
                                    <DataListItemRow>
                                        <DataListItemCells
                                            dataListCells={[
                                                <DataListCell key="name">
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <TagIcon style={{ color: '#666' }} />
                                                            <strong>{tag.getName()}</strong>
                                                        </div>
                                                        {tag.getDescription() && (
                                                            <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)', marginTop: '0.25rem' }}>
                                                                {tag.getDescription()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </DataListCell>
                                            ]}
                                        />
                                        <DataListAction
                                            aria-labelledby={`tag-actions-${index}`}
                                            id={`tag-actions-${index}`}
                                            aria-label="Tag actions"
                                        >
                                            <Dropdown
                                                isOpen={openDropdownIndex === index}
                                                onSelect={() => setOpenDropdownIndex(null)}
                                                onOpenChange={(isOpen: boolean) => setOpenDropdownIndex(isOpen ? index : null)}
                                                popperProps={{ position: 'right' }}
                                                toggle={(toggleRef) => (
                                                    <MenuToggle
                                                        ref={toggleRef}
                                                        onClick={() => setOpenDropdownIndex(openDropdownIndex === index ? null : index)}
                                                        variant="plain"
                                                        aria-label={`Actions for tag ${tag.getName()}`}
                                                    >
                                                        <EllipsisVIcon />
                                                    </MenuToggle>
                                                )}
                                            >
                                                <DropdownList>
                                                    <DropdownItem
                                                        key="rename"
                                                        onClick={() => handleOpenRenameModal(tag.getName())}
                                                    >
                                                        Rename tag
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        onClick={() => handleDeleteTag(tag.getName())}
                                                    >
                                                        Delete tag
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

            <NewTagModal
                isOpen={isNewTagModalOpen}
                onClose={() => setIsNewTagModalOpen(false)}
                onConfirm={handleCreateTag}
            />

            <RenameTagModal
                isOpen={renameTagName !== null}
                currentName={renameTagName || ''}
                onClose={() => setRenameTagName(null)}
                onConfirm={handleRenameTag}
            />

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are saved when you press Enter or when a field loses focus. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

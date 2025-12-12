/**
 * Main/Info form for editing API metadata
 */

import React, {useState} from 'react';
import "./MainForm.css";
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
    Form,
    MenuToggle,
    Title
} from '@patternfly/react-core';
import {EllipsisVIcon, PlusIcon, ServerIcon, TagIcon, TrashIcon} from '@patternfly/react-icons';
import {useDocument} from '@hooks/useDocument';
import {useCommand} from '@hooks/useCommand';
import {
    Node,
    OpenApi30Document,
    OpenApi30Server,
    OpenApiDocument,
    OpenApiServer,
    Server,
    ServerVariable,
    Tag
} from '@apicurio/data-models';
import {PropertyInput} from '@components/common/PropertyInput';
import {ExpandablePanel} from '@components/common/ExpandablePanel';
import {ServerUrl} from '@components/common/ServerUrl';
import {NewTagModal} from '@components/modals/NewTagModal';
import {RenameTagModal} from '@components/modals/RenameTagModal';
import {EditTagDescriptionModal} from '@components/modals/EditTagDescriptionModal';
import {NewServerModal} from '@components/modals/NewServerModal';
import {EditServerModal, ServerVariableData} from '@components/modals/EditServerModal';
import {CompositeCommand} from "@commands/CompositeCommand.ts";
import {EnsureInfoCommand} from "@commands/EnsureInfoCommand.ts";
import {ChangePropertyCommand} from "@commands/ChangePropertyCommand.ts";
import {EnsureContactCommand} from "@commands/EnsureContactCommand.ts";
import {ICommand} from "@commands/ICommand.ts";
import {EnsureLicenseCommand} from "@commands/EnsureLicenseCommand.ts";
import {AddTagCommand} from "@commands/AddTagCommand.ts";
import {DeleteAllTagsCommand} from "@commands/DeleteAllTagsCommand.ts";
import {DeleteTagCommand} from "@commands/DeleteTagCommand.ts";
import {RenameTagCommand} from "@commands/RenameTagCommand.ts";
import {AddServerCommand} from "@commands/AddServerCommand.ts";
import {DeleteServerCommand} from "@commands/DeleteServerCommand.ts";
import {DeleteAllServersCommand} from "@commands/DeleteAllServersCommand.ts";

/**
 * Main form component for editing API info
 */

export const MainForm: React.FC = () => {
    const { document } = useDocument();
    const { executeCommand } = useCommand();
    const [isInfoExpanded, setIsInfoExpanded] = useState(true);
    const [isContactExpanded, setIsContactExpanded] = useState(true);
    const [isLicenseExpanded, setIsLicenseExpanded] = useState(true);
    const [isServersExpanded, setIsServersExpanded] = useState(true);
    const [isTagsExpanded, setIsTagsExpanded] = useState(true);
    const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);
    const [isNewServerModalOpen, setIsNewServerModalOpen] = useState(false);
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [openServerDropdownIndex, setOpenServerDropdownIndex] = useState<number | null>(null);
    const [renameTagName, setRenameTagName] = useState<string | null>(null);
    const [editTagName, setEditTagName] = useState<string | null>(null);
    const [editTagDescription, setEditTagDescription] = useState<string>('');
    const [editServerUrl, setEditServerUrl] = useState<string | null>(null);
    const [editServerDescription, setEditServerDescription] = useState<string>('');
    const [editServerVariables, setEditServerVariables] = useState<ServerVariableData[]>([]);

    if (!document) {
        return <div>No document loaded</div>;
    }

    const oaiDoc = document as OpenApiDocument;
    const info = oaiDoc.getInfo();
    const contact = info ? info.getContact() : null;
    const license = info ? info.getLicense() : null;
    const servers = (oaiDoc as OpenApi30Document).getServers() || [];
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
     * Get a server by URL
     */
    const getServer = (serverUrl: string): Server => {
        const foundServer = servers.find((s: OpenApiServer) => s.getUrl() === serverUrl);
        if (!foundServer) {
            throw new Error(`Server not found: ${serverUrl}`);
        }
        return foundServer as Server;
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

    /**
     * Handle opening edit description modal for a tag
     */
    const handleOpenEditDescriptionModal = (tagIndex: string) => {
        const tag = oaiDoc.getTags()[parseInt(tagIndex)];
        setEditTagName(tag.getName());
        setEditTagDescription(tag.getDescription() || '');
    };

    /**
     * Handle changing tag description
     */
    const handleChangeTagDescription = (newDescription: string) => {
        if (editTagName) {
            // Find the tag node
            const tag = tags.find((t: Tag) => t.getName() === editTagName);
            if (tag) {
                const command = new ChangePropertyCommand(tag, 'description', newDescription);
                executeCommand(command, `Change description for tag "${editTagName}"`);
            }
        }
        setEditTagName(null);
        setEditTagDescription('');
    };

    /**
     * Handle creating a new server
     */
    const handleCreateServer = (serverUrl: string, serverDescription: string) => {
        const command = new AddServerCommand(serverUrl, serverDescription);
        executeCommand(command, `Add server "${serverUrl}"`);
    };

    /**
     * Handle deleting all servers
     */
    const handleDeleteAllServers = () => {
        const command = new DeleteAllServersCommand();
        executeCommand(command, 'Delete all servers');
    };

    /**
     * Handle deleting a specific server
     */
    const handleDeleteServer = (serverUrl: string) => {
        const command = new DeleteServerCommand(serverUrl);
        executeCommand(command, `Delete server "${serverUrl}"`);
        setOpenServerDropdownIndex(null);
    };

    /**
     * Handle opening edit server modal
     */
    const handleOpenEditServerModal = (serverIndex: string) => {
        const server = (oaiDoc as OpenApi30Document).getServers()[parseInt(serverIndex)] as OpenApi30Server;
        setEditServerUrl(server.getUrl());
        setEditServerDescription(server.getDescription() || '');

        // Extract server variables
        const variables: ServerVariableData[] = [];
        const serverVariables = server.getVariables();
        if (serverVariables) {
            for (const varName of Object.keys(serverVariables)) {
                const variable = serverVariables[varName] as ServerVariable;
                variables.push({
                    variable: variable,
                    name: varName,
                    default: variable.getDefault() || '',
                    description: variable.getDescription() || ''
                });
            }
        }
        setEditServerVariables(variables);
    };

    /**
     * Handle updating server
     */
    const handleUpdateServer = (description: string, variables: ServerVariableData[]) => {
        if (editServerUrl) {
            // Create a composite command that will do the following:
            // 1. Update the Server description
            // 2. Update the default value and description for every server variable
            const server: Server = getServer(editServerUrl);
            const commands = [
                new ChangePropertyCommand(server, 'description', description)
            ];
            if (variables) {
                variables.forEach((variable) => {
                    commands.push(new ChangePropertyCommand(variable.variable, 'description', variable.description));
                    commands.push(new ChangePropertyCommand(variable.variable, 'default', variable.default));
                })
            }

            const commandDescription = `Update server "${editServerUrl}"`;
            const command = new CompositeCommand(commands, commandDescription);
            executeCommand(command, commandDescription);
        }
        setEditServerUrl(null);
        setEditServerDescription('');
        setEditServerVariables([]);
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
                title="Servers"
                isExpanded={isServersExpanded}
                onToggle={setIsServersExpanded}
                className="main-form__section"
                actions={
                    <>
                        <Button
                            variant="plain"
                            icon={<PlusIcon />}
                            onClick={() => setIsNewServerModalOpen(true)}
                            aria-label="Add server"
                        />
                        <Button
                            variant="plain"
                            icon={<TrashIcon />}
                            onClick={handleDeleteAllServers}
                            isDisabled={servers.length === 0}
                            aria-label="Delete all servers"
                            isDanger
                        />
                    </>
                }
            >
                <div className="main-form__sectionbody">
                    {servers.length === 0 ? (
                        <p style={{ color: 'var(--pf-v6-global--Color--200)', fontStyle: 'italic' }}>
                            No servers defined. Use the + icon to create one.
                        </p>
                    ) : (
                        <DataList
                            aria-label="Servers list"
                            isCompact
                            selectedDataListItemId=""
                            onSelectableRowChange={(_evt, idx) => handleOpenEditServerModal(idx)}
                            onSelectDataListItem={(_evt, idx) => handleOpenEditServerModal(idx)}
                        >
                            {servers.map((server: OpenApiServer, index: number) => (
                                <DataListItem key={index} id={`${index}`}>
                                    <DataListItemRow>
                                        <DataListItemCells
                                            dataListCells={[
                                                <DataListCell key="url">
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            <ServerIcon style={{ color: '#666' }} />
                                                            <strong>
                                                                <ServerUrl url={server.getUrl()} />
                                                            </strong>
                                                        </div>
                                                        {server.getDescription() && (
                                                            <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)', marginTop: '0.25rem' }}>
                                                                {server.getDescription()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </DataListCell>
                                            ]}
                                        />
                                        <DataListAction
                                            aria-labelledby={`server-actions-${index}`}
                                            id={`server-actions-${index}`}
                                            aria-label="Server actions"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Dropdown
                                                isOpen={openServerDropdownIndex === index}
                                                onSelect={() => setOpenServerDropdownIndex(null)}
                                                onOpenChange={(isOpen: boolean) => setOpenServerDropdownIndex(isOpen ? index : null)}
                                                popperProps={{ position: 'right' }}
                                                toggle={(toggleRef) => (
                                                    <MenuToggle
                                                        ref={toggleRef}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenServerDropdownIndex(openServerDropdownIndex === index ? null : index);
                                                        }}
                                                        variant="plain"
                                                        aria-label={`Actions for server ${server.getUrl()}`}
                                                    >
                                                        <EllipsisVIcon />
                                                    </MenuToggle>
                                                )}
                                            >
                                                <DropdownList>
                                                    <DropdownItem
                                                        key="edit"
                                                        onClick={() => {
                                                            handleOpenEditServerModal(`${index}`);
                                                            setOpenServerDropdownIndex(null);
                                                        }}
                                                    >
                                                        Edit server
                                                    </DropdownItem>
                                                    <DropdownItem
                                                        key="delete"
                                                        onClick={() => handleDeleteServer(server.getUrl())}
                                                    >
                                                        Delete server
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
                        <DataList
                            aria-label="Tag definitions list"
                            isCompact
                            selectedDataListItemId=""
                            onSelectableRowChange={(_evt, idx) => handleOpenEditDescriptionModal(idx)}
                            onSelectDataListItem={(_evt, idx) => handleOpenEditDescriptionModal(idx)}
                        >
                            {tags.map((tag: Tag, index: number) => (
                                <DataListItem key={index} id={`${index}`}>
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
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <Dropdown
                                                isOpen={openDropdownIndex === index}
                                                onSelect={() => setOpenDropdownIndex(null)}
                                                onOpenChange={(isOpen: boolean) => setOpenDropdownIndex(isOpen ? index : null)}
                                                popperProps={{ position: 'right' }}
                                                toggle={(toggleRef) => (
                                                    <MenuToggle
                                                        ref={toggleRef}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setOpenDropdownIndex(openDropdownIndex === index ? null : index);
                                                        }}
                                                        variant="plain"
                                                        aria-label={`Actions for tag ${tag.getName()}`}
                                                    >
                                                        <EllipsisVIcon />
                                                    </MenuToggle>
                                                )}
                                            >
                                                <DropdownList>
                                                    <DropdownItem
                                                        key="edit"
                                                        onClick={() => {
                                                            handleOpenEditDescriptionModal(`${index}`);
                                                            setOpenDropdownIndex(null);
                                                        }}
                                                    >
                                                        Edit description
                                                    </DropdownItem>
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

            <NewServerModal
                isOpen={isNewServerModalOpen}
                onClose={() => setIsNewServerModalOpen(false)}
                onConfirm={handleCreateServer}
            />

            <EditServerModal
                isOpen={editServerUrl !== null}
                serverUrl={editServerUrl || ''}
                currentDescription={editServerDescription}
                variables={editServerVariables}
                onClose={() => {
                    setEditServerUrl(null);
                    setEditServerDescription('');
                    setEditServerVariables([]);
                }}
                onConfirm={handleUpdateServer}
            />

            <RenameTagModal
                isOpen={renameTagName !== null}
                currentName={renameTagName || ''}
                onClose={() => setRenameTagName(null)}
                onConfirm={handleRenameTag}
            />

            <EditTagDescriptionModal
                isOpen={editTagName !== null}
                tagName={editTagName || ''}
                currentDescription={editTagDescription}
                onClose={() => {
                    setEditTagName(null);
                    setEditTagDescription('');
                }}
                onConfirm={handleChangeTagDescription}
            />

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are saved when you press Enter or when a field loses focus. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

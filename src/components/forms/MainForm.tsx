/**
 * Main/Info form for editing API metadata
 */

import React, { useState } from 'react';
import "./MainForm.css";
import {
    Form,
    Title
} from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';
import { Node, OpenApiDocument } from '@apicurio/data-models';
import { PropertyInput } from '@components/common/PropertyInput';
import { ExpandablePanel } from '@components/common/ExpandablePanel';
import { CompositeCommand } from "@commands/CompositeCommand.ts";
import { EnsureInfoCommand } from "@commands/EnsureInfoCommand.ts";
import { ChangePropertyCommand } from "@commands/ChangePropertyCommand.ts";
import { EnsureContactCommand } from "@commands/EnsureContactCommand.ts";
import { ICommand } from "@commands/ICommand.ts";
import { EnsureLicenseCommand } from "@commands/EnsureLicenseCommand.ts";

/**
 * Main form component for editing API info
 */

export const MainForm: React.FC = () => {
    const { document } = useDocument();
    const [isInfoExpanded, setIsInfoExpanded] = useState(true);
    const [isContactExpanded, setIsContactExpanded] = useState(true);
    const [isLicenseExpanded, setIsLicenseExpanded] = useState(true);

    if (!document) {
        return <div>No document loaded</div>;
    }

    const oaiDoc = document as OpenApiDocument;
    const info = oaiDoc.getInfo();
    const contact = info ? info.getContact() : null;
    const license = info ? info.getLicense() : null;

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

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are saved when you press Enter or when a field loses focus. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

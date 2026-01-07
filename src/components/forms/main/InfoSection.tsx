/**
 * Info section for editing API information
 */

import React, { useState } from 'react';
import { Form } from '@patternfly/react-core';
import { Node, NodePathUtil, OpenApiDocument } from '@apicurio/data-models';
import { useDocument } from '@hooks/useDocument';
import { PropertyInput } from '@components/common/PropertyInput';
import { ExpandablePanel } from '@components/common/ExpandablePanel';
import { CompositeCommand } from '@commands/CompositeCommand';
import { EnsureChildNodeCommand } from '@commands/EnsureChildNodeCommand';
import { ChangePropertyCommand } from '@commands/ChangePropertyCommand';
import { ICommand } from '@commands/ICommand';

/**
 * Info section component for editing API information
 */
export const InfoSection: React.FC = () => {
    const { document } = useDocument();
    const [isExpanded, setIsExpanded] = useState(true);

    if (!document) {
        return null;
    }

    const oaiDoc = document as OpenApiDocument;
    const info = oaiDoc.getInfo();

    /**
     * Command factory for changing info properties
     * Ensures the info node exists before changing properties
     */
    const ChangeInfoPropertyCommandFactory = (
        _model: Node,
        propertyName: string,
        value: string,
        description: string
    ): ICommand => {
        return new CompositeCommand([
            new EnsureChildNodeCommand(NodePathUtil.createNodePath(oaiDoc), "info"),
            new ChangePropertyCommand("/info", propertyName, value)
        ], description);
    };

    return (
        <ExpandablePanel
            title="API Info"
            nodePath="/info"
            isExpanded={isExpanded}
            onToggle={setIsExpanded}
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
    );
};

/**
 * License section for editing license information
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
 * License section component for editing license information
 */
export const LicenseSection: React.FC = () => {
    const { document } = useDocument();
    const [isExpanded, setIsExpanded] = useState(true);

    if (!document) {
        return null;
    }

    const oaiDoc = document as OpenApiDocument;
    const info = oaiDoc.getInfo();
    const license = info ? info.getLicense() : null;

    /**
     * Command factory for changing license properties
     * Ensures the info and license nodes exist before changing properties
     */
    const ChangeLicensePropertyCommandFactory = (
        _model: Node,
        propertyName: string,
        value: string,
        description: string
    ): ICommand => {
        return new CompositeCommand([
            new EnsureChildNodeCommand(NodePathUtil.createNodePath(oaiDoc), "info"),
            new EnsureChildNodeCommand(NodePathUtil.parseNodePath("/info"), "license"),
            new ChangePropertyCommand("/info/license", propertyName, value)
        ], description);
    };

    return (
        <ExpandablePanel
            title="License"
            nodePath="/info/license"
            isExpanded={isExpanded}
            onToggle={setIsExpanded}
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
    );
};

/**
 * Main/Info form for editing API metadata
 */

import React from 'react';
import "./MainForm.css";
import { Title } from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';
import { InfoSection } from '@components/forms/main/InfoSection';
import { ContactSection } from '@components/forms/main/ContactSection';
import { LicenseSection } from '@components/forms/main/LicenseSection';
import { ServersSection } from '@components/forms/main/ServersSection';
import { TagsSection } from '@components/forms/main/TagsSection';

/**
 * Main form component for editing API info
 */
export const MainForm: React.FC = () => {
    const { document, specVersion } = useDocument();

    if (!document) {
        return <div>No document loaded</div>;
    }

    return (
        <div>
            <Title headingLevel="h2" size="xl">
                API Information
            </Title>
            <p style={{ marginBottom: '1rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Edit the basic information about your API
            </p>

            <InfoSection />

            <ContactSection />

            <LicenseSection />

            {/* Servers section - only for OpenAPI 3.0 and 3.1 */}
            {specVersion !== '2.0' && (
                <ServersSection />
            )}

            <TagsSection />

            <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)' }}>
                Changes are saved when you press Enter or when a field loses focus. Use Undo/Redo buttons to revert changes.
            </p>
        </div>
    );
};

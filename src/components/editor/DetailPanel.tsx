/**
 * Detail panel for the detail section
 */

import React from 'react';
import { useSelection } from '@hooks/useSelection';
import { MainForm } from '@components/forms/MainForm';
import { PathForm } from '@components/forms/PathForm';
import { OperationForm } from '@components/forms/OperationForm';

/**
 * Detail panel component
 * Shows the appropriate form based on current selection
 */
export const DetailPanel: React.FC = () => {
    const { selectedPath, selectedType } = useSelection();

    /**
     * Render the appropriate form based on selection type
     */
    const renderForm = () => {
        // Default to main form when nothing selected or root selected
        if (!selectedPath || selectedPath === '/') {
            return <MainForm />;
        }

        // Route to appropriate form based on selection type
        switch (selectedType) {
            case 'path':
                return <PathForm />;
            case 'operation':
                return <OperationForm />;
            case 'schema':
                return <div>Schema form coming soon...</div>;
            case 'info':
                return <MainForm />;
            default:
                return <MainForm />;
        }
    };

    return <div style={{ padding: '1rem' }}>{renderForm()}</div>;
};

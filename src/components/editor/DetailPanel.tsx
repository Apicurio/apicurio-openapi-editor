/**
 * Detail panel for the detail section
 */

import React from 'react';
import { EditorMode } from './EditorToolbar';
import { useSelection } from '@hooks/useSelection';
import { MainForm } from '@components/forms/MainForm';
import { PathForm } from '@components/forms/PathForm';
import { SchemaForm } from '@components/forms/SchemaForm';
import { SourceForm } from '@components/forms/SourceForm';
import { useHighlightEffect } from "@hooks/useHighlightEffect.ts";

export interface DetailPanelProps {
    /**
     * Current editor mode (design or source)
     */
    editorMode?: EditorMode;
}

/**
 * Detail panel component
 * Shows the appropriate form or source code based on current selection and mode
 */
export const DetailPanel: React.FC<DetailPanelProps> = ({ editorMode = 'design' }) => {
    const { selectedPath, navigationObjectType } = useSelection();

    // Enable highlight effect
    useHighlightEffect();

    /**
     * Render the appropriate form based on selection type
     */
    const renderForm = () => {
        // Default to main form when nothing selected or root selected
        if (!selectedPath || selectedPath.toString() === '/') {
            return <MainForm />;
        }

        // Route to appropriate form based on selection type
        switch (navigationObjectType) {
            case 'pathItem':
                return <PathForm />;
            case 'schema':
                return <SchemaForm />;
            case 'info':
                return <MainForm />;
            default:
                return <MainForm />;
        }
    };

    return (
        <div style={{ padding: '1rem', height: '100%' }}>
            {editorMode === 'design' ? renderForm() : <SourceForm />}
        </div>
    );
};

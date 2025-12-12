/**
 * Detail panel for the detail section
 */

import React from 'react';
import { EditorMode } from './EditorToolbar';
import { useSelection } from '@hooks/useSelection';
import { MainForm } from '@components/forms/MainForm';
import { PathForm } from '@components/forms/PathForm';
import { SchemaForm } from '@components/forms/SchemaForm';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { useDocument } from '@hooks/useDocument';
import { Library } from '@apicurio/data-models';

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
    const { selectedPath, navigationObject, navigationObjectType } = useSelection();
    const { document } = useDocument();

    /**
     * Get the selected model as a JSON string
     */
    const getSelectedModelJSON = (): string => {
        // Use the navigation object if available, otherwise use the document
        const modelToSerialize = navigationObject || document;

        if (!modelToSerialize) {
            return '{}';
        }

        // Use Library.writeNodeToString() to convert the model to JSON
        const nodeObj = Library.writeNode(modelToSerialize);
        return JSON.stringify(nodeObj, null, 2);
    };

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

    /**
     * Render source code editor
     */
    const renderSourceEditor = () => {
        const jsonCode = getSelectedModelJSON();
        return (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CodeEditor
                    isReadOnly={false}
                    code={jsonCode}
                    language={Language.json}
                    height="100%"
                />
            </div>
        );
    };

    return (
        <div style={{ padding: '1rem', height: '100%' }}>
            {editorMode === 'design' ? renderForm() : renderSourceEditor()}
        </div>
    );
};

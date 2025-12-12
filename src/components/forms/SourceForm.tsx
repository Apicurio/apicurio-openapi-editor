/**
 * Source form for editing OpenAPI source code
 */

import React, { useState, useEffect, useRef } from 'react';
import {
    Button,
    Toolbar,
    ToolbarContent,
    ToolbarGroup,
    ToolbarItem,
    ToggleGroup,
    ToggleGroupItem,
} from '@patternfly/react-core';
import { CodeEditor, Language } from '@patternfly/react-code-editor';
import { useDocument } from '@hooks/useDocument';
import { useSelection } from '@hooks/useSelection';
import { Library } from '@apicurio/data-models';
import * as YAML from 'yaml';
import './SourceForm.css';

type SourceFormat = 'json' | 'yaml';

/**
 * Source form component for editing OpenAPI source code
 */
export const SourceForm: React.FC = () => {
    const { document } = useDocument();
    const { navigationObject } = useSelection();

    // Track the current format (JSON or YAML)
    const [format, setFormat] = useState<SourceFormat>('json');

    // Track the original source code
    const [originalSource, setOriginalSource] = useState<string>('');

    // Track the current edited source code
    const [currentSource, setCurrentSource] = useState<string>('');

    // Track dirty state
    const [isDirty, setIsDirty] = useState<boolean>(false);

    // Track validity state
    const [isValid, setIsValid] = useState<boolean>(true);

    // Debounce timer for validation
    const validationTimerRef = useRef<number | null>(null);

    /**
     * Get the selected model as a JSON string
     */
    const getSelectedModelJSON = (): string => {
        // Use the navigation object if available, otherwise use the document
        const modelToSerialize = navigationObject || document;

        if (!modelToSerialize) {
            return '{}';
        }

        // Use Library.writeNode() to convert the model to JSON
        const nodeObj = Library.writeNode(modelToSerialize);
        return JSON.stringify(nodeObj, null, 2);
    };

    /**
     * Get the selected model as a YAML string
     */
    const getSelectedModelYAML = (): string => {
        // Use the navigation object if available, otherwise use the document
        const modelToSerialize = navigationObject || document;

        if (!modelToSerialize) {
            return '';
        }

        // Use Library.writeNode() to convert the model to an object
        const nodeObj = Library.writeNode(modelToSerialize);

        // Convert to YAML string
        return YAML.stringify(nodeObj, { indent: 2 });
    };

    /**
     * Get the source code in the current format
     */
    const getSourceInFormat = (sourceFormat: SourceFormat): string => {
        return sourceFormat === 'json' ? getSelectedModelJSON() : getSelectedModelYAML();
    };

    /**
     * Validate source code based on current format
     */
    const validateSource = (source: string, sourceFormat: SourceFormat): boolean => {
        if (!source.trim()) {
            return false;
        }

        try {
            if (sourceFormat === 'json') {
                JSON.parse(source);
            } else {
                YAML.parse(source);
            }
            return true;
        } catch (error) {
            return false;
        }
    };

    /**
     * Convert source from one format to another
     */
    const convertFormat = (source: string, fromFormat: SourceFormat, toFormat: SourceFormat): string => {
        try {
            let obj: any;

            // Parse from current format
            if (fromFormat === 'json') {
                obj = JSON.parse(source);
            } else {
                obj = YAML.parse(source);
            }

            // Convert to target format
            if (toFormat === 'json') {
                return JSON.stringify(obj, null, 2);
            } else {
                return YAML.stringify(obj, { indent: 2 });
            }
        } catch (error) {
            // If conversion fails, return the original source
            return source;
        }
    };

    /**
     * Initialize source code when document or navigation object changes
     * Note: We do NOT include 'format' in the dependency array because format changes
     * are handled by handleFormatChange, which converts the current editor contents
     */
    useEffect(() => {
        // Clear any pending validation
        if (validationTimerRef.current !== null) {
            clearTimeout(validationTimerRef.current);
            validationTimerRef.current = null;
        }

        const source = getSourceInFormat(format);
        setOriginalSource(source);
        setCurrentSource(source);
        setIsDirty(false);
        setIsValid(true);
    }, [document, navigationObject]);

    /**
     * Handle source code changes in the editor
     * Updates the editor immediately but debounces validation and dirty checking
     */
    const handleSourceChange = (value: string) => {
        // Update the editor content immediately for responsive typing
        setCurrentSource(value);

        // Clear any existing validation timer
        if (validationTimerRef.current !== null) {
            clearTimeout(validationTimerRef.current);
        }

        // Debounce validation and dirty checking (500ms delay)
        validationTimerRef.current = window.setTimeout(() => {
            setIsDirty(value !== originalSource);
            setIsValid(validateSource(value, format));
            validationTimerRef.current = null;
        }, 500);
    };

    /**
     * Cleanup validation timer on unmount
     */
    useEffect(() => {
        return () => {
            if (validationTimerRef.current !== null) {
                clearTimeout(validationTimerRef.current);
            }
        };
    }, []);

    /**
     * Handle format toggle (JSON/YAML)
     * Converts the actual editor contents (including any user edits) to the new format
     */
    const handleFormatChange = (_event: any, isSelected: boolean, newFormat: SourceFormat) => {
        if (isSelected && newFormat !== format) {
            // Clear any pending validation
            if (validationTimerRef.current !== null) {
                clearTimeout(validationTimerRef.current);
                validationTimerRef.current = null;
            }

            // Convert the actual editor contents (currentSource) to the new format
            // This preserves any edits the user has made
            const converted = convertFormat(currentSource, format, newFormat);
            setFormat(newFormat);
            setCurrentSource(converted);

            // Also convert the original baseline source to maintain dirty tracking
            const convertedOriginal = convertFormat(originalSource, format, newFormat);
            setOriginalSource(convertedOriginal);

            // Update dirty state by comparing converted editor contents to converted original
            setIsDirty(converted !== convertedOriginal);

            // Validate the converted source immediately
            setIsValid(validateSource(converted, newFormat));
        }
    };

    /**
     * Handle Format button click
     */
    const handleFormat = () => {
        if (!isValid) {
            return;
        }

        // Clear any pending validation
        if (validationTimerRef.current !== null) {
            clearTimeout(validationTimerRef.current);
            validationTimerRef.current = null;
        }

        try {
            // Re-format the current source
            const formatted = convertFormat(currentSource, format, format);
            setCurrentSource(formatted);
            setIsDirty(formatted !== originalSource);
        } catch (error) {
            console.error('Failed to format source:', error);
        }
    };

    /**
     * Handle Revert button click
     */
    const handleRevert = () => {
        // Clear any pending validation
        if (validationTimerRef.current !== null) {
            clearTimeout(validationTimerRef.current);
            validationTimerRef.current = null;
        }

        setCurrentSource(originalSource);
        setIsDirty(false);
        setIsValid(true);
    };

    /**
     * Handle Save button click
     */
    const handleSave = () => {
        // TODO: Implement save logic
        console.log('Save clicked');
        // After saving, update original source and clear dirty flag
        // setOriginalSource(currentSource);
        // setIsDirty(false);
    };

    return (
        <div className="source-form">
            {/* Toolbar with actions */}
            <Toolbar>
                <ToolbarContent>
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleFormat}
                                isDisabled={!isValid}
                            >
                                Format
                            </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={handleRevert}
                                isDisabled={!isDirty}
                            >
                                Revert
                            </Button>
                        </ToolbarItem>
                        <ToolbarItem>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSave}
                                isDisabled={!isDirty || !isValid}
                            >
                                Save
                            </Button>
                        </ToolbarItem>
                    </ToolbarGroup>

                    <ToolbarGroup align={{ default: 'alignEnd' }}>
                        <ToolbarItem>
                            <ToggleGroup aria-label="Source format toggle">
                                <ToggleGroupItem
                                    text="JSON"
                                    buttonId="json-toggle"
                                    isSelected={format === 'json'}
                                    isDisabled={!isValid}
                                    onChange={(event, isSelected) => handleFormatChange(event, isSelected, 'json')}
                                />
                                <ToggleGroupItem
                                    text="YAML"
                                    buttonId="yaml-toggle"
                                    isSelected={format === 'yaml'}
                                    isDisabled={!isValid}
                                    onChange={(event, isSelected) => handleFormatChange(event, isSelected, 'yaml')}
                                />
                            </ToggleGroup>
                        </ToolbarItem>
                    </ToolbarGroup>
                </ToolbarContent>
            </Toolbar>

            {/* Code Editor */}
            <div className="source-editor-container">
                <CodeEditor
                    isReadOnly={false}
                    code={currentSource}
                    onChange={handleSourceChange}
                    language={format === 'json' ? Language.json : Language.yaml}
                    height="100%"
                />
            </div>
        </div>
    );
};

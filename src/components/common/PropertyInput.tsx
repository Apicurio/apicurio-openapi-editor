/**
 * Reusable component for editing a single property of a model
 */

import React, { useState, useEffect } from 'react';
import { FormGroup, TextInput, TextArea } from '@patternfly/react-core';
import { Node } from '@apicurio/data-models';
import { useCommand } from '@hooks/useCommand';
import { useDocumentStore } from '@stores/documentStore';
import { ChangePropertyCommand } from '@commands/ChangePropertyCommand';

export interface PropertyInputProps {
    /**
     * The model/node to edit
     */
    model: Node;

    /**
     * The property name to edit
     */
    propertyName: string;

    /**
     * Label to display for the input
     */
    label: string;

    /**
     * Type of input to use
     */
    type?: 'text' | 'textarea';

    /**
     * Placeholder text
     */
    placeholder?: string;

    /**
     * Optional field ID (defaults to propertyName)
     */
    fieldId?: string;

    /**
     * Whether the field is required
     */
    isRequired?: boolean;
}

/**
 * Component for editing a single property of a model with automatic change detection and command execution
 */
export const PropertyInput: React.FC<PropertyInputProps> = ({
    model,
    propertyName,
    label,
    type = 'text',
    placeholder,
    fieldId,
    isRequired = false,
}) => {
    const { executeCommand } = useCommand();
    const version = useDocumentStore((state) => state.version);

    /**
     * Get the current value from the model
     */
    const getCurrentValue = (): string => {
        if (!model) return '';

        // Try getter method first (e.g., getSummary())
        const getterName = `get${propertyName.charAt(0).toUpperCase()}${propertyName.slice(1)}`;
        if (typeof (model as any)[getterName] === 'function') {
            return (model as any)[getterName]() || '';
        }

        // Fall back to direct property access
        return (model as any)[propertyName] || '';
    };

    // Local state for the input value
    const [value, setValue] = useState(getCurrentValue());

    /**
     * Update local state when model changes (e.g., from undo/redo or external changes)
     */
    useEffect(() => {
        if (!model) return;

        // Try getter method first (e.g., getSummary())
        const getterName = `get${propertyName.charAt(0).toUpperCase()}${propertyName.slice(1)}`;
        let newValue = '';

        if (typeof (model as any)[getterName] === 'function') {
            newValue = (model as any)[getterName]() || '';
        } else {
            // Fall back to direct property access
            newValue = (model as any)[propertyName] || '';
        }

        setValue(newValue);
    }, [version, model, propertyName]); // Re-run when document version changes (undo/redo), model, or propertyName changes

    /**
     * Handle committing the change
     */
    const handleCommit = () => {
        if (model && value !== getCurrentValue()) {
            const command = new ChangePropertyCommand(model, propertyName, value);
            const description = `Change ${label.toLowerCase()} to "${value}"`;
            executeCommand(command, description);
        }
    };

    /**
     * Handle Enter key press (only for text inputs, not textareas)
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && type === 'text') {
            e.preventDefault();
            handleCommit();
        }
    };

    const inputFieldId = fieldId || `property-${propertyName}`;

    return (
        <FormGroup label={label} fieldId={inputFieldId} isRequired={isRequired}>
            {type === 'textarea' ? (
                <TextArea
                    id={inputFieldId}
                    value={value}
                    onChange={(_event, newValue) => setValue(newValue)}
                    onBlur={handleCommit}
                    aria-label={label}
                    placeholder={placeholder}
                    resizeOrientation="vertical"
                />
            ) : (
                <TextInput
                    id={inputFieldId}
                    type="text"
                    value={value}
                    onChange={(_event, newValue) => setValue(newValue)}
                    onBlur={handleCommit}
                    onKeyDown={handleKeyDown}
                    aria-label={label}
                    placeholder={placeholder}
                />
            )}
        </FormGroup>
    );
};

/**
 * Modal dialog for creating a new parameter (query, header, cookie, path)
 */

import React, { useState } from 'react';
import {
    Modal,
    ModalVariant,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    FormGroup,
    TextInput,
    TextArea,
    FormHelperText,
    HelperText,
    HelperTextItem,
    FormSelect,
    FormSelectOption,
    Checkbox,
} from '@patternfly/react-core';

export interface CreateParameterModalProps {
    isOpen: boolean;
    parameterLocation: string;
    onClose: () => void;
    onConfirm: (name: string, description: string, required: boolean, type: string) => void;
}

/**
 * Get display name for parameter location
 */
const getLocationDisplayName = (location: string): string => {
    const displayNames: Record<string, string> = {
        query: 'Query',
        header: 'Header',
        cookie: 'Cookie',
        path: 'Path',
    };
    return displayNames[location] || location;
};

/**
 * Modal for creating a new parameter
 */
export const CreateParameterModal: React.FC<CreateParameterModalProps> = ({ isOpen, parameterLocation, onClose, onConfirm }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [required, setRequired] = useState(false);
    const [type, setType] = useState('string');
    const [validated, setValidated] = useState<'default' | 'success' | 'error'>('default');

    /**
     * Validate the parameter name
     */
    const validateName = (value: string): boolean => {
        if (!value) {
            return false;
        }

        // Parameter name must not contain spaces
        if (value.includes(' ')) {
            return false;
        }

        // Parameter name should be alphanumeric with underscores/hyphens
        const namePattern = /^[a-zA-Z0-9_-]+$/;
        if (!namePattern.test(value)) {
            return false;
        }

        return true;
    };

    /**
     * Handle name change
     */
    const handleNameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setName(value);
        if (value) {
            setValidated(validateName(value) ? 'success' : 'error');
        } else {
            setValidated('default');
        }
    };

    /**
     * Handle description change
     */
    const handleDescriptionChange = (_event: React.FormEvent<HTMLTextAreaElement>, value: string) => {
        setDescription(value);
    };

    /**
     * Handle required checkbox change
     */
    const handleRequiredChange = (_event: React.FormEvent<HTMLInputElement>, checked: boolean) => {
        setRequired(checked);
    };

    /**
     * Handle type change
     */
    const handleTypeChange = (_event: React.FormEvent<HTMLSelectElement>, value: string) => {
        setType(value);
    };

    /**
     * Handle form submission
     */
    const handleConfirm = () => {
        if (validateName(name)) {
            onConfirm(name, description, required, type);
            handleClose();
        } else {
            setValidated('error');
        }
    };

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setName('');
        setDescription('');
        setRequired(false);
        setType('string');
        setValidated('default');
        onClose();
    };

    /**
     * Handle Enter key press (only in name field, not description)
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConfirm();
        }
    };

    const locationDisplayName = getLocationDisplayName(parameterLocation);

    return (
        <Modal
            variant={ModalVariant.small}
            isOpen={isOpen}
            onClose={handleClose}
            aria-labelledby="create-parameter-modal-title"
            aria-describedby="create-parameter-modal-body"
        >
            <ModalHeader title={`Create ${locationDisplayName} Parameter`} labelId="create-parameter-modal-title" />
            <ModalBody id="create-parameter-modal-body">
                <Form>
                    <FormGroup label="Name" isRequired fieldId="parameter-name">
                        <TextInput
                            isRequired
                            type="text"
                            id="parameter-name"
                            name="parameter-name"
                            value={name}
                            onChange={handleNameChange}
                            onKeyDown={handleKeyDown}
                            validated={validated}
                            placeholder="limit"
                            autoFocus
                        />
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem variant={validated}>
                                    {validated === 'error'
                                        ? 'Parameter name must be alphanumeric (underscores and hyphens allowed, no spaces)'
                                        : 'Enter the parameter name (e.g., limit, offset, filter)'}
                                </HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    </FormGroup>

                    <FormGroup label="Description" fieldId="parameter-description">
                        <TextArea
                            type="text"
                            id="parameter-description"
                            name="parameter-description"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Describe the purpose of this parameter"
                            rows={3}
                        />
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem>
                                    Optional description of what this parameter does
                                </HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    </FormGroup>

                    <FormGroup label="Type" fieldId="parameter-type">
                        <FormSelect
                            id="parameter-type"
                            name="parameter-type"
                            value={type}
                            onChange={handleTypeChange}
                            aria-label="Parameter type"
                        >
                            <FormSelectOption key="string" value="string" label="String" />
                            <FormSelectOption key="integer" value="integer" label="Integer" />
                            <FormSelectOption key="number" value="number" label="Number" />
                            <FormSelectOption key="boolean" value="boolean" label="Boolean" />
                        </FormSelect>
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem>
                                    Optional. Select the data type for this parameter (defaults to String)
                                </HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    </FormGroup>

                    <FormGroup fieldId="parameter-required">
                        <Checkbox
                            id="parameter-required"
                            name="parameter-required"
                            label="Required parameter"
                            isChecked={required}
                            onChange={handleRequiredChange}
                        />
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem>
                                    Check if this parameter must be provided in requests
                                </HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button key="cancel" variant="link" onClick={handleClose}>
                    Cancel
                </Button>
                <Button key="confirm" variant="primary" onClick={handleConfirm} isDisabled={validated !== 'success'}>
                    Create
                </Button>
            </ModalFooter>
        </Modal>
    );
};

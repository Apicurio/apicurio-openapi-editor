/**
 * Modal dialog for creating a new schema
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
    FormHelperText,
    HelperText,
    HelperTextItem,
} from '@patternfly/react-core';

export interface CreateSchemaModalProps {
    /**
     * Whether the modal is open
     */
    isOpen: boolean;

    /**
     * Callback when the modal is closed
     */
    onClose: () => void;

    /**
     * Callback when the user confirms creation
     */
    onConfirm: (schemaName: string) => void;
}

/**
 * Modal for creating a new schema
 */
export const CreateSchemaModal: React.FC<CreateSchemaModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [schemaName, setSchemaName] = useState('');
    const [validated, setValidated] = useState<'default' | 'success' | 'error'>('default');

    /**
     * Validate the schema name
     */
    const validateSchemaName = (value: string): boolean => {
        if (!value) {
            return false;
        }

        // Schema name must not contain spaces
        if (value.includes(' ')) {
            return false;
        }

        // Schema name should be a valid identifier (alphanumeric, underscore, hyphen)
        const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
        if (!validNamePattern.test(value)) {
            return false;
        }

        return true;
    };

    /**
     * Handle schema name change
     */
    const handleSchemaNameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setSchemaName(value);
        if (value) {
            setValidated(validateSchemaName(value) ? 'success' : 'error');
        } else {
            setValidated('default');
        }
    };

    /**
     * Handle form submission
     */
    const handleConfirm = () => {
        if (validateSchemaName(schemaName)) {
            onConfirm(schemaName);
            handleClose();
        } else {
            setValidated('error');
        }
    };

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setSchemaName('');
        setValidated('default');
        onClose();
    };

    /**
     * Handle Enter key press
     */
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleConfirm();
        }
    };

    return (
        <Modal
            variant={ModalVariant.small}
            isOpen={isOpen}
            onClose={handleClose}
            aria-labelledby="create-schema-modal-title"
            aria-describedby="create-schema-modal-body"
            elementToFocus="#schema-name"
        >
            <ModalHeader title="Create New Schema" labelId="create-schema-modal-title" />
            <ModalBody id="create-schema-modal-body">
                <Form>
                    <FormGroup label="Schema Name" isRequired fieldId="schema-name">
                        <TextInput
                            isRequired
                            type="text"
                            id="schema-name"
                            name="schema-name"
                            value={schemaName}
                            onChange={handleSchemaNameChange}
                            onKeyDown={handleKeyDown}
                            validated={validated}
                            placeholder="Pet"
                            autoFocus
                        />
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem variant={validated}>
                                    {validated === 'error'
                                        ? 'Schema name must start with a letter and contain only letters, numbers, hyphens, or underscores'
                                        : 'Enter the schema name (e.g., Pet, User, Order)'}
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

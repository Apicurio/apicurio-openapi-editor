/**
 * Modal dialog for creating a new path item
 */

import React, { useState } from 'react';
import {
    Modal,
    ModalVariant,
    Button,
    Form,
    FormGroup,
    TextInput,
    FormHelperText,
    HelperText,
    HelperTextItem,
} from '@patternfly/react-core';

export interface CreatePathModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (pathName: string) => void;
}

/**
 * Modal for creating a new path item
 */
export const CreatePathModal: React.FC<CreatePathModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [pathName, setPathName] = useState('');
    const [validated, setValidated] = useState<'default' | 'success' | 'error'>('default');

    /**
     * Validate the path name
     */
    const validatePathName = (value: string): boolean => {
        if (!value) {
            return false;
        }

        // Path must start with /
        if (!value.startsWith('/')) {
            return false;
        }

        // Path must not be just /
        if (value === '/') {
            return false;
        }

        // Basic validation - no spaces, must be valid URL path format
        if (value.includes(' ')) {
            return false;
        }

        return true;
    };

    /**
     * Handle path name change
     */
    const handlePathNameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setPathName(value);
        if (value) {
            setValidated(validatePathName(value) ? 'success' : 'error');
        } else {
            setValidated('default');
        }
    };

    /**
     * Handle form submission
     */
    const handleConfirm = () => {
        if (validatePathName(pathName)) {
            onConfirm(pathName);
            handleClose();
        } else {
            setValidated('error');
        }
    };

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setPathName('');
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
            title="Create New Path"
            isOpen={isOpen}
            onClose={handleClose}
        >
            <div style={{ padding: '1.5rem' }}>
            <Form>
                <FormGroup label="Path" isRequired fieldId="path-name">
                    <TextInput
                        isRequired
                        type="text"
                        id="path-name"
                        name="path-name"
                        value={pathName}
                        onChange={handlePathNameChange}
                        onKeyDown={handleKeyDown}
                        validated={validated}
                        placeholder="/pets"
                        autoFocus
                    />
                    <FormHelperText>
                        <HelperText>
                            <HelperTextItem variant={validated}>
                                {validated === 'error'
                                    ? 'Path must start with / and cannot contain spaces'
                                    : 'Enter the path (e.g., /pets, /users/{id})'}
                            </HelperTextItem>
                        </HelperText>
                    </FormHelperText>
                </FormGroup>
            </Form>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <Button key="cancel" variant="link" onClick={handleClose}>
                    Cancel
                </Button>
                <Button key="confirm" variant="primary" onClick={handleConfirm} isDisabled={validated !== 'success'}>
                    Create
                </Button>
            </div>
            </div>
        </Modal>
    );
};

/**
 * Modal dialog for creating a new server
 */

import React, { useState } from 'react';
import {
    Modal,
    ModalVariant,
    Button,
    Form,
    FormGroup,
    TextInput,
    TextArea,
    FormHelperText,
    HelperText,
    HelperTextItem,
} from '@patternfly/react-core';

export interface NewServerModalProps {
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
    onConfirm: (serverUrl: string, serverDescription: string) => void;
}

/**
 * Modal for creating a new server
 */
export const NewServerModal: React.FC<NewServerModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [serverUrl, setServerUrl] = useState('');
    const [serverDescription, setServerDescription] = useState('');
    const [validated, setValidated] = useState<'default' | 'success' | 'error'>('default');

    /**
     * Validate the server URL
     */
    const validateServerUrl = (value: string): boolean => {
        if (!value) {
            return false;
        }

        // Server URL should not be just whitespace
        if (value.trim().length === 0) {
            return false;
        }

        return true;
    };

    /**
     * Handle server URL change
     */
    const handleServerUrlChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setServerUrl(value);
        if (value) {
            setValidated(validateServerUrl(value) ? 'success' : 'error');
        } else {
            setValidated('default');
        }
    };

    /**
     * Handle server description change
     */
    const handleServerDescriptionChange = (_event: React.FormEvent<HTMLTextAreaElement>, value: string) => {
        setServerDescription(value);
    };

    /**
     * Handle form submission
     */
    const handleConfirm = () => {
        if (validateServerUrl(serverUrl)) {
            onConfirm(serverUrl, serverDescription);
            handleClose();
        } else {
            setValidated('error');
        }
    };

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setServerUrl('');
        setServerDescription('');
        setValidated('default');
        onClose();
    };

    /**
     * Handle Enter key press in server URL field
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
            title="Create New Server"
            isOpen={isOpen}
            onClose={handleClose}
        >
            <div style={{ padding: '1.5rem' }}>
                <Form>
                    <FormGroup label="Server URL" isRequired fieldId="server-url">
                        <TextInput
                            isRequired
                            type="text"
                            id="server-url"
                            name="server-url"
                            value={serverUrl}
                            onChange={handleServerUrlChange}
                            onKeyDown={handleKeyDown}
                            validated={validated}
                            placeholder="https://api.example.com"
                            autoFocus
                        />
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem variant={validated}>
                                    {validated === 'error'
                                        ? 'Server URL is required'
                                        : 'Enter the base URL for the server'}
                                </HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    </FormGroup>

                    <FormGroup label="Description" fieldId="server-description">
                        <TextArea
                            type="text"
                            id="server-description"
                            name="server-description"
                            value={serverDescription}
                            onChange={handleServerDescriptionChange}
                            placeholder="Production server"
                            resizeOrientation="vertical"
                        />
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem>
                                    Optional description for the server
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

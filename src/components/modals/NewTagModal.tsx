/**
 * Modal dialog for creating a new tag
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

export interface NewTagModalProps {
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
    onConfirm: (tagName: string, tagDescription: string) => void;
}

/**
 * Modal for creating a new tag
 */
export const NewTagModal: React.FC<NewTagModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [tagName, setTagName] = useState('');
    const [tagDescription, setTagDescription] = useState('');
    const [validated, setValidated] = useState<'default' | 'success' | 'error'>('default');

    /**
     * Validate the tag name
     */
    const validateTagName = (value: string): boolean => {
        if (!value) {
            return false;
        }

        // Tag name can contain spaces and most characters, but shouldn't be just whitespace
        if (value.trim().length === 0) {
            return false;
        }

        return true;
    };

    /**
     * Handle tag name change
     */
    const handleTagNameChange = (_event: React.FormEvent<HTMLInputElement>, value: string) => {
        setTagName(value);
        if (value) {
            setValidated(validateTagName(value) ? 'success' : 'error');
        } else {
            setValidated('default');
        }
    };

    /**
     * Handle tag description change
     */
    const handleTagDescriptionChange = (_event: React.FormEvent<HTMLTextAreaElement>, value: string) => {
        setTagDescription(value);
    };

    /**
     * Handle form submission
     */
    const handleConfirm = () => {
        if (validateTagName(tagName)) {
            onConfirm(tagName, tagDescription);
            handleClose();
        } else {
            setValidated('error');
        }
    };

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setTagName('');
        setTagDescription('');
        setValidated('default');
        onClose();
    };

    /**
     * Handle Enter key press in tag name field
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
            title="Create New Tag"
            isOpen={isOpen}
            onClose={handleClose}
        >
            <div style={{ padding: '1.5rem' }}>
                <Form>
                    <FormGroup label="Tag Name" isRequired fieldId="tag-name">
                        <TextInput
                            isRequired
                            type="text"
                            id="tag-name"
                            name="tag-name"
                            value={tagName}
                            onChange={handleTagNameChange}
                            onKeyDown={handleKeyDown}
                            validated={validated}
                            placeholder="API Users"
                            autoFocus
                        />
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem variant={validated}>
                                    {validated === 'error'
                                        ? 'Tag name is required'
                                        : 'Enter the tag name (e.g., Users, Products, Orders)'}
                                </HelperTextItem>
                            </HelperText>
                        </FormHelperText>
                    </FormGroup>

                    <FormGroup label="Description" fieldId="tag-description">
                        <TextArea
                            type="text"
                            id="tag-description"
                            name="tag-description"
                            value={tagDescription}
                            onChange={handleTagDescriptionChange}
                            placeholder="Operations related to users"
                            resizeOrientation="vertical"
                        />
                        <FormHelperText>
                            <HelperText>
                                <HelperTextItem>
                                    Optional description for the tag
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

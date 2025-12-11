/**
 * Modal dialog for editing a tag's description
 */

import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalVariant,
    Button,
    Form,
    FormGroup,
    TextArea,
    FormHelperText,
    HelperText,
    HelperTextItem,
} from '@patternfly/react-core';

export interface EditTagDescriptionModalProps {
    /**
     * Whether the modal is open
     */
    isOpen: boolean;

    /**
     * The tag name
     */
    tagName: string;

    /**
     * The current tag description
     */
    currentDescription: string;

    /**
     * Callback when the modal is closed
     */
    onClose: () => void;

    /**
     * Callback when the user confirms the change
     */
    onConfirm: (description: string) => void;
}

/**
 * Modal for editing a tag's description
 */
export const EditTagDescriptionModal: React.FC<EditTagDescriptionModalProps> = ({
    isOpen,
    tagName,
    currentDescription,
    onClose,
    onConfirm
}) => {
    const [description, setDescription] = useState('');

    /**
     * Update description when modal opens or currentDescription changes
     */
    useEffect(() => {
        if (isOpen) {
            setDescription(currentDescription || '');
        }
    }, [isOpen, currentDescription]);

    /**
     * Handle description change
     */
    const handleDescriptionChange = (_event: React.FormEvent<HTMLTextAreaElement>, value: string) => {
        setDescription(value);
    };

    /**
     * Handle form submission
     */
    const handleConfirm = () => {
        onConfirm(description);
        handleClose();
    };

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setDescription('');
        onClose();
    };

    return (
        <Modal
            variant={ModalVariant.medium}
            title={`Edit Tag: ${tagName}`}
            isOpen={isOpen}
            onClose={handleClose}
        >
            <div style={{ padding: '1.5rem' }}>
                <Form>
                    <FormGroup label="Description" fieldId="tag-description">
                        <TextArea
                            type="text"
                            id="tag-description"
                            name="tag-description"
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Operations related to users"
                            resizeOrientation="vertical"
                            rows={8}
                            autoFocus
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
                    <Button key="confirm" variant="primary" onClick={handleConfirm}>
                        Save
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

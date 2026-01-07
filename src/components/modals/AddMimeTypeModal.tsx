/**
 * Modal for adding a MIME type
 */

import React, { useState } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Radio,
    TextInput
} from '@patternfly/react-core';

interface AddMimeTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (mimeType: string) => void;
    existingMimeTypes: string[];
}

const COMMON_MIME_TYPES = [
    'application/json',
    'text/xml',
    'multipart/form-data'
];

/**
 * Modal component for adding a new MIME type
 */
export const AddMimeTypeModal: React.FC<AddMimeTypeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    existingMimeTypes
}) => {
    const [selectedCommonType, setSelectedCommonType] = useState<string | null>(null);
    const [customMimeType, setCustomMimeType] = useState('');
    const [useCustom, setUseCustom] = useState(false);

    /**
     * Reset modal state
     */
    const resetState = () => {
        setSelectedCommonType(null);
        setCustomMimeType('');
        setUseCustom(false);
    };

    /**
     * Handle modal close
     */
    const handleClose = () => {
        resetState();
        onClose();
    };

    /**
     * Handle confirm
     */
    const handleConfirm = () => {
        const mimeTypeToAdd = useCustom ? customMimeType.trim() : selectedCommonType;

        if (mimeTypeToAdd && !existingMimeTypes.includes(mimeTypeToAdd)) {
            onConfirm(mimeTypeToAdd);
            handleClose();
        }
    };

    /**
     * Handle common type selection
     */
    const handleCommonTypeSelect = (mimeType: string) => {
        setSelectedCommonType(mimeType);
        setUseCustom(false);
    };

    /**
     * Handle custom input focus
     */
    const handleCustomInputFocus = () => {
        setUseCustom(true);
        setSelectedCommonType(null);
    };

    /**
     * Check if confirm button should be disabled
     */
    const isConfirmDisabled = () => {
        if (useCustom) {
            const trimmed = customMimeType.trim();
            return !trimmed || existingMimeTypes.includes(trimmed);
        }
        return !selectedCommonType || existingMimeTypes.includes(selectedCommonType);
    };

    // Filter out common types that are already added
    const availableCommonTypes = COMMON_MIME_TYPES.filter(
        mt => !existingMimeTypes.includes(mt)
    );

    return (
        <Modal
            variant="small"
            isOpen={isOpen}
            onClose={handleClose}
            aria-labelledby="add-mime-type-modal-title"
        >
            <ModalHeader
                title="Add MIME Type"
                labelId="add-mime-type-modal-title"
            />
            <ModalBody>
                <Form>
                    {availableCommonTypes.length > 0 && (
                        <FormGroup label="Common MIME types" fieldId="common-mime-types">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {availableCommonTypes.map((mimeType) => (
                                    <Radio
                                        key={mimeType}
                                        id={`common-${mimeType}`}
                                        name="common-mime-type"
                                        label={mimeType}
                                        isChecked={selectedCommonType === mimeType && !useCustom}
                                        onChange={() => handleCommonTypeSelect(mimeType)}
                                    />
                                ))}
                            </div>
                        </FormGroup>
                    )}

                    <FormGroup label="Custom MIME type" fieldId="custom-mime-type">
                        <TextInput
                            id="custom-mime-type"
                            placeholder="Enter a custom MIME type..."
                            value={customMimeType}
                            onChange={(_event, value) => setCustomMimeType(value)}
                            onFocus={handleCustomInputFocus}
                        />
                    </FormGroup>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    isDisabled={isConfirmDisabled()}
                >
                    Add
                </Button>
                <Button variant="link" onClick={handleClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

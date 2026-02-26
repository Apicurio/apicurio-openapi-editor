/**
 * Modal for adding a new response status code to an operation
 */

import React, { useState } from 'react';
import {
    Button,
    Form,
    FormGroup,
    FormHelperText,
    HelperText,
    HelperTextItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Radio,
    TextInput
} from '@patternfly/react-core';

interface AddResponseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (statusCode: string, description: string) => void;
    existingStatusCodes: string[];
}

/**
 * Common HTTP status codes with their standard descriptions
 */
const COMMON_STATUS_CODES: { code: string; description: string }[] = [
    { code: '200', description: 'OK' },
    { code: '201', description: 'Created' },
    { code: '204', description: 'No Content' },
    { code: '400', description: 'Bad Request' },
    { code: '401', description: 'Unauthorized' },
    { code: '403', description: 'Forbidden' },
    { code: '404', description: 'Not Found' },
    { code: '500', description: 'Internal Server Error' },
];

/**
 * Modal component for adding a new response to an operation
 */
export const AddResponseModal: React.FC<AddResponseModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    existingStatusCodes
}) => {
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [customCode, setCustomCode] = useState('');
    const [description, setDescription] = useState('');
    const [useCustom, setUseCustom] = useState(false);

    /**
     * Reset modal state
     */
    const resetState = () => {
        setSelectedCode(null);
        setCustomCode('');
        setDescription('');
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
        const code = useCustom ? customCode.trim() : selectedCode;
        if (code && !existingStatusCodes.includes(code)) {
            onConfirm(code, description);
            handleClose();
        }
    };

    /**
     * Handle common code selection
     */
    const handleCommonCodeSelect = (code: string) => {
        setSelectedCode(code);
        setUseCustom(false);
        // Auto-populate description with standard description
        const common = COMMON_STATUS_CODES.find(c => c.code === code);
        if (common) {
            setDescription(common.description);
        }
    };

    /**
     * Handle custom code input focus
     */
    const handleCustomInputFocus = () => {
        setUseCustom(true);
        setSelectedCode(null);
        setDescription('');
    };

    /**
     * Validate status code format (3-digit number or "default")
     */
    const isValidStatusCode = (code: string): boolean => {
        if (code === 'default') {
            return true;
        }
        return /^\d{3}$/.test(code);
    };

    /**
     * Check if confirm button should be disabled
     */
    const isConfirmDisabled = (): boolean => {
        if (useCustom) {
            const trimmed = customCode.trim();
            return !trimmed || !isValidStatusCode(trimmed) || existingStatusCodes.includes(trimmed);
        }
        return !selectedCode || existingStatusCodes.includes(selectedCode);
    };

    // Filter out common codes that already exist
    const availableCommonCodes = COMMON_STATUS_CODES.filter(
        c => !existingStatusCodes.includes(c.code)
    );

    return (
        <Modal
            variant="small"
            isOpen={isOpen}
            onClose={handleClose}
            aria-labelledby="add-response-modal-title"
        >
            <ModalHeader
                title="Add Response"
                labelId="add-response-modal-title"
            />
            <ModalBody>
                <Form>
                    {availableCommonCodes.length > 0 && (
                        <FormGroup label="Common status codes" fieldId="common-status-codes">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {availableCommonCodes.map((entry) => (
                                    <Radio
                                        key={entry.code}
                                        id={`common-${entry.code}`}
                                        name="common-status-code"
                                        label={`${entry.code} - ${entry.description}`}
                                        isChecked={selectedCode === entry.code && !useCustom}
                                        onChange={() => handleCommonCodeSelect(entry.code)}
                                    />
                                ))}
                            </div>
                        </FormGroup>
                    )}

                    <FormGroup label="Custom status code" fieldId="custom-status-code">
                        <TextInput
                            id="custom-status-code"
                            placeholder='Enter a status code (e.g., "301", "422", "default")'
                            value={customCode}
                            onChange={(_event, value) => setCustomCode(value)}
                            onFocus={handleCustomInputFocus}
                        />
                        {useCustom && customCode.trim() && !isValidStatusCode(customCode.trim()) && (
                            <FormHelperText>
                                <HelperText>
                                    <HelperTextItem variant="error">
                                        Status code must be a 3-digit number or &quot;default&quot;
                                    </HelperTextItem>
                                </HelperText>
                            </FormHelperText>
                        )}
                    </FormGroup>

                    <FormGroup label="Description" fieldId="response-description">
                        <TextInput
                            id="response-description"
                            placeholder="Response description"
                            value={description}
                            onChange={(_event, value) => setDescription(value)}
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

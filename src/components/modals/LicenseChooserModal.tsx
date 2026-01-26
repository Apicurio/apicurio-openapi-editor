/**
 * Modal for choosing an open source license
 */

import React, { useState } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    SearchInput,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { LICENSES, LicenseMetaData as LicenseInfoData } from '../../data/licenses';
import { LicenseInfo } from '@components/common/LicenseInfo';
import './LicenseChooserModal.css';

interface LicenseChooserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (license: LicenseInfoData) => void;
    currentLicenseName?: string;
}

/**
 * License chooser modal component
 */
export const LicenseChooserModal: React.FC<LicenseChooserModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    currentLicenseName
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLicense, setSelectedLicense] = useState<LicenseInfoData | null>(null);

    /**
     * Filter licenses based on search term
     */
    const filteredLicenses = LICENSES.filter(license => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            license.name.toLowerCase().includes(term) ||
            license.id.toLowerCase().includes(term) ||
            license.description?.toLowerCase().includes(term)
        );
    });

    /**
     * Featured licenses appear first
     */
    const sortedLicenses = [...filteredLicenses].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.name.localeCompare(b.name);
    });

    /**
     * Handle license selection
     */
    const handleSelect = () => {
        if (selectedLicense) {
            onSelect(selectedLicense);
            setSelectedLicense(null);
            setSearchTerm('');
            onClose();
        }
    };

    /**
     * Handle modal close
     */
    const handleClose = () => {
        setSelectedLicense(null);
        setSearchTerm('');
        onClose();
    };


    return (
        <Modal
            variant="large"
            isOpen={isOpen}
            onClose={handleClose}
            aria-labelledby="license-chooser-modal-title"
        >
            <ModalHeader
                title="Choose a License"
                labelId="license-chooser-modal-title"
            />
            <ModalBody>
                <Stack hasGutter>
                    <StackItem>
                        <p>
                            Select an open source license for your API. Choose a license based on
                            what you want to allow others to do with your API.
                        </p>
                    </StackItem>
                    <StackItem>
                        <SearchInput
                            placeholder="Search licenses..."
                            value={searchTerm}
                            onChange={(_event, value) => setSearchTerm(value)}
                            onClear={() => setSearchTerm('')}
                        />
                    </StackItem>
                    <StackItem isFilled>
                        <div className="license-list">
                            {sortedLicenses.length > 0 ? (
                                sortedLicenses.map(license => {
                                    const isSelected = selectedLicense?.id === license.id;
                                    const isCurrent = !!(currentLicenseName &&
                                        (license.name.toLowerCase() === currentLicenseName.toLowerCase() ||
                                         license.id.toLowerCase() === currentLicenseName.toLowerCase()));

                                    return (
                                        <LicenseInfo
                                            key={license.id}
                                            license={license}
                                            isSelected={isSelected}
                                            isCurrent={isCurrent}
                                            onClick={setSelectedLicense}
                                        />
                                    );
                                })
                            ) : (
                                <div className="license-list__empty">
                                    No licenses found matching "{searchTerm}"
                                </div>
                            )}
                        </div>
                    </StackItem>
                </Stack>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant="primary"
                    onClick={handleSelect}
                    isDisabled={!selectedLicense}
                >
                    Select License
                </Button>
                <Button variant="link" onClick={handleClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

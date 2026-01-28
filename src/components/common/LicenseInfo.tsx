/**
 * License info component for displaying license details
 */

import React from 'react';
import { Flex, FlexItem, Icon } from '@patternfly/react-core';
import { LicenseMetaData as LicenseInfoData } from '../../data/licenses';
import { CheckCircleIcon, ExclamationCircleIcon, InfoCircleIcon } from "@patternfly/react-icons";
import './LicenseInfo.css';

interface LicenseInfoProps {
    license: LicenseInfoData;
    isSelected?: boolean;
    isCurrent?: boolean;
    isStandalone?: boolean;
    onClick?: (license: LicenseInfoData) => void;
}

/**
 * Component for displaying license information with permissions, conditions, and limitations
 */
export const LicenseInfo: React.FC<LicenseInfoProps> = ({
    license,
    isSelected = false,
    isCurrent = false,
    isStandalone = false,
    onClick
}) => {
    const handleClick = () => {
        if (onClick) {
            onClick(license);
        }
    };

    return (
        <Flex
            flexWrap={{ default: "nowrap" }}
            width="100%"
            className={`license-info ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''} ${isStandalone ? 'standalone' : ''}`}
            onClick={handleClick}
        >
            <FlexItem className="license-title-and-description license-column">
                <h2>{license.name}</h2>
                <span>{license.description}</span>
            </FlexItem>
            <FlexItem className="license-extra-info-columns license-column">
                <Flex flexWrap={{ default: "nowrap" }} width="100%">
                    <FlexItem className="license-permissions license-info-column">
                        <div className="license-info-column-name">Permissions</div>
                        <ul>
                            {license.permissions?.map((p: string, i: number) => (
                                <li key={i}><Icon status="success"><CheckCircleIcon /></Icon> {p}</li>
                            ))}
                        </ul>
                    </FlexItem>
                    <FlexItem className="license-conditions license-info-column">
                        <div className="license-info-column-name">Conditions</div>
                        <ul>
                            {license.conditions?.map((p: string, i: number) => (
                                <li key={i}><Icon status="info"><InfoCircleIcon /></Icon> {p}</li>
                            ))}
                        </ul>
                    </FlexItem>
                    <FlexItem className="license-limitations license-info-column">
                        <div className="license-info-column-name">Limitations</div>
                        <ul>
                            {license.limitations?.map((p: string, i: number) => (
                                <li key={i}><Icon status="danger"><ExclamationCircleIcon /></Icon> {p}</li>
                            ))}
                        </ul>
                    </FlexItem>
                </Flex>
            </FlexItem>
        </Flex>
    );
};

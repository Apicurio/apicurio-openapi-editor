/**
 * Validation indicator component for the toolbar
 */

import React from 'react';
import { Button, Label } from '@patternfly/react-core';
import { ExclamationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { useValidation } from '@hooks/useValidation';

export interface ValidationIndicatorProps {
    /**
     * Callback when the indicator is clicked
     */
    onClick: () => void;
}

/**
 * Displays validation status in the toolbar
 */
export const ValidationIndicator: React.FC<ValidationIndicatorProps> = ({ onClick }) => {
    const { errorCount, warningCount, isValid } = useValidation();

    if (isValid && warningCount === 0) {
        return (
            <Button variant="link" onClick={onClick} icon={<CheckCircleIcon color="var(--pf-v6-global--success-color--100)" />}>
                <span style={{ color: 'var(--pf-v6-global--success-color--100)' }}>Valid</span>
            </Button>
        );
    }

    return (
        <Button variant="link" onClick={onClick}>
            {errorCount > 0 && (
                <>
                    <ExclamationCircleIcon color="var(--pf-v6-global--danger-color--100)" />
                    {' '}
                    <Label color="red" isCompact>
                        {errorCount} {errorCount === 1 ? 'error' : 'errors'}
                    </Label>
                </>
            )}
            {errorCount > 0 && warningCount > 0 && ' '}
            {warningCount > 0 && (
                <>
                    <ExclamationTriangleIcon color="var(--pf-v6-global--warning-color--100)" />
                    {' '}
                    <Label color="orange" isCompact>
                        {warningCount} {warningCount === 1 ? 'warning' : 'warnings'}
                    </Label>
                </>
            )}
        </Button>
    );
};

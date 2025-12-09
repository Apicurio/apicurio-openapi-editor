/**
 * Custom expandable panel component with header actions
 */

import React, { ReactNode } from 'react';
import { Button } from '@patternfly/react-core';
import { AngleRightIcon, AngleDownIcon } from '@patternfly/react-icons';
import './ExpandablePanel.css';

export interface ExpandablePanelProps {
    /**
     * The title text to display in the header
     */
    title: string;

    /**
     * Whether the panel is expanded
     */
    isExpanded: boolean;

    /**
     * Extra class name
     */
    className?: string;

    /**
     * Callback when the panel is toggled
     */
    onToggle: (expanded: boolean) => void;

    /**
     * Optional action buttons to display on the right side of the header
     */
    actions?: ReactNode;

    /**
     * The content to display when expanded
     */
    children: ReactNode;
}

/**
 * Custom expandable panel with header and optional actions
 */
export const ExpandablePanel: React.FC<ExpandablePanelProps> = ({
    title,
    className,
    isExpanded,
    onToggle,
    actions,
    children,
}) => {
    return (
        <div className={`expandable-panel ${className || ''}`}>
            <div className="expandable-panel__header">
                <Button
                    variant="plain"
                    icon={isExpanded ? <AngleDownIcon /> : <AngleRightIcon />}
                    className="expandable-panel__toggle"
                    onClick={() => onToggle(!isExpanded)}
                    aria-expanded={isExpanded}
                >
                    {title}
                </Button>
                {actions && (
                    <div className="expandable-panel__actions" onClick={(e) => e.stopPropagation()}>
                        {actions}
                    </div>
                )}
            </div>
            {isExpanded && (
                <div className="expandable-panel__content">
                    {children}
                </div>
            )}
        </div>
    );
};

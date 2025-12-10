/**
 * Main editor layout with drawer (master/detail pattern)
 */

import React from 'react';
import {Panel,} from '@patternfly/react-core';
import {NavigationPanel} from './NavigationPanel';
import {ValidationPanel} from './ValidationPanel';
import {DetailPanel} from './DetailPanel';
import './EditorLayout.css';

interface EditorLayoutProps {
    /**
     * Whether to show the validation panel instead of the navigation panel
     */
    showValidationPanel?: boolean;
}

/**
 * Editor layout component with resizable drawer
 */
export const EditorLayout: React.FC<EditorLayoutProps> = ({ showValidationPanel = false }) => {

    const mainPanel = (
        <Panel isScrollable={true} className="main-panel scroll-panel navigation-scroll-panel">
            {showValidationPanel ? <ValidationPanel /> : <NavigationPanel />}
        </Panel>
    );

    const detailPanel = (
        <Panel isScrollable={true} className="detail-panel scroll-panel">
            <DetailPanel />
        </Panel>
    );

    return (
        <div className="editor-layout">
            {
                mainPanel
            }
            {
                detailPanel
            }
        </div>
    )
};

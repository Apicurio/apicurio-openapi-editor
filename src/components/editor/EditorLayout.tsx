/**
 * Main editor layout with drawer (master/detail pattern)
 */

import React from 'react';
import {Panel,} from '@patternfly/react-core';
import {NavigationPanel} from './NavigationPanel';
import {DetailPanel} from './DetailPanel';
import './EditorLayout.css';

interface EditorLayoutProps {
}

/**
 * Editor layout component with resizable drawer
 */
export const EditorLayout: React.FC<EditorLayoutProps> = () => {

    const mainPanel = (
        <Panel isScrollable={true} className="main-panel scroll-panel navigation-scroll-panel">
            <NavigationPanel />
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

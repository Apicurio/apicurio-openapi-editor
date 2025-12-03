/**
 * Main editor layout with drawer (master/detail pattern)
 */

import React from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerContentBody,
    DrawerPanelContent,
    DrawerHead,
    DrawerActions,
    DrawerCloseButton,
} from '@patternfly/react-core';
import { NavigationPanel } from './NavigationPanel';
import { DetailPanel } from './DetailPanel';

interface EditorLayoutProps {
    /**
     * Whether the drawer is expanded
     */
    isDrawerExpanded: boolean;

    /**
     * Toggle drawer expanded state
     */
    onDrawerToggle: () => void;
}

/**
 * Editor layout component with resizable drawer
 */
export const EditorLayout: React.FC<EditorLayoutProps> = ({ isDrawerExpanded, onDrawerToggle }) => {
    const panelContent = (
        <DrawerPanelContent isResizable defaultSize="300px" minSize="200px" maxSize="600px">
            <DrawerHead>
                <span tabIndex={isDrawerExpanded ? 0 : -1}>Navigation</span>
                <DrawerActions>
                    <DrawerCloseButton onClick={onDrawerToggle} />
                </DrawerActions>
            </DrawerHead>
            <div style={{ padding: '1rem', height: '100%', overflow: 'auto' }}>
                <NavigationPanel />
            </div>
        </DrawerPanelContent>
    );

    return (
        <Drawer isExpanded={isDrawerExpanded} isInline>
            <DrawerContent panelContent={panelContent}>
                <DrawerContentBody>
                    <DetailPanel />
                </DrawerContentBody>
            </DrawerContent>
        </Drawer>
    );
};

/**
 * Hook for handling highlight effects on selection changes
 */

import { useEffect, useRef } from 'react';
import { useSelectionStore } from '@stores/selectionStore';

/**
 * Custom hook that watches for highlight selection events and scrolls/animates the target component
 */
export const useHighlightEffect = () => {
    const highlightSelection = useSelectionStore((state) => state.highlightSelection);
    const selectedPath = useSelectionStore((state) => state.selectedPath);
    const selectedPropertyName = useSelectionStore((state) => state.selectedPropertyName);
    const animationTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        if (!highlightSelection) return;

        // Clear any existing animation timeout
        if (animationTimeoutRef.current) {
            clearTimeout(animationTimeoutRef.current);
        }

        // Find the target element to highlight
        let targetElement: HTMLElement | null = null;

        if (selectedPath) {
            const pathString = selectedPath.toString();

            // Build selector based on what's available
            if (selectedPropertyName) {
                // Match both path and property name for fine-grained selection
                targetElement = document.querySelector(
                    `[data-selectable="true"][data-path="${pathString}"][data-property-name="${selectedPropertyName}"]`
                ) as HTMLElement;
            }

            if (!targetElement) {
                // Match just the path, but exclude elements with a property name
                targetElement = document.querySelector(
                    `[data-selectable="true"][data-path="${pathString}"]:not([data-property-name])`
                ) as HTMLElement;
            }
        }

        if (targetElement) {
            console.debug('[useHighlightEffect] Found target element:', targetElement, 'for path:', selectedPath?.toString(), 'property:', selectedPropertyName);

            // Use setTimeout to ensure the element is fully rendered and visible in the DOM
            // This is important when switching tabs - the tab content needs time to mount
            setTimeout(() => {
                // Re-query the element to ensure we have the latest reference
                let scrollTarget = targetElement;

                // Scroll into view
                scrollTarget.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                });

                // Add highlight class for animation
                console.debug('[useHighlightEffect] Adding highlight-flash class');
                scrollTarget.classList.add('highlight-flash');

                // Remove highlight class after animation completes
                animationTimeoutRef.current = setTimeout(() => {
                    console.debug('[useHighlightEffect] Removing highlight-flash class');
                    scrollTarget?.classList.remove('highlight-flash');

                    // Reset the highlight flag in the store
                    useSelectionStore.getState().setHighlight(false);
                }, 1000); // Match CSS animation duration
            }, 100); // Small delay to allow React to render tab content
        } else {
            console.debug('[useHighlightEffect] No target element found for path:', selectedPath?.toString(), 'property:', selectedPropertyName);
            // No specific element found, just reset the highlight flag
            useSelectionStore.getState().setHighlight(false);
        }

        // Cleanup on unmount
        return () => {
            if (animationTimeoutRef.current) {
                clearTimeout(animationTimeoutRef.current);
            }
        };
    }, [highlightSelection, selectedPath, selectedPropertyName]);
};

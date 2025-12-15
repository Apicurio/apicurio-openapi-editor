/**
 * Component for displaying a path with highlighted variable segments
 */

import React from 'react';

export interface PathLabelProps {
    /**
     * The path to display (may contain variables in curly braces)
     */
    path: string;

    /**
     * Optional CSS class name
     */
    className?: string;
}

/**
 * Displays a path with variables in curly braces highlighted
 * Example: /users/{userId}/posts/{postId}
 * The {userId} and {postId} segments will be highlighted in blue
 */
export const PathLabel: React.FC<PathLabelProps> = ({ path, className }) => {
    /**
     * Parse the path and split it into segments
     * Returns an array of objects with { text: string, isVariable: boolean }
     */
    const parsePath = (pathString: string): Array<{ text: string; isVariable: boolean }> => {
        const segments: Array<{ text: string; isVariable: boolean }> = [];
        let currentSegment = '';
        let inVariable = false;

        for (let i = 0; i < pathString.length; i++) {
            const char = pathString[i];

            if (char === '{') {
                // Save any accumulated non-variable text
                if (currentSegment) {
                    segments.push({ text: currentSegment, isVariable: false });
                    currentSegment = '';
                }
                inVariable = true;
                currentSegment = '{';
            } else if (char === '}' && inVariable) {
                currentSegment += '}';
                segments.push({ text: currentSegment, isVariable: true });
                currentSegment = '';
                inVariable = false;
            } else {
                currentSegment += char;
            }
        }

        // Add any remaining text
        if (currentSegment) {
            segments.push({ text: currentSegment, isVariable: inVariable });
        }

        return segments;
    };

    const segments = parsePath(path);

    return (
        <span className={className}>
            {segments.map((segment, index) => (
                <span
                    key={index}
                    style={
                        segment.isVariable
                            ? { color: '#0066CC', fontWeight: 'inherit' }
                            : undefined
                    }
                >
                    {segment.text}
                </span>
            ))}
        </span>
    );
};

/**
 * Component for displaying a server URL with highlighted variable segments
 */

import React from 'react';

export interface ServerUrlProps {
    /**
     * The server URL to display (may contain variables in curly braces)
     */
    url: string;

    /**
     * Optional CSS class name
     */
    className?: string;
}

/**
 * Displays a server URL with variables in curly braces highlighted
 * Example: http://{domain}.example.com:{port}/api
 * The {domain} and {port} segments will be highlighted in burnt orange
 */
export const ServerUrl: React.FC<ServerUrlProps> = ({ url, className }) => {
    /**
     * Parse the URL and split it into segments
     * Returns an array of objects with { text: string, isVariable: boolean }
     */
    const parseUrl = (urlString: string): Array<{ text: string; isVariable: boolean }> => {
        const segments: Array<{ text: string; isVariable: boolean }> = [];
        let currentSegment = '';
        let inVariable = false;

        for (let i = 0; i < urlString.length; i++) {
            const char = urlString[i];

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

    const segments = parseUrl(url);

    return (
        <span className={className}>
            {segments.map((segment, index) => (
                <span
                    key={index}
                    style={
                        segment.isVariable
                            ? { color: '#CC5500', fontWeight: 'inherit' }
                            : undefined
                    }
                >
                    {segment.text}
                </span>
            ))}
        </span>
    );
};

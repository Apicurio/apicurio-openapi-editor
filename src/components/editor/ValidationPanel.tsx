/**
 * Panel for displaying validation problems
 */

import React from 'react';
import {
    Title,
    List,
    ListItem,
    Label,
    EmptyState,
    EmptyStateBody,
} from '@patternfly/react-core';
import { ExclamationCircleIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { useValidation } from '@hooks/useValidation';
import { ValidationProblem, ValidationProblemSeverity } from '@apicurio/data-models';

export interface ValidationPanelProps {
}

/**
 * Renders a single validation problem
 */
const ValidationProblemItem: React.FC<{ problem: ValidationProblem }> = ({ problem }) => {
    const isError = problem.severity === ValidationProblemSeverity.high || problem.severity === ValidationProblemSeverity.medium;
    const icon = isError ? (
        <ExclamationCircleIcon color="var(--pf-v6-global--danger-color--100)" />
    ) : (
        <ExclamationTriangleIcon color="var(--pf-v6-global--warning-color--100)" />
    );

    return (
        <ListItem>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '0.25rem' }}>{icon}</div>
                <div style={{ flex: 1 }}>
                    <div>
                        <Label color={isError ? 'red' : 'orange'} isCompact>
                            {problem.errorCode || (isError ? 'Error' : 'Warning')}
                        </Label>
                        {' '}
                        <strong>{problem.message}</strong>
                    </div>
                    {problem.nodePath && (
                        <div style={{ fontSize: '0.875rem', color: 'var(--pf-v6-global--Color--200)', marginTop: '0.25rem' }}>
                            Path: {problem.nodePath.toString()}
                        </div>
                    )}
                </div>
            </div>
        </ListItem>
    );
};

/**
 * Panel that displays validation problems
 */
export const ValidationPanel: React.FC<ValidationPanelProps> = () => {
    const { problems, errorCount, warningCount, isValid } = useValidation();

    return (
        <div style={{ padding: '1rem' }}>
            <Title headingLevel="h2" size="xl" style={{ marginBottom: '1rem' }}>
                Validation Problems
            </Title>

            {isValid && warningCount === 0 ? (
                <EmptyState>
                    <div style={{ marginBottom: '1rem' }}>
                        <CheckCircleIcon color="var(--pf-v6-global--success-color--100)" style={{ fontSize: '3rem' }} />
                    </div>
                    <Title headingLevel="h3" size="lg">
                        No Problems Found
                    </Title>
                    <EmptyStateBody>
                        The OpenAPI document is valid with no errors or warnings.
                    </EmptyStateBody>
                </EmptyState>
            ) : (
                <div>
                    <div style={{ marginBottom: '1rem' }}>
                        {errorCount > 0 && (
                            <Label color="red" isCompact style={{ marginRight: '0.5rem' }}>
                                {errorCount} {errorCount === 1 ? 'Error' : 'Errors'}
                            </Label>
                        )}
                        {warningCount > 0 && (
                            <Label color="orange" isCompact>
                                {warningCount} {warningCount === 1 ? 'Warning' : 'Warnings'}
                            </Label>
                        )}
                    </div>
                    <List isBordered isPlain>
                        {problems.map((problem, index) => (
                            <ValidationProblemItem key={index} problem={problem} />
                        ))}
                    </List>
                </div>
            )}
        </div>
    );
};

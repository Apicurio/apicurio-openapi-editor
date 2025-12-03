/**
 * Service for validating OpenAPI documents
 */

import { ValidationProblem } from '@models/DocumentTypes';
import { DocumentService } from './DocumentService';

/**
 * ValidationService handles document validation
 */
export class ValidationService {
    private documentService: DocumentService;
    private cachedProblems: ValidationProblem[] = [];

    constructor(documentService: DocumentService) {
        this.documentService = documentService;
    }

    /**
     * Validate the current document
     */
    async validate(): Promise<ValidationProblem[]> {
        const problems = await this.documentService.validateDocument();
        this.cachedProblems = problems;
        return problems;
    }

    /**
     * Get cached validation problems (without re-validating)
     */
    getCachedProblems(): ValidationProblem[] {
        return this.cachedProblems;
    }

    /**
     * Get problems for a specific node path
     */
    getProblemsForPath(path: string): ValidationProblem[] {
        return this.cachedProblems.filter((p) => p.nodePath === path);
    }

    /**
     * Get error count
     */
    getErrorCount(): number {
        return this.cachedProblems.filter((p) => p.severity === 'error').length;
    }

    /**
     * Get warning count
     */
    getWarningCount(): number {
        return this.cachedProblems.filter((p) => p.severity === 'warning').length;
    }

    /**
     * Get info count
     */
    getInfoCount(): number {
        return this.cachedProblems.filter((p) => p.severity === 'info').length;
    }

    /**
     * Check if there are any errors
     */
    hasErrors(): boolean {
        return this.getErrorCount() > 0;
    }

    /**
     * Check if there are any warnings
     */
    hasWarnings(): boolean {
        return this.getWarningCount() > 0;
    }

    /**
     * Clear cached problems
     */
    clearCache(): void {
        this.cachedProblems = [];
    }
}

/**
 * Types related to UI state (modals, drawers, etc.)
 */

/**
 * UI state for the editor
 */
export interface UIState {
    /**
     * Whether the problems/validation drawer is open
     */
    isProblemsDrawerOpen: boolean;

    /**
     * Active modal dialogs
     */
    activeModal: string | null;

    /**
     * Modal-specific data/context
     */
    modalData: unknown;

    /**
     * Whether the master panel is expanded (for responsive layouts)
     */
    isMasterPanelExpanded: boolean;

    /**
     * Current theme (light/dark)
     */
    theme: 'light' | 'dark';
}

/**
 * Modal dialog identifiers
 */
export enum ModalType {
    ADD_PATH = 'add-path',
    RENAME_PATH = 'rename-path',
    ADD_SCHEMA = 'add-schema',
    ADD_RESPONSE = 'add-response',
    ADD_OPERATION = 'add-operation',
    ADD_PARAMETER = 'add-parameter',
    ADD_SECURITY_SCHEME = 'add-security-scheme',
}

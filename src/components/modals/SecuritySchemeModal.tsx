/**
 * Modal for creating or editing a security scheme
 */

import React, { useState, useEffect } from 'react';
import {
    Button,
    Form,
    FormGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Select,
    SelectOption,
    SelectList,
    MenuToggle,
    MenuToggleElement,
    TextInput,
    TextArea
} from '@patternfly/react-core';
import { useDocument } from '@hooks/useDocument';

interface SecuritySchemeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (data: SecuritySchemeData) => void;
    editData?: SecuritySchemeData | null;
}

export interface SecuritySchemeData {
    name: string;
    type: string;
    description: string;
    // API Key fields
    parameterName?: string;
    in?: string;
    // HTTP fields (3.0+)
    scheme?: string;
    bearerFormat?: string;
    // OAuth2 fields
    flow?: string;
    authorizationUrl?: string;
    tokenUrl?: string;
    // OpenID Connect fields (3.0+)
    openIdConnectUrl?: string;
}

/**
 * Modal component for creating or editing a security scheme
 */
export const SecuritySchemeModal: React.FC<SecuritySchemeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    editData
}) => {
    const { specVersion } = useDocument();
    const isEditMode = !!editData;

    const [name, setName] = useState('');
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [parameterName, setParameterName] = useState('');
    const [inLocation, setInLocation] = useState('header');
    const [httpScheme, setHttpScheme] = useState('');
    const [bearerFormat, setBearerFormat] = useState('');
    const [flow, setFlow] = useState('');
    const [authorizationUrl, setAuthorizationUrl] = useState('');
    const [tokenUrl, setTokenUrl] = useState('');
    const [openIdConnectUrl, setOpenIdConnectUrl] = useState('');

    const [isTypeSelectOpen, setIsTypeSelectOpen] = useState(false);
    const [isInSelectOpen, setIsInSelectOpen] = useState(false);
    const [isHttpSchemeSelectOpen, setIsHttpSchemeSelectOpen] = useState(false);
    const [isFlowSelectOpen, setIsFlowSelectOpen] = useState(false);

    /**
     * Load edit data when modal opens in edit mode
     */
    useEffect(() => {
        if (isOpen && editData) {
            setName(editData.name || '');
            setType(editData.type || '');
            setDescription(editData.description || '');
            setParameterName(editData.parameterName || '');
            setInLocation(editData.in || 'header');
            setHttpScheme(editData.scheme || '');
            setBearerFormat(editData.bearerFormat || '');
            setFlow(editData.flow || '');
            setAuthorizationUrl(editData.authorizationUrl || '');
            setTokenUrl(editData.tokenUrl || '');
            setOpenIdConnectUrl(editData.openIdConnectUrl || '');
        }
    }, [isOpen, editData]);

    /**
     * Get available security scheme types based on spec version
     */
    const getAvailableTypes = (): { value: string; label: string }[] => {
        if (specVersion === '2.0') {
            return [
                { value: 'basic', label: 'Basic Authentication' },
                { value: 'apiKey', label: 'API Key' },
                { value: 'oauth2', label: 'OAuth 2.0' }
            ];
        } else {
            return [
                { value: 'apiKey', label: 'API Key' },
                { value: 'http', label: 'HTTP' },
                { value: 'oauth2', label: 'OAuth 2.0' },
                { value: 'openIdConnect', label: 'OpenID Connect' }
            ];
        }
    };

    /**
     * Get available "in" locations for API Key
     */
    const getInLocations = (): { value: string; label: string }[] => {
        if (specVersion === '2.0') {
            return [
                { value: 'header', label: 'Header' },
                { value: 'query', label: 'Query Parameter' }
            ];
        } else {
            return [
                { value: 'header', label: 'Header' },
                { value: 'query', label: 'Query Parameter' },
                { value: 'cookie', label: 'Cookie' }
            ];
        }
    };

    /**
     * Get available HTTP authentication schemes from IANA registry
     * https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml
     */
    const getHttpSchemes = (): { value: string; label: string }[] => {
        return [
            { value: 'Basic', label: 'Basic' },
            { value: 'Bearer', label: 'Bearer' },
            { value: 'Concealed', label: 'Concealed' },
            { value: 'Digest', label: 'Digest' },
            { value: 'DPoP', label: 'DPoP' },
            { value: 'GNAP', label: 'GNAP' },
            { value: 'HOBA', label: 'HOBA' },
            { value: 'Mutual', label: 'Mutual' },
            { value: 'Negotiate', label: 'Negotiate' },
            { value: 'OAuth', label: 'OAuth' },
            { value: 'PrivateToken', label: 'PrivateToken' },
            { value: 'SCRAM-SHA-1', label: 'SCRAM-SHA-1' },
            { value: 'SCRAM-SHA-256', label: 'SCRAM-SHA-256' },
            { value: 'vapid', label: 'vapid' }
        ];
    };

    /**
     * Get available OAuth2 flows
     */
    const getOAuth2Flows = (): { value: string; label: string }[] => {
        if (specVersion === '2.0') {
            return [
                { value: 'implicit', label: 'Implicit' },
                { value: 'password', label: 'Password' },
                { value: 'application', label: 'Application' },
                { value: 'accessCode', label: 'Access Code' }
            ];
        } else {
            return [
                { value: 'implicit', label: 'Implicit' },
                { value: 'password', label: 'Password' },
                { value: 'clientCredentials', label: 'Client Credentials' },
                { value: 'authorizationCode', label: 'Authorization Code' }
            ];
        }
    };

    /**
     * Reset modal state
     */
    const resetState = () => {
        setName('');
        setType('');
        setDescription('');
        setParameterName('');
        setInLocation('header');
        setHttpScheme('');
        setBearerFormat('');
        setFlow('');
        setAuthorizationUrl('');
        setTokenUrl('');
        setOpenIdConnectUrl('');
    };

    /**
     * Handle modal close
     */
    const handleClose = () => {
        resetState();
        onClose();
    };

    /**
     * Handle confirm
     */
    const handleConfirm = () => {
        const data: SecuritySchemeData = {
            name: name.trim(),
            type,
            description: description.trim()
        };

        if (type === 'apiKey') {
            data.parameterName = parameterName.trim();
            data.in = inLocation;
        } else if (type === 'http') {
            data.scheme = httpScheme.trim();
            data.bearerFormat = bearerFormat.trim();
        } else if (type === 'oauth2') {
            data.flow = flow;
            data.authorizationUrl = authorizationUrl.trim();
            data.tokenUrl = tokenUrl.trim();
        } else if (type === 'openIdConnect') {
            data.openIdConnectUrl = openIdConnectUrl.trim();
        }

        onConfirm(data);
        handleClose();
    };

    /**
     * Check if form is valid
     */
    const isFormValid = (): boolean => {
        if (!name.trim() || !type) return false;

        if (type === 'apiKey') {
            return !!parameterName.trim() && !!inLocation;
        } else if (type === 'http') {
            return !!httpScheme.trim();
        } else if (type === 'oauth2') {
            if (!flow) return false;
            if (specVersion === '2.0') {
                if (flow === 'implicit' || flow === 'accessCode') {
                    if (!authorizationUrl.trim()) return false;
                }
                if (flow === 'password' || flow === 'application' || flow === 'accessCode') {
                    if (!tokenUrl.trim()) return false;
                }
            } else {
                if (flow === 'implicit' || flow === 'authorizationCode') {
                    if (!authorizationUrl.trim()) return false;
                }
                if (flow === 'password' || flow === 'clientCredentials' || flow === 'authorizationCode') {
                    if (!tokenUrl.trim()) return false;
                }
            }
        } else if (type === 'openIdConnect') {
            return !!openIdConnectUrl.trim();
        }

        return true;
    };

    const availableTypes = getAvailableTypes();
    const inLocations = getInLocations();
    const httpSchemes = getHttpSchemes();
    const oauth2Flows = getOAuth2Flows();

    return (
        <Modal
            variant="medium"
            isOpen={isOpen}
            onClose={handleClose}
            aria-labelledby="security-scheme-modal-title"
        >
            <ModalHeader
                title={isEditMode ? "Edit Security Scheme" : "Add Security Scheme"}
                labelId="security-scheme-modal-title"
            />
            <ModalBody>
                <Form>
                    <FormGroup label="Name" isRequired fieldId="scheme-name">
                        <TextInput
                            id="scheme-name"
                            value={name}
                            onChange={(_event, value) => setName(value)}
                            placeholder="e.g., api_key, oauth2"
                            isDisabled={isEditMode}
                        />
                    </FormGroup>

                    <FormGroup label="Type" isRequired fieldId="scheme-type">
                        <Select
                            id="scheme-type"
                            isOpen={isTypeSelectOpen}
                            selected={type}
                            onSelect={(_event, value) => {
                                setType(value as string);
                                setIsTypeSelectOpen(false);
                            }}
                            onOpenChange={(isOpen) => setIsTypeSelectOpen(isOpen)}
                            toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                <MenuToggle
                                    ref={toggleRef}
                                    onClick={() => setIsTypeSelectOpen(!isTypeSelectOpen)}
                                    isExpanded={isTypeSelectOpen}
                                    style={{ width: '100%' }}
                                >
                                    {type ? availableTypes.find(t => t.value === type)?.label : 'Select a type...'}
                                </MenuToggle>
                            )}
                        >
                            <SelectList>
                                {availableTypes.map((typeOption) => (
                                    <SelectOption key={typeOption.value} value={typeOption.value}>
                                        {typeOption.label}
                                    </SelectOption>
                                ))}
                            </SelectList>
                        </Select>
                    </FormGroup>

                    <FormGroup label="Description" fieldId="scheme-description">
                        <TextArea
                            id="scheme-description"
                            value={description}
                            onChange={(_event, value) => setDescription(value)}
                            placeholder="Description of this security scheme"
                            rows={3}
                        />
                    </FormGroup>

                    {/* API Key specific fields */}
                    {type === 'apiKey' && (
                        <>
                            <FormGroup label="Location" isRequired fieldId="in-location">
                                <Select
                                    id="in-location"
                                    isOpen={isInSelectOpen}
                                    selected={inLocation}
                                    onSelect={(_event, value) => {
                                        setInLocation(value as string);
                                        setIsInSelectOpen(false);
                                    }}
                                    onOpenChange={(isOpen) => setIsInSelectOpen(isOpen)}
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={() => setIsInSelectOpen(!isInSelectOpen)}
                                            isExpanded={isInSelectOpen}
                                            style={{ width: '100%' }}
                                        >
                                            {inLocations.find(l => l.value === inLocation)?.label}
                                        </MenuToggle>
                                    )}
                                >
                                    <SelectList>
                                        {inLocations.map((location) => (
                                            <SelectOption key={location.value} value={location.value}>
                                                {location.label}
                                            </SelectOption>
                                        ))}
                                    </SelectList>
                                </Select>
                            </FormGroup>

                            <FormGroup label="Parameter Name" isRequired fieldId="parameter-name">
                                <TextInput
                                    id="parameter-name"
                                    value={parameterName}
                                    onChange={(_event, value) => setParameterName(value)}
                                    placeholder="e.g., X-API-Key, api_key"
                                />
                            </FormGroup>
                        </>
                    )}

                    {/* HTTP specific fields (3.0+ only) */}
                    {type === 'http' && specVersion !== '2.0' && (
                        <>
                            <FormGroup label="Scheme" isRequired fieldId="http-scheme">
                                <Select
                                    id="http-scheme"
                                    isOpen={isHttpSchemeSelectOpen}
                                    selected={httpScheme}
                                    onSelect={(_event, value) => {
                                        setHttpScheme(value as string);
                                        setIsHttpSchemeSelectOpen(false);
                                    }}
                                    onOpenChange={(isOpen) => setIsHttpSchemeSelectOpen(isOpen)}
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={() => setIsHttpSchemeSelectOpen(!isHttpSchemeSelectOpen)}
                                            isExpanded={isHttpSchemeSelectOpen}
                                            style={{ width: '100%' }}
                                        >
                                            {httpScheme || 'Select a scheme...'}
                                        </MenuToggle>
                                    )}
                                >
                                    <SelectList>
                                        {httpSchemes.map((scheme) => (
                                            <SelectOption key={scheme.value} value={scheme.value}>
                                                {scheme.label}
                                            </SelectOption>
                                        ))}
                                    </SelectList>
                                </Select>
                            </FormGroup>

                            {httpScheme.toLowerCase() === 'bearer' && (
                                <FormGroup label="Bearer Format" fieldId="bearer-format">
                                    <TextInput
                                        id="bearer-format"
                                        value={bearerFormat}
                                        onChange={(_event, value) => setBearerFormat(value)}
                                        placeholder="e.g., JWT"
                                    />
                                </FormGroup>
                            )}
                        </>
                    )}

                    {/* OAuth2 specific fields */}
                    {type === 'oauth2' && (
                        <>
                            <FormGroup label="Flow" isRequired fieldId="oauth2-flow">
                                <Select
                                    id="oauth2-flow"
                                    isOpen={isFlowSelectOpen}
                                    selected={flow}
                                    onSelect={(_event, value) => {
                                        setFlow(value as string);
                                        setIsFlowSelectOpen(false);
                                    }}
                                    onOpenChange={(isOpen) => setIsFlowSelectOpen(isOpen)}
                                    toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
                                        <MenuToggle
                                            ref={toggleRef}
                                            onClick={() => setIsFlowSelectOpen(!isFlowSelectOpen)}
                                            isExpanded={isFlowSelectOpen}
                                            style={{ width: '100%' }}
                                        >
                                            {flow ? oauth2Flows.find(f => f.value === flow)?.label : 'Select a flow...'}
                                        </MenuToggle>
                                    )}
                                >
                                    <SelectList>
                                        {oauth2Flows.map((flowOption) => (
                                            <SelectOption key={flowOption.value} value={flowOption.value}>
                                                {flowOption.label}
                                            </SelectOption>
                                        ))}
                                    </SelectList>
                                </Select>
                            </FormGroup>

                            {(flow === 'implicit' || flow === 'accessCode' || flow === 'authorizationCode') && (
                                <FormGroup label="Authorization URL" isRequired fieldId="authorization-url">
                                    <TextInput
                                        id="authorization-url"
                                        value={authorizationUrl}
                                        onChange={(_event, value) => setAuthorizationUrl(value)}
                                        placeholder="https://example.com/oauth/authorize"
                                    />
                                </FormGroup>
                            )}

                            {(flow === 'password' || flow === 'application' || flow === 'clientCredentials' || flow === 'accessCode' || flow === 'authorizationCode') && (
                                <FormGroup label="Token URL" isRequired fieldId="token-url">
                                    <TextInput
                                        id="token-url"
                                        value={tokenUrl}
                                        onChange={(_event, value) => setTokenUrl(value)}
                                        placeholder="https://example.com/oauth/token"
                                    />
                                </FormGroup>
                            )}
                        </>
                    )}

                    {/* OpenID Connect specific fields (3.0+ only) */}
                    {type === 'openIdConnect' && specVersion !== '2.0' && (
                        <FormGroup label="OpenID Connect URL" isRequired fieldId="openid-connect-url">
                            <TextInput
                                id="openid-connect-url"
                                value={openIdConnectUrl}
                                onChange={(_event, value) => setOpenIdConnectUrl(value)}
                                placeholder="https://example.com/.well-known/openid-configuration"
                            />
                        </FormGroup>
                    )}
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                    isDisabled={!isFormValid()}
                >
                    {isEditMode ? "Save" : "Add"}
                </Button>
                <Button variant="link" onClick={handleClose}>
                    Cancel
                </Button>
            </ModalFooter>
        </Modal>
    );
};

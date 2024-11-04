// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { AuthenticationRequiredError, CredentialUnavailableError } from "../../errors";
import { formatSuccess } from "../../util/logging";
import { ensureValidMsalToken, getAuthority, getKnownAuthorities, msalToPublic } from "../utils";
import { processMultiTenantRequest, resolveAdditionallyAllowedTenantIds, resolveTenantId, } from "../../util/tenantIdUtils";
import { DefaultTenantId } from "../../constants";
/**
 * Generates a MSAL configuration that generally works for browsers
 * @internal
 */
export function defaultBrowserMsalConfig(options) {
    const tenantId = options.tenantId || DefaultTenantId;
    const authority = getAuthority(tenantId, options.authorityHost);
    return {
        auth: {
            clientId: options.clientId,
            authority,
            knownAuthorities: getKnownAuthorities(tenantId, authority, options.disableInstanceDiscovery),
            // If the users picked redirect as their login style,
            // but they didn't provide a redirectUri,
            // we can try to use the current page we're in as a default value.
            redirectUri: options.redirectUri || self.location.origin,
        },
    };
}
/**
 * MSAL partial base client for the browsers.
 *
 * It completes the input configuration with some default values.
 * It also provides with utility protected methods that can be used from any of the clients,
 * which includes handlers for successful responses and errors.
 *
 * @internal
 */
export class MsalBrowser {
    constructor(options) {
        var _a;
        this.logger = options.logger;
        this.loginStyle = options.loginStyle;
        if (!options.clientId) {
            throw new CredentialUnavailableError("A client ID is required in browsers");
        }
        this.clientId = options.clientId;
        this.additionallyAllowedTenantIds = resolveAdditionallyAllowedTenantIds((_a = options === null || options === void 0 ? void 0 : options.tokenCredentialOptions) === null || _a === void 0 ? void 0 : _a.additionallyAllowedTenants);
        this.tenantId = resolveTenantId(this.logger, options.tenantId, options.clientId);
        this.authorityHost = options.authorityHost;
        this.msalConfig = defaultBrowserMsalConfig(options);
        this.disableAutomaticAuthentication = options.disableAutomaticAuthentication;
        if (options.authenticationRecord) {
            this.account = Object.assign(Object.assign({}, options.authenticationRecord), { tenantId: this.tenantId });
        }
    }
    /**
     * In the browsers we don't need to init()
     */
    async init() {
        // Nothing to do here.
    }
    /**
     * Clears MSAL's cache.
     */
    async logout() {
        var _a;
        (_a = this.app) === null || _a === void 0 ? void 0 : _a.logout();
    }
    /**
     * Attempts to retrieve an authenticated token from MSAL.
     */
    async getToken(scopes, options = {}) {
        const tenantId = processMultiTenantRequest(this.tenantId, options, this.additionallyAllowedTenantIds) ||
            this.tenantId;
        if (!options.authority) {
            options.authority = getAuthority(tenantId, this.authorityHost);
        }
        // We ensure that redirection is handled at this point.
        await this.handleRedirect();
        if (!(await this.getActiveAccount()) && !this.disableAutomaticAuthentication) {
            await this.login(scopes);
        }
        return this.getTokenSilent(scopes).catch((err) => {
            if (err.name !== "AuthenticationRequiredError") {
                throw err;
            }
            if (options === null || options === void 0 ? void 0 : options.disableAutomaticAuthentication) {
                throw new AuthenticationRequiredError({
                    scopes,
                    getTokenOptions: options,
                    message: "Automatic authentication has been disabled. You may call the authentication() method.",
                });
            }
            this.logger.info(`Silent authentication failed, falling back to interactive method ${this.loginStyle}`);
            return this.doGetToken(scopes);
        });
    }
    /**
     * Handles the MSAL authentication result.
     * If the result has an account, we update the local account reference.
     * If the token received is invalid, an error will be thrown depending on what's missing.
     */
    handleResult(scopes, result, getTokenOptions) {
        var _a;
        if (result === null || result === void 0 ? void 0 : result.account) {
            this.account = msalToPublic(this.clientId, result.account);
        }
        ensureValidMsalToken(scopes, result, getTokenOptions);
        this.logger.getToken.info(formatSuccess(scopes));
        return {
            token: result.accessToken,
            expiresOnTimestamp: result.expiresOn.getTime(),
            refreshAfterTimestamp: (_a = result.refreshOn) === null || _a === void 0 ? void 0 : _a.getTime(),
            tokenType: "Bearer",
        };
    }
}
//# sourceMappingURL=msalBrowserCommon.js.map
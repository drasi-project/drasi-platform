import { BaseClient } from "./BaseClient.js";
import { CommonAuthorizationUrlRequest } from "../request/CommonAuthorizationUrlRequest.js";
import { CommonAuthorizationCodeRequest } from "../request/CommonAuthorizationCodeRequest.js";
import { ClientConfiguration } from "../config/ClientConfiguration.js";
import { AuthenticationResult } from "../response/AuthenticationResult.js";
import { ServerAuthorizationCodeResponse } from "../response/ServerAuthorizationCodeResponse.js";
import { CommonEndSessionRequest } from "../request/CommonEndSessionRequest.js";
import { AuthorizationCodePayload } from "../response/AuthorizationCodePayload.js";
import { IPerformanceClient } from "../telemetry/performance/IPerformanceClient.js";
/**
 * Oauth2.0 Authorization Code client
 * @internal
 */
export declare class AuthorizationCodeClient extends BaseClient {
    protected includeRedirectUri: boolean;
    private oidcDefaultScopes;
    constructor(configuration: ClientConfiguration, performanceClient?: IPerformanceClient);
    /**
     * Creates the URL of the authorization request letting the user input credentials and consent to the
     * application. The URL target the /authorize endpoint of the authority configured in the
     * application object.
     *
     * Once the user inputs their credentials and consents, the authority will send a response to the redirect URI
     * sent in the request and should contain an authorization code, which can then be used to acquire tokens via
     * acquireToken(AuthorizationCodeRequest)
     * @param request
     */
    getAuthCodeUrl(request: CommonAuthorizationUrlRequest): Promise<string>;
    /**
     * API to acquire a token in exchange of 'authorization_code` acquired by the user in the first leg of the
     * authorization_code_grant
     * @param request
     */
    acquireToken(request: CommonAuthorizationCodeRequest, authCodePayload?: AuthorizationCodePayload): Promise<AuthenticationResult>;
    /**
     * Handles the hash fragment response from public client code request. Returns a code response used by
     * the client to exchange for a token in acquireToken.
     * @param hashFragment
     */
    handleFragmentResponse(serverParams: ServerAuthorizationCodeResponse, cachedState: string): AuthorizationCodePayload;
    /**
     * Used to log out the current user, and redirect the user to the postLogoutRedirectUri.
     * Default behaviour is to redirect the user to `window.location.href`.
     * @param authorityUri
     */
    getLogoutUri(logoutRequest: CommonEndSessionRequest): string;
    /**
     * Executes POST request to token endpoint
     * @param authority
     * @param request
     */
    private executeTokenRequest;
    /**
     * Generates a map for all the params to be sent to the service
     * @param request
     */
    private createTokenRequestBody;
    /**
     * This API validates the `AuthorizationCodeUrlRequest` and creates a URL
     * @param request
     */
    private createAuthCodeUrlQueryString;
    /**
     * This API validates the `EndSessionRequest` and creates a URL
     * @param request
     */
    private createLogoutUrlQueryString;
    private addExtraQueryParams;
    /**
     * Helper to get sid from account. Returns null if idTokenClaims are not present or sid is not present.
     * @param account
     */
    private extractAccountSid;
    private extractLoginHint;
}
//# sourceMappingURL=AuthorizationCodeClient.d.ts.map
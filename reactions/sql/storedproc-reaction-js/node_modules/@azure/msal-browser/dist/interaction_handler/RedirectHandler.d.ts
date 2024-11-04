import { AuthorizationCodeClient, CommonAuthorizationCodeRequest, Logger, IPerformanceClient, CcsCredential, ServerAuthorizationCodeResponse } from "@azure/msal-common/browser";
import { BrowserCacheManager } from "../cache/BrowserCacheManager.js";
import { INavigationClient } from "../navigation/INavigationClient.js";
import { AuthenticationResult } from "../response/AuthenticationResult.js";
export type RedirectParams = {
    navigationClient: INavigationClient;
    redirectTimeout: number;
    redirectStartPage: string;
    onRedirectNavigate?: (url: string) => void | boolean;
};
export declare class RedirectHandler {
    authModule: AuthorizationCodeClient;
    browserStorage: BrowserCacheManager;
    authCodeRequest: CommonAuthorizationCodeRequest;
    logger: Logger;
    performanceClient: IPerformanceClient;
    constructor(authCodeModule: AuthorizationCodeClient, storageImpl: BrowserCacheManager, authCodeRequest: CommonAuthorizationCodeRequest, logger: Logger, performanceClient: IPerformanceClient);
    /**
     * Redirects window to given URL.
     * @param urlNavigate
     */
    initiateAuthRequest(requestUrl: string, params: RedirectParams): Promise<void>;
    /**
     * Handle authorization code response in the window.
     * @param hash
     */
    handleCodeResponse(response: ServerAuthorizationCodeResponse, state: string): Promise<AuthenticationResult>;
    /**
     * Looks up ccs creds in the cache
     */
    protected checkCcsCredentials(): CcsCredential | null;
}
//# sourceMappingURL=RedirectHandler.d.ts.map
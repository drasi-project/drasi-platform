import { ICrypto, Logger, AuthorizationCodeClient, IPerformanceClient } from "@azure/msal-common/browser";
import { StandardInteractionClient } from "./StandardInteractionClient.js";
import { AuthorizationUrlRequest } from "../request/AuthorizationUrlRequest.js";
import { BrowserConfiguration } from "../config/Configuration.js";
import { BrowserCacheManager } from "../cache/BrowserCacheManager.js";
import { EventHandler } from "../event/EventHandler.js";
import { INavigationClient } from "../navigation/INavigationClient.js";
import { ApiId } from "../utils/BrowserConstants.js";
import { SsoSilentRequest } from "../request/SsoSilentRequest.js";
import { NativeMessageHandler } from "../broker/nativeBroker/NativeMessageHandler.js";
import { AuthenticationResult } from "../response/AuthenticationResult.js";
export declare class SilentIframeClient extends StandardInteractionClient {
    protected apiId: ApiId;
    protected nativeStorage: BrowserCacheManager;
    constructor(config: BrowserConfiguration, storageImpl: BrowserCacheManager, browserCrypto: ICrypto, logger: Logger, eventHandler: EventHandler, navigationClient: INavigationClient, apiId: ApiId, performanceClient: IPerformanceClient, nativeStorageImpl: BrowserCacheManager, nativeMessageHandler?: NativeMessageHandler, correlationId?: string);
    /**
     * Acquires a token silently by opening a hidden iframe to the /authorize endpoint with prompt=none or prompt=no_session
     * @param request
     */
    acquireToken(request: SsoSilentRequest): Promise<AuthenticationResult>;
    /**
     * Currently Unsupported
     */
    logout(): Promise<void>;
    /**
     * Helper which acquires an authorization code silently using a hidden iframe from given url
     * using the scopes requested as part of the id, and exchanges the code for a set of OAuth tokens.
     * @param navigateUrl
     * @param userRequestScopes
     */
    protected silentTokenHelper(authClient: AuthorizationCodeClient, silentRequest: AuthorizationUrlRequest): Promise<AuthenticationResult>;
}
//# sourceMappingURL=SilentIframeClient.d.ts.map
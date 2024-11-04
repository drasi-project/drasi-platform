import { Logger, IPerformanceClient, ServerResponseType } from "@azure/msal-common/browser";
/**
 * Creates a hidden iframe to given URL using user-requested scopes as an id.
 * @param urlNavigate
 * @param userRequestScopes
 */
export declare function initiateAuthRequest(requestUrl: string, performanceClient: IPerformanceClient, logger: Logger, correlationId: string, navigateFrameWait?: number): Promise<HTMLIFrameElement>;
/**
 * Monitors an iframe content window until it loads a url with a known hash, or hits a specified timeout.
 * @param iframe
 * @param timeout
 */
export declare function monitorIframeForHash(iframe: HTMLIFrameElement, timeout: number, pollIntervalMilliseconds: number, performanceClient: IPerformanceClient, logger: Logger, correlationId: string, responseType: ServerResponseType): Promise<string>;
//# sourceMappingURL=SilentHandler.d.ts.map
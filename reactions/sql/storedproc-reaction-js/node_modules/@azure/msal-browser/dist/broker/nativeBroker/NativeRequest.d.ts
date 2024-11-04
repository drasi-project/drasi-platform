import { NativeExtensionMethod } from "../../utils/BrowserConstants.js";
import { StoreInCache, StringDict } from "@azure/msal-common/browser";
/**
 * Token request which native broker will use to acquire tokens
 */
export type NativeTokenRequest = {
    accountId: string;
    clientId: string;
    authority: string;
    redirectUri: string;
    scope: string;
    correlationId: string;
    windowTitleSubstring: string;
    prompt?: string;
    nonce?: string;
    claims?: string;
    state?: string;
    reqCnf?: string;
    keyId?: string;
    tokenType?: string;
    shrClaims?: string;
    shrNonce?: string;
    resourceRequestMethod?: string;
    resourceRequestUri?: string;
    extendedExpiryToken?: boolean;
    extraParameters?: StringDict;
    storeInCache?: StoreInCache;
    signPopToken?: boolean;
};
/**
 * Request which will be forwarded to native broker by the browser extension
 */
export type NativeExtensionRequestBody = {
    method: NativeExtensionMethod;
    request?: NativeTokenRequest;
};
/**
 * Browser extension request
 */
export type NativeExtensionRequest = {
    channel: string;
    responseId: string;
    extensionId?: string;
    body: NativeExtensionRequestBody;
};
//# sourceMappingURL=NativeRequest.d.ts.map
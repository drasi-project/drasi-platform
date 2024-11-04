import { CommonAuthorizationUrlRequest } from "@azure/msal-common/browser";
/**
 * This type is deprecated and will be removed on the next major version update
 */
export type AuthorizationUrlRequest = Omit<CommonAuthorizationUrlRequest, "state" | "nonce" | "requestedClaimsHash" | "nativeBroker"> & {
    state: string;
    nonce: string;
};
//# sourceMappingURL=AuthorizationUrlRequest.d.ts.map
import { ServerAuthorizationCodeResponse } from "../response/ServerAuthorizationCodeResponse.js";
/**
 * Parses hash string from given string. Returns empty string if no hash symbol is found.
 * @param hashString
 */
export declare function stripLeadingHashOrQuery(responseString: string): string;
/**
 * Returns URL hash as server auth code response object.
 */
export declare function getDeserializedResponse(responseString: string): ServerAuthorizationCodeResponse | null;
//# sourceMappingURL=UrlUtils.d.ts.map
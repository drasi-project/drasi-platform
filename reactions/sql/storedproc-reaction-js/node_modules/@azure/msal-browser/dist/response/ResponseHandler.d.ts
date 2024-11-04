import { ICrypto, Logger, ServerAuthorizationCodeResponse } from "@azure/msal-common/browser";
import { InteractionType } from "../utils/BrowserConstants.js";
export declare function deserializeResponse(responseString: string, responseLocation: string, logger: Logger): ServerAuthorizationCodeResponse;
/**
 * Returns the interaction type that the response object belongs to
 */
export declare function validateInteractionType(response: ServerAuthorizationCodeResponse, browserCrypto: ICrypto, interactionType: InteractionType): void;
//# sourceMappingURL=ResponseHandler.d.ts.map
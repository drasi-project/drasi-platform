// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { credentialLogger, formatError } from "../util/logging";
const BrowserNotSupportedError = new Error("VisualStudioCodeCredential is not supported in the browser.");
const logger = credentialLogger("VisualStudioCodeCredential");
export const vsCodeCredentialControl = {
    set vsCodeCredentialFinder(_finder) {
        throw new Error("Attempted to register a VisualStudioCodeCredential provider plugin in the browser. This environment is not supported by VisualStudioCodeCredential.");
    },
};
/**
 * Connects to Azure using the credential provided by the VSCode extension 'Azure Account'.
 */
export class VisualStudioCodeCredential {
    /**
     * Only available in Node.js
     */
    constructor() {
        logger.info(formatError("", BrowserNotSupportedError));
        throw BrowserNotSupportedError;
    }
    getToken() {
        logger.getToken.info(formatError("", BrowserNotSupportedError));
        throw BrowserNotSupportedError;
    }
}
//# sourceMappingURL=visualStudioCodeCredential.browser.js.map
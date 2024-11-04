// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { credentialLogger, formatError } from "../util/logging";
import { ChainedTokenCredential } from "./chainedTokenCredential";
const BrowserNotSupportedError = new Error("ApplicationCredential is not supported in the browser. Use InteractiveBrowserCredential instead.");
const logger = credentialLogger("ApplicationCredential");
/**
 * Provides a default {@link ChainedTokenCredential} configuration for
 * applications that will be deployed to Azure.
 *
 * Only available in Node.js
 */
export class AzureApplicationCredential extends ChainedTokenCredential {
    /**
     * Creates an instance of the AzureApplicationCredential class.
     *
     * The AzureApplicationCredential provides a default {@link ChainedTokenCredential} configuration for
     * applications that will be deployed to Azure.
     *
     * Only available in Node.js
     *
     * @param options - Options for configuring the client which makes the authentication request.
     */
    constructor(_tokenCredentialOptions) {
        super();
        logger.info(formatError("", BrowserNotSupportedError));
        throw BrowserNotSupportedError;
    }
    getToken() {
        logger.getToken.info(formatError("", BrowserNotSupportedError));
        throw BrowserNotSupportedError;
    }
}
//# sourceMappingURL=azureApplicationCredential.browser.js.map
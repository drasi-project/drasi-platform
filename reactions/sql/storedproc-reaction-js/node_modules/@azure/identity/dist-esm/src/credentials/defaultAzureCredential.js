// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ManagedIdentityCredential, } from "./managedIdentityCredential";
import { AzureCliCredential } from "./azureCliCredential";
import { AzureDeveloperCliCredential } from "./azureDeveloperCliCredential";
import { AzurePowerShellCredential } from "./azurePowerShellCredential";
import { ChainedTokenCredential } from "./chainedTokenCredential";
import { EnvironmentCredential } from "./environmentCredential";
import { WorkloadIdentityCredential } from "./workloadIdentityCredential";
import { credentialLogger } from "../util/logging";
const logger = credentialLogger("DefaultAzureCredential");
/**
 * Creates a {@link ManagedIdentityCredential} from the provided options.
 * @param options - Options to configure the credential.
 *
 * @internal
 */
export function createDefaultManagedIdentityCredential(options = {}) {
    var _a, _b, _c, _d;
    (_a = options.retryOptions) !== null && _a !== void 0 ? _a : (options.retryOptions = {
        maxRetries: 5,
        retryDelayInMs: 800,
    });
    const managedIdentityClientId = (_b = options === null || options === void 0 ? void 0 : options.managedIdentityClientId) !== null && _b !== void 0 ? _b : process.env.AZURE_CLIENT_ID;
    const workloadIdentityClientId = (_c = options === null || options === void 0 ? void 0 : options.workloadIdentityClientId) !== null && _c !== void 0 ? _c : managedIdentityClientId;
    const managedResourceId = options === null || options === void 0 ? void 0 : options.managedIdentityResourceId;
    const workloadFile = process.env.AZURE_FEDERATED_TOKEN_FILE;
    const tenantId = (_d = options === null || options === void 0 ? void 0 : options.tenantId) !== null && _d !== void 0 ? _d : process.env.AZURE_TENANT_ID;
    if (managedResourceId) {
        const managedIdentityResourceIdOptions = Object.assign(Object.assign({}, options), { resourceId: managedResourceId });
        return new ManagedIdentityCredential(managedIdentityResourceIdOptions);
    }
    if (workloadFile && workloadIdentityClientId) {
        const workloadIdentityCredentialOptions = Object.assign(Object.assign({}, options), { tenantId: tenantId });
        return new ManagedIdentityCredential(workloadIdentityClientId, workloadIdentityCredentialOptions);
    }
    if (managedIdentityClientId) {
        const managedIdentityClientOptions = Object.assign(Object.assign({}, options), { clientId: managedIdentityClientId });
        return new ManagedIdentityCredential(managedIdentityClientOptions);
    }
    // We may be able to return a UnavailableCredential here, but that may be a breaking change
    return new ManagedIdentityCredential(options);
}
/**
 * Creates a {@link WorkloadIdentityCredential} from the provided options.
 * @param options - Options to configure the credential.
 *
 * @internal
 */
function createDefaultWorkloadIdentityCredential(options) {
    var _a, _b, _c;
    const managedIdentityClientId = (_a = options === null || options === void 0 ? void 0 : options.managedIdentityClientId) !== null && _a !== void 0 ? _a : process.env.AZURE_CLIENT_ID;
    const workloadIdentityClientId = (_b = options === null || options === void 0 ? void 0 : options.workloadIdentityClientId) !== null && _b !== void 0 ? _b : managedIdentityClientId;
    const workloadFile = process.env.AZURE_FEDERATED_TOKEN_FILE;
    const tenantId = (_c = options === null || options === void 0 ? void 0 : options.tenantId) !== null && _c !== void 0 ? _c : process.env.AZURE_TENANT_ID;
    if (workloadFile && workloadIdentityClientId) {
        const workloadIdentityCredentialOptions = Object.assign(Object.assign({}, options), { tenantId, clientId: workloadIdentityClientId, tokenFilePath: workloadFile });
        return new WorkloadIdentityCredential(workloadIdentityCredentialOptions);
    }
    if (tenantId) {
        const workloadIdentityClientTenantOptions = Object.assign(Object.assign({}, options), { tenantId });
        return new WorkloadIdentityCredential(workloadIdentityClientTenantOptions);
    }
    // We may be able to return a UnavailableCredential here, but that may be a breaking change
    return new WorkloadIdentityCredential(options);
}
/**
 * Creates a {@link AzureDeveloperCliCredential} from the provided options.
 * @param options - Options to configure the credential.
 *
 * @internal
 */
function createDefaultAzureDeveloperCliCredential(options = {}) {
    const processTimeoutInMs = options.processTimeoutInMs;
    return new AzureDeveloperCliCredential(Object.assign({ processTimeoutInMs }, options));
}
/**
 * Creates a {@link AzureCliCredential} from the provided options.
 * @param options - Options to configure the credential.
 *
 * @internal
 */
function createDefaultAzureCliCredential(options = {}) {
    const processTimeoutInMs = options.processTimeoutInMs;
    return new AzureCliCredential(Object.assign({ processTimeoutInMs }, options));
}
/**
 * Creates a {@link AzurePowerShellCredential} from the provided options.
 * @param options - Options to configure the credential.
 *
 * @internal
 */
function createDefaultAzurePowershellCredential(options = {}) {
    const processTimeoutInMs = options.processTimeoutInMs;
    return new AzurePowerShellCredential(Object.assign({ processTimeoutInMs }, options));
}
/**
 * Creates an {@link EnvironmentCredential} from the provided options.
 * @param options - Options to configure the credential.
 *
 * @internal
 */
export function createEnvironmentCredential(options = {}) {
    return new EnvironmentCredential(options);
}
/**
 * A no-op credential that logs the reason it was skipped if getToken is called.
 * @internal
 */
export class UnavailableDefaultCredential {
    constructor(credentialName, message) {
        this.credentialName = credentialName;
        this.credentialUnavailableErrorMessage = message;
    }
    getToken() {
        logger.getToken.info(`Skipping ${this.credentialName}, reason: ${this.credentialUnavailableErrorMessage}`);
        return Promise.resolve(null);
    }
}
/**
 * Provides a default {@link ChainedTokenCredential} configuration that should
 * work for most applications that use the Azure SDK.
 */
export class DefaultAzureCredential extends ChainedTokenCredential {
    constructor(options) {
        const credentialFunctions = [
            createEnvironmentCredential,
            createDefaultWorkloadIdentityCredential,
            createDefaultManagedIdentityCredential,
            createDefaultAzureCliCredential,
            createDefaultAzurePowershellCredential,
            createDefaultAzureDeveloperCliCredential,
        ];
        // DefaultCredential constructors should not throw, instead throwing on getToken() which is handled by ChainedTokenCredential.
        // When adding new credentials to the default chain, consider:
        // 1. Making the constructor parameters required and explicit
        // 2. Validating any required parameters in the factory function
        // 3. Returning a UnavailableDefaultCredential from the factory function if a credential is unavailable for any reason
        const credentials = credentialFunctions.map((createCredentialFn) => {
            try {
                return createCredentialFn(options);
            }
            catch (err) {
                logger.warning(`Skipped ${createCredentialFn.name} because of an error creating the credential: ${err}`);
                return new UnavailableDefaultCredential(createCredentialFn.name, err.message);
            }
        });
        super(...credentials);
    }
}
//# sourceMappingURL=defaultAzureCredential.js.map
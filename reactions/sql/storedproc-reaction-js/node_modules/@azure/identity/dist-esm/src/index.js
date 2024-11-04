// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
export * from "./plugins/consumer";
import { DefaultAzureCredential } from "./credentials/defaultAzureCredential";
export { AuthenticationError, AggregateAuthenticationError, AuthenticationErrorName, AggregateAuthenticationErrorName, CredentialUnavailableError, CredentialUnavailableErrorName, AuthenticationRequiredError, } from "./errors";
export { serializeAuthenticationRecord, deserializeAuthenticationRecord } from "./msal/utils";
export { ChainedTokenCredential } from "./credentials/chainedTokenCredential";
export { ClientSecretCredential } from "./credentials/clientSecretCredential";
export { DefaultAzureCredential } from "./credentials/defaultAzureCredential";
export { EnvironmentCredential } from "./credentials/environmentCredential";
export { ClientCertificateCredential, } from "./credentials/clientCertificateCredential";
export { ClientAssertionCredential } from "./credentials/clientAssertionCredential";
export { AzureCliCredential } from "./credentials/azureCliCredential";
export { AzureDeveloperCliCredential } from "./credentials/azureDeveloperCliCredential";
export { InteractiveBrowserCredential } from "./credentials/interactiveBrowserCredential";
export { ManagedIdentityCredential, } from "./credentials/managedIdentityCredential";
export { DeviceCodeCredential } from "./credentials/deviceCodeCredential";
export { AzurePipelinesCredential as AzurePipelinesCredential } from "./credentials/azurePipelinesCredential";
export { AuthorizationCodeCredential } from "./credentials/authorizationCodeCredential";
export { AzurePowerShellCredential } from "./credentials/azurePowerShellCredential";
export { UsernamePasswordCredential } from "./credentials/usernamePasswordCredential";
export { VisualStudioCodeCredential } from "./credentials/visualStudioCodeCredential";
export { OnBehalfOfCredential } from "./credentials/onBehalfOfCredential";
export { WorkloadIdentityCredential } from "./credentials/workloadIdentityCredential";
export { logger } from "./util/logging";
export { AzureAuthorityHosts } from "./constants";
/**
 * Returns a new instance of the {@link DefaultAzureCredential}.
 */
export function getDefaultAzureCredential() {
    return new DefaultAzureCredential();
}
export { getBearerTokenProvider } from "./tokenProvider";
//# sourceMappingURL=index.js.map
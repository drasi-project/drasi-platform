// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { MsalMsiProvider } from "./msalMsiProvider";
/**
 * Attempts authentication using a managed identity available at the deployment environment.
 * This authentication type works in Azure VMs, App Service instances, Azure Functions applications,
 * Azure Kubernetes Services, Azure Service Fabric instances and inside of the Azure Cloud Shell.
 *
 * More information about configuring managed identities can be found here:
 * https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview
 */
export class ManagedIdentityCredential {
    /**
     * @internal
     * @hidden
     */
    constructor(clientIdOrOptions, options) {
        // https://github.com/Azure/azure-sdk-for-js/issues/30189
        // If needed, you may release a hotfix to quickly rollback to the legacy implementation by changing the following line to:
        // this.implProvider = new LegacyMsiProvider(clientIdOrOptions, options);
        // Once stabilized, you can remove the legacy implementation and inline the msalMsiProvider code here as a drop-in replacement.
        this.implProvider = new MsalMsiProvider(clientIdOrOptions, options);
    }
    /**
     * Authenticates with Microsoft Entra ID and returns an access token if successful.
     * If authentication fails, a {@link CredentialUnavailableError} will be thrown with the details of the failure.
     * If an unexpected error occurs, an {@link AuthenticationError} will be thrown with the details of the failure.
     *
     * @param scopes - The list of scopes for which the token will have access.
     * @param options - The options used to configure any requests this
     *                TokenCredential implementation might make.
     */
    async getToken(scopes, options) {
        return this.implProvider.getToken(scopes, options);
    }
}
//# sourceMappingURL=index.js.map
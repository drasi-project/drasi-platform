import { AuthenticationResult } from "@azure/msal-common/node";
import { ManagedIdentityConfiguration } from "../config/Configuration.js";
import { ManagedIdentityRequestParams } from "../request/ManagedIdentityRequestParams.js";
import { ManagedIdentitySourceNames } from "../utils/Constants.js";
/**
 * Class to initialize a managed identity and identify the service
 * @public
 */
export declare class ManagedIdentityApplication {
    private config;
    private logger;
    private static nodeStorage?;
    private networkClient;
    private cryptoProvider;
    private fakeAuthority;
    private fakeClientCredentialClient;
    private managedIdentityClient;
    constructor(configuration?: ManagedIdentityConfiguration);
    /**
     * Acquire an access token from the cache or the managed identity
     * @param managedIdentityRequest - the ManagedIdentityRequestParams object passed in by the developer
     * @returns the access token
     */
    acquireToken(managedIdentityRequestParams: ManagedIdentityRequestParams): Promise<AuthenticationResult>;
    /**
     * Determine the Managed Identity Source based on available environment variables. This API is consumed by Azure Identity SDK.
     * @returns ManagedIdentitySourceNames - The Managed Identity source's name
     */
    getManagedIdentitySource(): ManagedIdentitySourceNames;
}
//# sourceMappingURL=ManagedIdentityApplication.d.ts.map
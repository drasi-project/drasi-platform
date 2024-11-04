import { TokenCredential } from "@azure/core-auth";
import { logger } from "./log.js";
import { PageSettings, PagedAsyncIterableIterator } from "@azure/core-paging";
import { PollOperationState, PollerLike } from "@azure/core-lro";
import { DeletionRecoveryLevel, KnownDeletionRecoveryLevel } from "./generated/models/index.js";
import { BackupKeyOptions, BeginDeleteKeyOptions, BeginRecoverDeletedKeyOptions, CreateEcKeyOptions, CreateKeyOptions, CreateOctKeyOptions, CreateRsaKeyOptions, CryptographyClientOptions, CryptographyOptions, DeletedKey, GetCryptographyClientOptions, GetDeletedKeyOptions, GetKeyOptions, GetKeyRotationPolicyOptions, GetRandomBytesOptions, ImportKeyOptions, JsonWebKey, KeyClientOptions, KeyExportEncryptionAlgorithm, KeyOperation, KeyPollerOptions, KeyProperties, KeyReleasePolicy, KeyRotationLifetimeAction, KeyRotationPolicy, KeyRotationPolicyAction, KeyRotationPolicyProperties, KeyType, KeyVaultKey, KnownKeyExportEncryptionAlgorithm, KnownKeyOperations, KnownKeyTypes, ListDeletedKeysOptions, ListPropertiesOfKeyVersionsOptions, ListPropertiesOfKeysOptions, PurgeDeletedKeyOptions, ReleaseKeyOptions, ReleaseKeyResult, RestoreKeyBackupOptions, RotateKeyOptions, UpdateKeyPropertiesOptions, UpdateKeyRotationPolicyOptions } from "./keysModels.js";
import { CryptographyClient } from "./cryptographyClient.js";
import { AesCbcDecryptParameters, AesCbcEncryptParameters, AesCbcEncryptionAlgorithm, AesGcmDecryptParameters, AesGcmEncryptParameters, AesGcmEncryptionAlgorithm, DecryptOptions, DecryptParameters, DecryptResult, EncryptOptions, EncryptParameters, EncryptResult, EncryptionAlgorithm, KeyCurveName, KeyWrapAlgorithm, KnownEncryptionAlgorithms, KnownKeyCurveNames, KnownSignatureAlgorithms, RsaDecryptParameters, RsaEncryptParameters, RsaEncryptionAlgorithm, SignOptions, SignResult, SignatureAlgorithm, UnwrapKeyOptions, UnwrapResult, VerifyDataOptions, VerifyOptions, VerifyResult, WrapKeyOptions, WrapResult } from "./cryptographyClientModels.js";
import { KeyVaultKeyIdentifier, parseKeyVaultKeyIdentifier } from "./identifier.js";
export { CryptographyClientOptions, KeyClientOptions, BackupKeyOptions, CreateEcKeyOptions, CreateKeyOptions, CreateRsaKeyOptions, CreateOctKeyOptions, CryptographyClient, CryptographyOptions, RsaEncryptionAlgorithm, RsaDecryptParameters, AesGcmEncryptionAlgorithm, AesGcmDecryptParameters, AesCbcEncryptionAlgorithm, AesCbcDecryptParameters, DecryptParameters, DecryptOptions, DecryptResult, DeletedKey, DeletionRecoveryLevel, KnownDeletionRecoveryLevel, RsaEncryptParameters, AesGcmEncryptParameters, AesCbcEncryptParameters, EncryptParameters, EncryptOptions, EncryptResult, GetDeletedKeyOptions, GetKeyOptions, GetRandomBytesOptions, ImportKeyOptions, JsonWebKey, KeyCurveName, KnownKeyCurveNames, KnownKeyExportEncryptionAlgorithm, EncryptionAlgorithm, KnownEncryptionAlgorithms, KeyOperation, KnownKeyOperations, KeyType, KnownKeyTypes, KeyPollerOptions, BeginDeleteKeyOptions, BeginRecoverDeletedKeyOptions, KeyProperties, SignatureAlgorithm, KnownSignatureAlgorithms, KeyVaultKey, KeyWrapAlgorithm, ListPropertiesOfKeysOptions, ListPropertiesOfKeyVersionsOptions, ListDeletedKeysOptions, PageSettings, PagedAsyncIterableIterator, KeyVaultKeyIdentifier, parseKeyVaultKeyIdentifier, PollOperationState, PollerLike, PurgeDeletedKeyOptions, RestoreKeyBackupOptions, RotateKeyOptions, SignOptions, SignResult, UnwrapKeyOptions, UnwrapResult, UpdateKeyPropertiesOptions, VerifyOptions, VerifyDataOptions, VerifyResult, WrapKeyOptions, WrapResult, ReleaseKeyOptions, ReleaseKeyResult, KeyReleasePolicy, KeyExportEncryptionAlgorithm, GetCryptographyClientOptions, KeyRotationPolicyAction, KeyRotationPolicyProperties, KeyRotationPolicy, KeyRotationLifetimeAction, UpdateKeyRotationPolicyOptions, GetKeyRotationPolicyOptions, logger, };
/**
 * The KeyClient provides methods to manage {@link KeyVaultKey} in the
 * Azure Key Vault. The client supports creating, retrieving, updating,
 * deleting, purging, backing up, restoring and listing KeyVaultKeys. The
 * client also supports listing {@link DeletedKey} for a soft-delete enabled Azure Key
 * Vault.
 */
export declare class KeyClient {
    /**
     * The base URL to the vault
     */
    readonly vaultUrl: string;
    /**
     * A reference to the auto-generated Key Vault HTTP client.
     */
    private readonly client;
    /**
     * A reference to the credential that was used to construct this client.
     * Later used to instantiate a {@link CryptographyClient} with the same credential.
     */
    private readonly credential;
    /**
     * Creates an instance of KeyClient.
     *
     * Example usage:
     * ```ts
     * import { KeyClient } from "@azure/keyvault-keys";
     * import { DefaultAzureCredential } from "@azure/identity";
     *
     * let vaultUrl = `https://<MY KEYVAULT HERE>.vault.azure.net`;
     * let credentials = new DefaultAzureCredential();
     *
     * let client = new KeyClient(vaultUrl, credentials);
     * ```
     * @param vaultUrl - the URL of the Key Vault. It should have this shape: `https://${your-key-vault-name}.vault.azure.net`. You should validate that this URL references a valid Key Vault or Managed HSM resource. See https://aka.ms/azsdk/blog/vault-uri for details.
     * @param credential - An object that implements the `TokenCredential` interface used to authenticate requests to the service. Use the \@azure/identity package to create a credential that suits your needs.
     * @param pipelineOptions - Pipeline options used to configure Key Vault API requests. Omit this parameter to use the default pipeline configuration.
     */
    constructor(vaultUrl: string, credential: TokenCredential, pipelineOptions?: KeyClientOptions);
    /**
     * The create key operation can be used to create any key type in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * // Create an elliptic-curve key:
     * let result = await client.createKey("MyKey", "EC");
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param keyType - The type of the key. One of the following: 'EC', 'EC-HSM', 'RSA', 'RSA-HSM', 'oct'.
     * @param options - The optional parameters.
     */
    createKey(name: string, keyType: KeyType, options?: CreateKeyOptions): Promise<KeyVaultKey>;
    /**
     * The createEcKey method creates a new elliptic curve key in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let result = await client.createEcKey("MyKey", { curve: "P-256" });
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    createEcKey(name: string, options?: CreateEcKeyOptions): Promise<KeyVaultKey>;
    /**
     * The createRSAKey method creates a new RSA key in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let result = await client.createRsaKey("MyKey", { keySize: 2048 });
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    createRsaKey(name: string, options?: CreateRsaKeyOptions): Promise<KeyVaultKey>;
    /**
     * The createOctKey method creates a new OCT key in Azure Key Vault. If the named key
     * already exists, Azure Key Vault creates a new version of the key. It requires the keys/create
     * permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let result = await client.createOctKey("MyKey", { hsm: true });
     * ```
     * Creates a new key, stores it, then returns key parameters and properties to the client.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    createOctKey(name: string, options?: CreateOctKeyOptions): Promise<KeyVaultKey>;
    /**
     * The import key operation may be used to import any key type into an Azure Key Vault. If the
     * named key already exists, Azure Key Vault creates a new version of the key. This operation
     * requires the keys/import permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * // Key contents in myKeyContents
     * let result = await client.importKey("MyKey", myKeyContents);
     * ```
     * Imports an externally created key, stores it, and returns key parameters and properties
     * to the client.
     * @param name - Name for the imported key.
     * @param key - The JSON web key.
     * @param options - The optional parameters.
     */
    importKey(name: string, key: JsonWebKey, options?: ImportKeyOptions): Promise<KeyVaultKey>;
    /**
     * Gets a {@link CryptographyClient} for the given key.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * // get a cryptography client for a given key
     * let cryptographyClient = client.getCryptographyClient("MyKey");
     * ```
     * @param name - The name of the key used to perform cryptographic operations.
     * @param version - Optional version of the key used to perform cryptographic operations.
     * @returns - A {@link CryptographyClient} using the same options, credentials, and http client as this {@link KeyClient}
     */
    getCryptographyClient(keyName: string, options?: GetCryptographyClientOptions): CryptographyClient;
    /**
     * The delete operation applies to any key stored in Azure Key Vault. Individual versions
     * of a key can not be deleted, only all versions of a given key at once.
     *
     * This function returns a Long Running Operation poller that allows you to wait indefinitely until the key is deleted.
     *
     * This operation requires the keys/delete permission.
     *
     * Example usage:
     * ```ts
     * const client = new KeyClient(url, credentials);
     * await client.createKey("MyKey", "EC");
     * const poller = await client.beginDeleteKey("MyKey");
     *
     * // Serializing the poller
     * const serialized = poller.toString();
     * // A new poller can be created with:
     * // await client.beginDeleteKey("MyKey", { resumeFrom: serialized });
     *
     * // Waiting until it's done
     * const deletedKey = await poller.pollUntilDone();
     * console.log(deletedKey);
     * ```
     * Deletes a key from a specified key vault.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    beginDeleteKey(name: string, options?: BeginDeleteKeyOptions): Promise<PollerLike<PollOperationState<DeletedKey>, DeletedKey>>;
    /**
     * The updateKeyProperties method changes specified properties of an existing stored key. Properties that
     * are not specified in the request are left unchanged. The value of a key itself cannot be
     * changed. This operation requires the keys/set permission.
     *
     * Example usage:
     * ```ts
     * let keyName = "MyKey";
     * let client = new KeyClient(vaultUrl, credentials);
     * let key = await client.getKey(keyName);
     * let result = await client.updateKeyProperties(keyName, key.properties.version, { enabled: false });
     * ```
     * Updates the properties associated with a specified key in a given key vault.
     * @param name - The name of the key.
     * @param keyVersion - The version of the key.
     * @param options - The optional parameters.
     */
    updateKeyProperties(name: string, keyVersion: string, options?: UpdateKeyPropertiesOptions): Promise<KeyVaultKey>;
    /**
     * The updateKeyProperties method changes specified properties of the latest version of an existing stored key. Properties that
     * are not specified in the request are left unchanged. The value of a key itself cannot be
     * changed. This operation requires the keys/set permission.
     *
     * Example usage:
     * ```ts
     * let keyName = "MyKey";
     * let client = new KeyClient(vaultUrl, credentials);
     * let key = await client.getKey(keyName);
     * let result = await client.updateKeyProperties(keyName, { enabled: false });
     * ```
     * Updates the properties associated with a specified key in a given key vault.
     * @param name - The name of the key.
     * @param keyVersion - The version of the key.
     * @param options - The optional parameters.
     */
    updateKeyProperties(name: string, options?: UpdateKeyPropertiesOptions): Promise<KeyVaultKey>;
    /**
     * Standardizes an overloaded arguments collection for the updateKeyProperties method.
     *
     * @param args - The arguments collection.
     * @returns - The standardized arguments collection.
     */
    private disambiguateUpdateKeyPropertiesArgs;
    /**
     * The getKey method gets a specified key and is applicable to any key stored in Azure Key Vault.
     * This operation requires the keys/get permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let key = await client.getKey("MyKey");
     * ```
     * Get a specified key from a given key vault.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    getKey(name: string, options?: GetKeyOptions): Promise<KeyVaultKey>;
    /**
     * The getDeletedKey method returns the specified deleted key along with its properties.
     * This operation requires the keys/get permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let key = await client.getDeletedKey("MyDeletedKey");
     * ```
     * Gets the specified deleted key.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    getDeletedKey(name: string, options?: GetDeletedKeyOptions): Promise<DeletedKey>;
    /**
     * The purge deleted key operation removes the key permanently, without the possibility of
     * recovery. This operation can only be enabled on a soft-delete enabled vault. This operation
     * requires the keys/purge permission.
     *
     * Example usage:
     * ```ts
     * const client = new KeyClient(url, credentials);
     * const deletePoller = await client.beginDeleteKey("MyKey")
     * await deletePoller.pollUntilDone();
     * await client.purgeDeletedKey("MyKey");
     * ```
     * Permanently deletes the specified key.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    purgeDeletedKey(name: string, options?: PurgeDeletedKeyOptions): Promise<void>;
    /**
     * Recovers the deleted key in the specified vault. This operation can only be performed on a
     * soft-delete enabled vault.
     *
     * This function returns a Long Running Operation poller that allows you to wait indefinitely until the deleted key is recovered.
     *
     * This operation requires the keys/recover permission.
     *
     * Example usage:
     * ```ts
     * const client = new KeyClient(url, credentials);
     * await client.createKey("MyKey", "EC");
     * const deletePoller = await client.beginDeleteKey("MyKey");
     * await deletePoller.pollUntilDone();
     * const poller = await client.beginRecoverDeletedKey("MyKey");
     *
     * // Serializing the poller
     * const serialized = poller.toString();
     * // A new poller can be created with:
     * // await client.beginRecoverDeletedKey("MyKey", { resumeFrom: serialized });
     *
     * // Waiting until it's done
     * const key = await poller.pollUntilDone();
     * console.log(key);
     * ```
     * Recovers the deleted key to the latest version.
     * @param name - The name of the deleted key.
     * @param options - The optional parameters.
     */
    beginRecoverDeletedKey(name: string, options?: BeginRecoverDeletedKeyOptions): Promise<PollerLike<PollOperationState<DeletedKey>, DeletedKey>>;
    /**
     * Requests that a backup of the specified key be downloaded to the client. All versions of the
     * key will be downloaded. This operation requires the keys/backup permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let backupContents = await client.backupKey("MyKey");
     * ```
     * Backs up the specified key.
     * @param name - The name of the key.
     * @param options - The optional parameters.
     */
    backupKey(name: string, options?: BackupKeyOptions): Promise<Uint8Array | undefined>;
    /**
     * Restores a backed up key, and all its versions, to a vault. This operation requires the
     * keys/restore permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * let backupContents = await client.backupKey("MyKey");
     * // ...
     * let key = await client.restoreKeyBackup(backupContents);
     * ```
     * Restores a backed up key to a vault.
     * @param backup - The backup blob associated with a key bundle.
     * @param options - The optional parameters.
     */
    restoreKeyBackup(backup: Uint8Array, options?: RestoreKeyBackupOptions): Promise<KeyVaultKey>;
    /**
     * Gets the requested number of bytes containing random values from a managed HSM.
     * This operation requires the managedHsm/rng permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(vaultUrl, credentials);
     * let { bytes } = await client.getRandomBytes(10);
     * ```
     * @param count - The number of bytes to generate between 1 and 128 inclusive.
     * @param options - The optional parameters.
     */
    getRandomBytes(count: number, options?: GetRandomBytesOptions): Promise<Uint8Array>;
    /**
     * Rotates the key based on the key policy by generating a new version of the key. This operation requires the keys/rotate permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(vaultUrl, credentials);
     * let key = await client.rotateKey("MyKey");
     * ```
     *
     * @param name - The name of the key to rotate.
     * @param options - The optional parameters.
     */
    rotateKey(name: string, options?: RotateKeyOptions): Promise<KeyVaultKey>;
    /**
     * Releases a key from a managed HSM.
     *
     * The release key operation is applicable to all key types. The operation requires the key to be marked exportable and the keys/release permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(vaultUrl, credentials);
     * let result = await client.releaseKey("myKey", target)
     * ```
     *
     * @param name - The name of the key.
     * @param targetAttestationToken - The attestation assertion for the target of the key release.
     * @param options - The optional parameters.
     */
    releaseKey(name: string, targetAttestationToken: string, options?: ReleaseKeyOptions): Promise<ReleaseKeyResult>;
    /**
     * Gets the rotation policy of a Key Vault Key.
     * By default, all keys have a policy that will notify 30 days before expiry.
     *
     * This operation requires the keys/get permission.
     * Example usage:
     * ```ts
     * let client = new KeyClient(vaultUrl, credentials);
     * let result = await client.getKeyRotationPolicy("myKey");
     * ```
     *
     * @param keyName - The name of the key.
     * @param options - The optional parameters.
     */
    getKeyRotationPolicy(keyName: string, options?: GetKeyRotationPolicyOptions): Promise<KeyRotationPolicy>;
    /**
     * Updates the rotation policy of a Key Vault Key.
     * This operation requires the keys/update permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(vaultUrl, credentials);
     * const setPolicy = await client.updateKeyRotationPolicy("MyKey", myPolicy);
     * ```
     *
     * @param keyName - The name of the key.
     * @param policyProperties - The {@link KeyRotationPolicyProperties} for the policy.
     * @param options - The optional parameters.
     */
    updateKeyRotationPolicy(keyName: string, policy: KeyRotationPolicyProperties, options?: UpdateKeyRotationPolicyOptions): Promise<KeyRotationPolicy>;
    /**
     * Deals with the pagination of {@link listPropertiesOfKeyVersions}.
     * @param name - The name of the Key Vault Key.
     * @param continuationState - An object that indicates the position of the paginated request.
     * @param options - Common options for the iterative endpoints.
     */
    private listPropertiesOfKeyVersionsPage;
    /**
     * Deals with the iteration of all the available results of {@link listPropertiesOfKeyVersions}.
     * @param name - The name of the Key Vault Key.
     * @param options - Common options for the iterative endpoints.
     */
    private listPropertiesOfKeyVersionsAll;
    /**
     * Iterates all versions of the given key in the vault. The full key identifier, properties, and tags are provided
     * in the response. This operation requires the keys/list permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * for await (const keyProperties of client.listPropertiesOfKeyVersions("MyKey")) {
     *   const key = await client.getKey(keyProperties.name);
     *   console.log("key version: ", key);
     * }
     * ```
     * @param name - Name of the key to fetch versions for
     * @param options - The optional parameters.
     */
    listPropertiesOfKeyVersions(name: string, options?: ListPropertiesOfKeyVersionsOptions): PagedAsyncIterableIterator<KeyProperties>;
    /**
     * Deals with the pagination of {@link listPropertiesOfKeys}.
     * @param continuationState - An object that indicates the position of the paginated request.
     * @param options - Common options for the iterative endpoints.
     */
    private listPropertiesOfKeysPage;
    /**
     * Deals with the iteration of all the available results of {@link listPropertiesOfKeys}.
     * @param options - Common options for the iterative endpoints.
     */
    private listPropertiesOfKeysAll;
    /**
     * Iterates the latest version of all keys in the vault.  The full key identifier and properties are provided
     * in the response. No values are returned for the keys. This operations requires the keys/list permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * for await (const keyProperties of client.listPropertiesOfKeys()) {
     *   const key = await client.getKey(keyProperties.name);
     *   console.log("key: ", key);
     * }
     * ```
     * List all keys in the vault
     * @param options - The optional parameters.
     */
    listPropertiesOfKeys(options?: ListPropertiesOfKeysOptions): PagedAsyncIterableIterator<KeyProperties>;
    /**
     * Deals with the pagination of {@link listDeletedKeys}.
     * @param continuationState - An object that indicates the position of the paginated request.
     * @param options - Common options for the iterative endpoints.
     */
    private listDeletedKeysPage;
    /**
     * Deals with the iteration of all the available results of {@link listDeletedKeys}.
     * @param options - Common options for the iterative endpoints.
     */
    private listDeletedKeysAll;
    /**
     * Iterates the deleted keys in the vault.  The full key identifier and properties are provided
     * in the response. No values are returned for the keys. This operations requires the keys/list permission.
     *
     * Example usage:
     * ```ts
     * let client = new KeyClient(url, credentials);
     * for await (const deletedKey of client.listDeletedKeys()) {
     *   console.log("deleted key: ", deletedKey);
     * }
     * ```
     * List all keys in the vault
     * @param options - The optional parameters.
     */
    listDeletedKeys(options?: ListDeletedKeysOptions): PagedAsyncIterableIterator<DeletedKey>;
}
//# sourceMappingURL=index.d.ts.map
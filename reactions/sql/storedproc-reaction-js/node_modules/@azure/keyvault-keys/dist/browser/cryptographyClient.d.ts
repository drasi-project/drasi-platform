import { TokenCredential } from "@azure/core-auth";
import { CryptographyClientOptions, JsonWebKey, KeyVaultKey } from "./keysModels.js";
import { DecryptOptions, DecryptParameters, DecryptResult, EncryptOptions, EncryptParameters, EncryptResult, EncryptionAlgorithm, KeyWrapAlgorithm, SignOptions, SignResult, SignatureAlgorithm, UnwrapKeyOptions, UnwrapResult, VerifyOptions, VerifyResult, WrapKeyOptions, WrapResult } from "./cryptographyClientModels.js";
/**
 * A client used to perform cryptographic operations on an Azure Key vault key
 * or a local {@link JsonWebKey}.
 */
export declare class CryptographyClient {
    /**
     * The key the CryptographyClient currently holds.
     */
    private key;
    /**
     * The remote provider, which would be undefined if used in local mode.
     */
    private remoteProvider?;
    /**
     * Constructs a new instance of the Cryptography client for the given key
     *
     * Example usage:
     * ```ts
     * import { KeyClient, CryptographyClient } from "@azure/keyvault-keys";
     * import { DefaultAzureCredential } from "@azure/identity";
     *
     * let vaultUrl = `https://<MY KEYVAULT HERE>.vault.azure.net`;
     * let credentials = new DefaultAzureCredential();
     *
     * let keyClient = new KeyClient(vaultUrl, credentials);
     * let keyVaultKey = await keyClient.getKey("MyKey");
     *
     * let client = new CryptographyClient(keyVaultKey.id, credentials);
     * // or
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * ```
     * @param key - The key to use during cryptography tasks. You can also pass the identifier of the key i.e its url here.
     * @param credential - An object that implements the `TokenCredential` interface used to authenticate requests to the service. Use the \@azure/identity package to create a credential that suits your needs.
     * @param pipelineOptions - Pipeline options used to configure Key Vault API requests.
     *                          Omit this parameter to use the default pipeline configuration.
     */
    constructor(key: string | KeyVaultKey, credential: TokenCredential, pipelineOptions?: CryptographyClientOptions);
    /**
     * Constructs a new instance of the Cryptography client for the given key in local mode.
     *
     * Example usage:
     * ```ts
     * import { CryptographyClient } from "@azure/keyvault-keys";
     *
     * const jsonWebKey: JsonWebKey = {
     *   // ...
     * };
     * const client = new CryptographyClient(jsonWebKey);
     * ```
     * @param key - The JsonWebKey to use during cryptography operations.
     */
    constructor(key: JsonWebKey);
    /**
     * The base URL to the vault. If a local {@link JsonWebKey} is used vaultUrl will be empty.
     */
    get vaultUrl(): string;
    /**
     * The ID of the key used to perform cryptographic operations for the client.
     */
    get keyID(): string | undefined;
    /**
     * Encrypts the given plaintext with the specified encryption parameters.
     * Depending on the algorithm set in the encryption parameters, the set of possible encryption parameters will change.
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.encrypt({ algorithm: "RSA1_5", plaintext: Buffer.from("My Message")});
     * let result = await client.encrypt({ algorithm: "A256GCM", plaintext: Buffer.from("My Message"), additionalAuthenticatedData: Buffer.from("My authenticated data")});
     * ```
     * @param encryptParameters - The encryption parameters, keyed on the encryption algorithm chosen.
     * @param options - Additional options.
     */
    encrypt(encryptParameters: EncryptParameters, options?: EncryptOptions): Promise<EncryptResult>;
    /**
     * Encrypts the given plaintext with the specified cryptography algorithm
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.encrypt("RSA1_5", Buffer.from("My Message"));
     * ```
     * @param algorithm - The algorithm to use.
     * @param plaintext - The text to encrypt.
     * @param options - Additional options.
     * @deprecated Use `encrypt({ algorithm, plaintext }, options)` instead.
     */
    encrypt(algorithm: EncryptionAlgorithm, plaintext: Uint8Array, options?: EncryptOptions): Promise<EncryptResult>;
    private initializeIV;
    /**
     * Standardizes the arguments of multiple overloads into a single shape.
     * @param args - The encrypt arguments
     */
    private disambiguateEncryptArguments;
    /**
     * Decrypts the given ciphertext with the specified decryption parameters.
     * Depending on the algorithm used in the decryption parameters, the set of possible decryption parameters will change.
     *
     * Microsoft recommends you not use CBC without first ensuring the integrity of the ciphertext using, for example, an HMAC. See https://docs.microsoft.com/dotnet/standard/security/vulnerabilities-cbc-mode for more information.
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.decrypt({ algorithm: "RSA1_5", ciphertext: encryptedBuffer });
     * let result = await client.decrypt({ algorithm: "A256GCM", iv: ivFromEncryptResult, authenticationTag: tagFromEncryptResult });
     * ```
     * @param decryptParameters - The decryption parameters.
     * @param options - Additional options.
     */
    decrypt(decryptParameters: DecryptParameters, options?: DecryptOptions): Promise<DecryptResult>;
    /**
     * Decrypts the given ciphertext with the specified cryptography algorithm
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.decrypt("RSA1_5", encryptedBuffer);
     * ```
     *
     * Microsoft recommends you not use CBC without first ensuring the integrity of the ciphertext using, for example, an HMAC. See https://docs.microsoft.com/dotnet/standard/security/vulnerabilities-cbc-mode for more information.
     *
     * @param algorithm - The algorithm to use.
     * @param ciphertext - The text to decrypt.
     * @param options - Additional options.
     * @deprecated Use `decrypt({ algorithm, ciphertext }, options)` instead.
     */
    decrypt(algorithm: EncryptionAlgorithm, ciphertext: Uint8Array, options?: DecryptOptions): Promise<DecryptResult>;
    /**
     * Standardizes the arguments of multiple overloads into a single shape.
     * @param args - The decrypt arguments
     */
    private disambiguateDecryptArguments;
    /**
     * Wraps the given key using the specified cryptography algorithm
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.wrapKey("RSA1_5", keyToWrap);
     * ```
     * @param algorithm - The encryption algorithm to use to wrap the given key.
     * @param key - The key to wrap.
     * @param options - Additional options.
     */
    wrapKey(algorithm: KeyWrapAlgorithm, key: Uint8Array, options?: WrapKeyOptions): Promise<WrapResult>;
    /**
     * Unwraps the given wrapped key using the specified cryptography algorithm
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.unwrapKey("RSA1_5", keyToUnwrap);
     * ```
     * @param algorithm - The decryption algorithm to use to unwrap the key.
     * @param encryptedKey - The encrypted key to unwrap.
     * @param options - Additional options.
     */
    unwrapKey(algorithm: KeyWrapAlgorithm, encryptedKey: Uint8Array, options?: UnwrapKeyOptions): Promise<UnwrapResult>;
    /**
     * Cryptographically sign the digest of a message
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.sign("RS256", digest);
     * ```
     * @param algorithm - The signing algorithm to use.
     * @param digest - The digest of the data to sign.
     * @param options - Additional options.
     */
    sign(algorithm: SignatureAlgorithm, digest: Uint8Array, options?: SignOptions): Promise<SignResult>;
    /**
     * Verify the signed message digest
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.verify("RS256", signedDigest, signature);
     * ```
     * @param algorithm - The signing algorithm to use to verify with.
     * @param digest - The digest to verify.
     * @param signature - The signature to verify the digest against.
     * @param options - Additional options.
     */
    verify(algorithm: SignatureAlgorithm, digest: Uint8Array, signature: Uint8Array, options?: VerifyOptions): Promise<VerifyResult>;
    /**
     * Cryptographically sign a block of data
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.signData("RS256", message);
     * ```
     * @param algorithm - The signing algorithm to use.
     * @param data - The data to sign.
     * @param options - Additional options.
     */
    signData(algorithm: SignatureAlgorithm, data: Uint8Array, options?: SignOptions): Promise<SignResult>;
    /**
     * Verify the signed block of data
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.verifyData("RS256", signedMessage, signature);
     * ```
     * @param algorithm - The algorithm to use to verify with.
     * @param data - The signed block of data to verify.
     * @param signature - The signature to verify the block against.
     * @param options - Additional options.
     */
    verifyData(algorithm: SignatureAlgorithm, data: Uint8Array, signature: Uint8Array, options?: VerifyOptions): Promise<VerifyResult>;
    /**
     * Retrieves the {@link JsonWebKey} from the Key Vault, if possible. Returns undefined if the key could not be retrieved due to insufficient permissions.
     *
     * Example usage:
     * ```ts
     * let client = new CryptographyClient(keyVaultKey, credentials);
     * let result = await client.getKeyMaterial();
     * ```
     */
    private getKeyMaterial;
    /**
     * Returns the underlying key used for cryptographic operations.
     * If needed, attempts to fetch the key from KeyVault and exchanges the ID for the actual key.
     * @param options - The additional options.
     */
    private fetchKey;
    private providers?;
    /**
     * Gets the provider that support this algorithm and operation.
     * The available providers are ordered by priority such that the first provider that supports this
     * operation is the one we should use.
     * @param operation - The {@link KeyOperation}.
     * @param algorithm - The algorithm to use.
     */
    private getProvider;
    private ensureValid;
}
//# sourceMappingURL=cryptographyClient.d.ts.map
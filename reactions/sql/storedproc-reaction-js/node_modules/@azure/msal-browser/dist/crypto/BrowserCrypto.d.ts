import { IPerformanceClient, Logger } from "@azure/msal-common/browser";
/**
 * Check whether browser crypto is available.
 */
export declare function validateCryptoAvailable(logger: Logger): void;
/**
 * Returns a sha-256 hash of the given dataString as an ArrayBuffer.
 * @param dataString {string} data string
 * @param performanceClient {?IPerformanceClient}
 * @param correlationId {?string} correlation id
 */
export declare function sha256Digest(dataString: string, performanceClient?: IPerformanceClient, correlationId?: string): Promise<ArrayBuffer>;
/**
 * Populates buffer with cryptographically random values.
 * @param dataBuffer
 */
export declare function getRandomValues(dataBuffer: Uint8Array): Uint8Array;
/**
 * Creates a UUID v7 from the current timestamp.
 * Implementation relies on the system clock to guarantee increasing order of generated identifiers.
 * @returns {number}
 */
export declare function createNewGuid(): string;
/**
 * Generates a keypair based on current keygen algorithm config.
 * @param extractable
 * @param usages
 */
export declare function generateKeyPair(extractable: boolean, usages: Array<KeyUsage>): Promise<CryptoKeyPair>;
/**
 * Export key as Json Web Key (JWK)
 * @param key
 */
export declare function exportJwk(key: CryptoKey): Promise<JsonWebKey>;
/**
 * Imports key as Json Web Key (JWK), can set extractable and usages.
 * @param key
 * @param extractable
 * @param usages
 */
export declare function importJwk(key: JsonWebKey, extractable: boolean, usages: Array<KeyUsage>): Promise<CryptoKey>;
/**
 * Signs given data with given key
 * @param key
 * @param data
 */
export declare function sign(key: CryptoKey, data: ArrayBuffer): Promise<ArrayBuffer>;
/**
 * Returns the SHA-256 hash of an input string
 * @param plainText
 */
export declare function hashString(plainText: string): Promise<string>;
//# sourceMappingURL=BrowserCrypto.d.ts.map
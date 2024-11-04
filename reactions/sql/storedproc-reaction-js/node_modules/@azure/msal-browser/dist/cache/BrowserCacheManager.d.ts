import { CommonAuthorizationCodeRequest, ICrypto, AccountEntity, IdTokenEntity, AccessTokenEntity, RefreshTokenEntity, AppMetadataEntity, CacheManager, ServerTelemetryEntity, ThrottlingEntity, Logger, AuthorityMetadataEntity, AccountInfo, ValidCredentialType, TokenKeys, CredentialType, CacheRecord, IPerformanceClient, StaticAuthorityOptions, StoreInCache } from "@azure/msal-common/browser";
import { CacheOptions } from "../config/Configuration.js";
import { BrowserCacheLocation, InteractionType } from "../utils/BrowserConstants.js";
import { MemoryStorage } from "./MemoryStorage.js";
import { IWindowStorage } from "./IWindowStorage.js";
import { NativeTokenRequest } from "../broker/nativeBroker/NativeRequest.js";
import { AuthenticationResult } from "../response/AuthenticationResult.js";
import { SilentRequest } from "../request/SilentRequest.js";
import { SsoSilentRequest } from "../request/SsoSilentRequest.js";
import { RedirectRequest } from "../request/RedirectRequest.js";
import { PopupRequest } from "../request/PopupRequest.js";
/**
 * This class implements the cache storage interface for MSAL through browser local or session storage.
 * Cookies are only used if storeAuthStateInCookie is true, and are only used for
 * parameters such as state and nonce, generally.
 */
export declare class BrowserCacheManager extends CacheManager {
    protected cacheConfig: Required<CacheOptions>;
    protected browserStorage: IWindowStorage<string>;
    protected internalStorage: MemoryStorage<string>;
    protected temporaryCacheStorage: IWindowStorage<string>;
    protected logger: Logger;
    protected performanceClient?: IPerformanceClient;
    protected readonly COOKIE_LIFE_MULTIPLIER: number;
    constructor(clientId: string, cacheConfig: Required<CacheOptions>, cryptoImpl: ICrypto, logger: Logger, staticAuthorityOptions?: StaticAuthorityOptions, performanceClient?: IPerformanceClient);
    /**
     * Returns a window storage class implementing the IWindowStorage interface that corresponds to the configured cacheLocation.
     * @param cacheLocation
     */
    protected setupBrowserStorage(cacheLocation: BrowserCacheLocation | string): IWindowStorage<string>;
    /**
     * Returns a window storage class implementing the IWindowStorage interface that corresponds to the configured temporaryCacheLocation.
     * @param temporaryCacheLocation
     * @param cacheLocation
     */
    protected setupTemporaryCacheStorage(temporaryCacheLocation: BrowserCacheLocation | string, cacheLocation: BrowserCacheLocation | string): IWindowStorage<string>;
    /**
     * Migrate all old cache entries to new schema. No rollback supported.
     * @param storeAuthStateInCookie
     */
    protected migrateCacheEntries(): void;
    /**
     * Searches all cache entries for MSAL accounts and creates the account key map
     * This is used to migrate users from older versions of MSAL which did not create the map.
     * @returns
     */
    private createKeyMaps;
    /**
     * Parses passed value as JSON object, JSON.parse() will throw an error.
     * @param input
     */
    protected validateAndParseJson(jsonValue: string): object | null;
    /**
     * fetches the entry from the browser storage based off the key
     * @param key
     */
    getItem(key: string): string | null;
    /**
     * sets the entry in the browser storage
     * @param key
     * @param value
     */
    setItem(key: string, value: string): void;
    /**
     * fetch the account entity from the platform cache
     * @param accountKey
     */
    getAccount(accountKey: string, logger?: Logger): AccountEntity | null;
    /**
     * Reads account from cache, deserializes it into an account entity and returns it.
     * If account is not found from the key, returns null and removes key from map.
     * @param accountKey
     * @returns
     */
    getCachedAccountEntity(accountKey: string): AccountEntity | null;
    /**
     * set account entity in the platform cache
     * @param account
     */
    setAccount(account: AccountEntity): void;
    /**
     * Returns the array of account keys currently cached
     * @returns
     */
    getAccountKeys(): Array<string>;
    /**
     * Add a new account to the key map
     * @param key
     */
    addAccountKeyToMap(key: string): void;
    /**
     * Remove an account from the key map
     * @param key
     */
    removeAccountKeyFromMap(key: string): void;
    /**
     * Extends inherited removeAccount function to include removal of the account key from the map
     * @param key
     */
    removeAccount(key: string): Promise<void>;
    /**
     * Remove account entity from the platform cache if it's outdated
     * @param accountKey
     */
    removeOutdatedAccount(accountKey: string): void;
    /**
     * Removes given idToken from the cache and from the key map
     * @param key
     */
    removeIdToken(key: string): void;
    /**
     * Removes given accessToken from the cache and from the key map
     * @param key
     */
    removeAccessToken(key: string): Promise<void>;
    /**
     * Removes given refreshToken from the cache and from the key map
     * @param key
     */
    removeRefreshToken(key: string): void;
    /**
     * Gets the keys for the cached tokens associated with this clientId
     * @returns
     */
    getTokenKeys(): TokenKeys;
    /**
     * Adds the given key to the token key map
     * @param key
     * @param type
     */
    addTokenKey(key: string, type: CredentialType): void;
    /**
     * Removes the given key from the token key map
     * @param key
     * @param type
     */
    removeTokenKey(key: string, type: CredentialType): void;
    /**
     * generates idToken entity from a string
     * @param idTokenKey
     */
    getIdTokenCredential(idTokenKey: string): IdTokenEntity | null;
    /**
     * set IdToken credential to the platform cache
     * @param idToken
     */
    setIdTokenCredential(idToken: IdTokenEntity): void;
    /**
     * generates accessToken entity from a string
     * @param key
     */
    getAccessTokenCredential(accessTokenKey: string): AccessTokenEntity | null;
    /**
     * set accessToken credential to the platform cache
     * @param accessToken
     */
    setAccessTokenCredential(accessToken: AccessTokenEntity): void;
    /**
     * generates refreshToken entity from a string
     * @param refreshTokenKey
     */
    getRefreshTokenCredential(refreshTokenKey: string): RefreshTokenEntity | null;
    /**
     * set refreshToken credential to the platform cache
     * @param refreshToken
     */
    setRefreshTokenCredential(refreshToken: RefreshTokenEntity): void;
    /**
     * fetch appMetadata entity from the platform cache
     * @param appMetadataKey
     */
    getAppMetadata(appMetadataKey: string): AppMetadataEntity | null;
    /**
     * set appMetadata entity to the platform cache
     * @param appMetadata
     */
    setAppMetadata(appMetadata: AppMetadataEntity): void;
    /**
     * fetch server telemetry entity from the platform cache
     * @param serverTelemetryKey
     */
    getServerTelemetry(serverTelemetryKey: string): ServerTelemetryEntity | null;
    /**
     * set server telemetry entity to the platform cache
     * @param serverTelemetryKey
     * @param serverTelemetry
     */
    setServerTelemetry(serverTelemetryKey: string, serverTelemetry: ServerTelemetryEntity): void;
    /**
     *
     */
    getAuthorityMetadata(key: string): AuthorityMetadataEntity | null;
    /**
     *
     */
    getAuthorityMetadataKeys(): Array<string>;
    /**
     * Sets wrapper metadata in memory
     * @param wrapperSKU
     * @param wrapperVersion
     */
    setWrapperMetadata(wrapperSKU: string, wrapperVersion: string): void;
    /**
     * Returns wrapper metadata from in-memory storage
     */
    getWrapperMetadata(): [string, string];
    /**
     *
     * @param entity
     */
    setAuthorityMetadata(key: string, entity: AuthorityMetadataEntity): void;
    /**
     * Gets the active account
     */
    getActiveAccount(): AccountInfo | null;
    /**
     * Sets the active account's localAccountId in cache
     * @param account
     */
    setActiveAccount(account: AccountInfo | null): void;
    /**
     * fetch throttling entity from the platform cache
     * @param throttlingCacheKey
     */
    getThrottlingCache(throttlingCacheKey: string): ThrottlingEntity | null;
    /**
     * set throttling entity to the platform cache
     * @param throttlingCacheKey
     * @param throttlingCache
     */
    setThrottlingCache(throttlingCacheKey: string, throttlingCache: ThrottlingEntity): void;
    /**
     * Gets cache item with given key.
     * Will retrieve from cookies if storeAuthStateInCookie is set to true.
     * @param key
     */
    getTemporaryCache(cacheKey: string, generateKey?: boolean): string | null;
    /**
     * Sets the cache item with the key and value given.
     * Stores in cookie if storeAuthStateInCookie is set to true.
     * This can cause cookie overflow if used incorrectly.
     * @param key
     * @param value
     */
    setTemporaryCache(cacheKey: string, value: string, generateKey?: boolean): void;
    /**
     * Removes the cache item with the given key.
     * @param key
     */
    removeItem(key: string): void;
    /**
     * Removes the temporary cache item with the given key.
     * Will also clear the cookie item if storeAuthStateInCookie is set to true.
     * @param key
     */
    removeTemporaryItem(key: string): void;
    /**
     * Gets all keys in window.
     */
    getKeys(): string[];
    /**
     * Clears all cache entries created by MSAL.
     */
    clear(): Promise<void>;
    /**
     * Clears all access tokes that have claims prior to saving the current one
     * @param performanceClient {IPerformanceClient}
     * @param correlationId {string} correlation id
     * @returns
     */
    clearTokensAndKeysWithClaims(performanceClient: IPerformanceClient, correlationId: string): Promise<void>;
    /**
     * Add value to cookies
     * @param cookieName
     * @param cookieValue
     * @param expires
     * @deprecated
     */
    setItemCookie(cookieName: string, cookieValue: string, expires?: number): void;
    /**
     * Get one item by key from cookies
     * @param cookieName
     * @deprecated
     */
    getItemCookie(cookieName: string): string;
    /**
     * Clear all msal-related cookies currently set in the browser. Should only be used to clear temporary cache items.
     * @deprecated
     */
    clearMsalCookies(): void;
    /**
     * Clear an item in the cookies by key
     * @param cookieName
     * @deprecated
     */
    clearItemCookie(cookieName: string): void;
    /**
     * Get cookie expiration time
     * @param cookieLifeDays
     * @deprecated
     */
    getCookieExpirationTime(cookieLifeDays: number): string;
    /**
     * Prepend msal.<client-id> to each key; Skip for any JSON object as Key (defined schemas do not need the key appended: AccessToken Keys or the upcoming schema)
     * @param key
     * @param addInstanceId
     */
    generateCacheKey(key: string): string;
    /**
     * Create authorityKey to cache authority
     * @param state
     */
    generateAuthorityKey(stateString: string): string;
    /**
     * Create Nonce key to cache nonce
     * @param state
     */
    generateNonceKey(stateString: string): string;
    /**
     * Creates full cache key for the request state
     * @param stateString State string for the request
     */
    generateStateKey(stateString: string): string;
    /**
     * Gets the cached authority based on the cached state. Returns empty if no cached state found.
     */
    getCachedAuthority(cachedState: string): string | null;
    /**
     * Updates account, authority, and state in cache
     * @param serverAuthenticationRequest
     * @param account
     */
    updateCacheEntries(state: string, nonce: string, authorityInstance: string, loginHint: string, account: AccountInfo | null): void;
    /**
     * Reset all temporary cache items
     * @param state
     */
    resetRequestCache(state: string): void;
    /**
     * Removes temporary cache for the provided state
     * @param stateString
     */
    cleanRequestByState(stateString: string): void;
    /**
     * Looks in temporary cache for any state values with the provided interactionType and removes all temporary cache items for that state
     * Used in scenarios where temp cache needs to be cleaned but state is not known, such as clicking browser back button.
     * @param interactionType
     */
    cleanRequestByInteractionType(interactionType: InteractionType): void;
    cacheCodeRequest(authCodeRequest: CommonAuthorizationCodeRequest): void;
    /**
     * Gets the token exchange parameters from the cache. Throws an error if nothing is found.
     */
    getCachedRequest(state: string): CommonAuthorizationCodeRequest;
    /**
     * Gets cached native request for redirect flows
     */
    getCachedNativeRequest(): NativeTokenRequest | null;
    isInteractionInProgress(matchClientId?: boolean): boolean;
    getInteractionInProgress(): string | null;
    setInteractionInProgress(inProgress: boolean): void;
    /**
     * Returns username retrieved from ADAL or MSAL v1 idToken
     * @deprecated
     */
    getLegacyLoginHint(): string | null;
    /**
     * Updates a credential's cache key if the current cache key is outdated
     */
    updateCredentialCacheKey(currentCacheKey: string, credential: ValidCredentialType): string;
    /**
     * Builds credential entities from AuthenticationResult object and saves the resulting credentials to the cache
     * @param result
     * @param request
     */
    hydrateCache(result: AuthenticationResult, request: SilentRequest | SsoSilentRequest | RedirectRequest | PopupRequest): Promise<void>;
    /**
     * saves a cache record
     * @param cacheRecord {CacheRecord}
     * @param storeInCache {?StoreInCache}
     * @param correlationId {?string} correlation id
     */
    saveCacheRecord(cacheRecord: CacheRecord, storeInCache?: StoreInCache, correlationId?: string): Promise<void>;
}
export declare const DEFAULT_BROWSER_CACHE_MANAGER: (clientId: string, logger: Logger) => BrowserCacheManager;
//# sourceMappingURL=BrowserCacheManager.d.ts.map
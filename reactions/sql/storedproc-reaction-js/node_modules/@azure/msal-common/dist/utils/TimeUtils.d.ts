/**
 * Utility functions for managing date and time operations.
 */
/**
 * return the current time in Unix time (seconds).
 */
export declare function nowSeconds(): number;
/**
 * check if a token is expired based on given UTC time in seconds.
 * @param expiresOn
 */
export declare function isTokenExpired(expiresOn: string, offset: number): boolean;
/**
 * If the current time is earlier than the time that a token was cached at, we must discard the token
 * i.e. The system clock was turned back after acquiring the cached token
 * @param cachedAt
 * @param offset
 */
export declare function wasClockTurnedBack(cachedAt: string): boolean;
/**
 * Waits for t number of milliseconds
 * @param t number
 * @param value T
 */
export declare function delay<T>(t: number, value?: T): Promise<T | void>;
//# sourceMappingURL=TimeUtils.d.ts.map
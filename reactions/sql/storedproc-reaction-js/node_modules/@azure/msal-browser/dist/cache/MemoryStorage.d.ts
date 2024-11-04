import { IWindowStorage } from "./IWindowStorage.js";
export declare class MemoryStorage<T> implements IWindowStorage<T> {
    private cache;
    constructor();
    getItem(key: string): T | null;
    setItem(key: string, value: T): void;
    removeItem(key: string): void;
    getKeys(): string[];
    containsKey(key: string): boolean;
    clear(): void;
}
//# sourceMappingURL=MemoryStorage.d.ts.map
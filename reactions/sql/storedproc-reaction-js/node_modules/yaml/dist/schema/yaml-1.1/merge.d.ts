import type { ToJSContext } from '../../nodes/toJS.js';
import type { MapLike } from '../../nodes/YAMLMap.js';
import type { ScalarTag } from '../types.js';
export declare const merge: ScalarTag & {
    identify(value: unknown): boolean;
    test: RegExp;
};
export declare const isMergeKey: (ctx: ToJSContext | undefined, key: unknown) => boolean | undefined;
export declare function addMergeToJSMap(ctx: ToJSContext | undefined, map: MapLike, value: unknown): void;

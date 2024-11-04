"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = void 0;
const safe_stable_stringify_1 = require("safe-stable-stringify");
const safeStringify = (0, safe_stable_stringify_1.configure)({
    deterministic: false,
    // The reason for the following values is because it is fairly easy
    // to accidentally pass astronomically large objects to the logger.
    // For context, we were debugging a UI slowdown that was caused by
    // unknowingly trying to pass 5MB worth of data to the logger context.
    //
    // I am starting with hard limits for now to assess the impact of the changes,
    // but we may want to make these configurable in the future.
    maximumBreadth: 20,
    maximumDepth: 10,
    strict: false,
});
const stringify = (value) => {
    var _a;
    try {
        return (_a = safeStringify(value)) !== null && _a !== void 0 ? _a : '';
    }
    catch (error) {
        // The only time I've seen this happen is when the value was excessively large.
        // eslint-disable-next-line no-console
        console.error('[roarr] could not serialize value', value);
        throw error;
    }
};
exports.stringify = stringify;
//# sourceMappingURL=stringify.js.map
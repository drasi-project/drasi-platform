"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogLevelName = exports.logLevels = exports.Roarr = exports.ROARR = void 0;
const createLogger_1 = require("./factories/createLogger");
const createRoarrInitialGlobalState_1 = require("./factories/createRoarrInitialGlobalState");
const stringify_1 = require("./utilities/stringify");
const ROARR = (0, createRoarrInitialGlobalState_1.createRoarrInitialGlobalState)(globalThis.ROARR || {});
exports.ROARR = ROARR;
globalThis.ROARR = ROARR;
const serializeMessage = (message) => {
    return (0, stringify_1.stringify)(message);
};
const Roarr = (0, createLogger_1.createLogger)((message) => {
    var _a;
    if (ROARR.write) {
        // Stringify message as soon as it is received to prevent
        // properties of the context from being modified by reference.
        ROARR.write(((_a = ROARR.serializeMessage) !== null && _a !== void 0 ? _a : serializeMessage)(message));
    }
});
exports.Roarr = Roarr;
var constants_1 = require("./constants");
Object.defineProperty(exports, "logLevels", { enumerable: true, get: function () { return constants_1.logLevels; } });
var getLogLevelName_1 = require("./getLogLevelName");
Object.defineProperty(exports, "getLogLevelName", { enumerable: true, get: function () { return getLogLevelName_1.getLogLevelName; } });
//# sourceMappingURL=Roarr.js.map
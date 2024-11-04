"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTruthy = void 0;
const isTruthy = (value) => {
    return ['true', 't', 'yes', 'y', 'on', '1'].includes(value.trim().toLowerCase());
};
exports.isTruthy = isTruthy;
//# sourceMappingURL=isTruthy.js.map
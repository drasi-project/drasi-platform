"use strict";
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnownKeyExportEncryptionAlgorithm = exports.KnownKeyOperations = exports.LATEST_API_VERSION = exports.KnownKeyTypes = void 0;
const index_js_1 = require("./generated/models/index.js");
Object.defineProperty(exports, "KnownKeyTypes", { enumerable: true, get: function () { return index_js_1.KnownJsonWebKeyType; } });
/**
 * The latest supported Key Vault service API version
 */
exports.LATEST_API_VERSION = "7.5";
/** Known values of {@link KeyOperation} that the service accepts. */
var KnownKeyOperations;
(function (KnownKeyOperations) {
    /** Key operation - encrypt */
    KnownKeyOperations["Encrypt"] = "encrypt";
    /** Key operation - decrypt */
    KnownKeyOperations["Decrypt"] = "decrypt";
    /** Key operation - sign */
    KnownKeyOperations["Sign"] = "sign";
    /** Key operation - verify */
    KnownKeyOperations["Verify"] = "verify";
    /** Key operation - wrapKey */
    KnownKeyOperations["WrapKey"] = "wrapKey";
    /** Key operation - unwrapKey */
    KnownKeyOperations["UnwrapKey"] = "unwrapKey";
    /** Key operation - import */
    KnownKeyOperations["Import"] = "import";
})(KnownKeyOperations || (exports.KnownKeyOperations = KnownKeyOperations = {}));
/** Known values of {@link KeyExportEncryptionAlgorithm} that the service accepts. */
var KnownKeyExportEncryptionAlgorithm;
(function (KnownKeyExportEncryptionAlgorithm) {
    /** CKM_RSA_AES_KEY_WRAP Key Export Encryption Algorithm */
    KnownKeyExportEncryptionAlgorithm["CkmRsaAesKeyWrap"] = "CKM_RSA_AES_KEY_WRAP";
    /** RSA_AES_KEY_WRAP_256 Key Export Encryption Algorithm */
    KnownKeyExportEncryptionAlgorithm["RsaAesKeyWrap256"] = "RSA_AES_KEY_WRAP_256";
    /** RSA_AES_KEY_WRAP_384 Key Export Encryption Algorithm */
    KnownKeyExportEncryptionAlgorithm["RsaAesKeyWrap384"] = "RSA_AES_KEY_WRAP_384";
})(KnownKeyExportEncryptionAlgorithm || (exports.KnownKeyExportEncryptionAlgorithm = KnownKeyExportEncryptionAlgorithm = {}));
//# sourceMappingURL=keysModels.js.map
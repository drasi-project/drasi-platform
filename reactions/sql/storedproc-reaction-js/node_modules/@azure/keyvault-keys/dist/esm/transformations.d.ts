import { DeletedKeyBundle, DeletedKeyItem, KeyRotationPolicy as GeneratedPolicy, KeyBundle, KeyItem } from "./generated/models/index.js";
import { DeletedKey, KeyProperties, KeyRotationPolicy, KeyRotationPolicyProperties, KeyVaultKey } from "./keysModels.js";
/**
 * @internal
 * Shapes the exposed {@link KeyVaultKey} based on either a received key bundle or deleted key bundle.
 */
export declare function getKeyFromKeyBundle(bundle: KeyBundle | DeletedKeyBundle): KeyVaultKey | DeletedKey;
/**
 * @internal
 * Shapes the exposed {@link DeletedKey} based on a received KeyItem.
 */
export declare function getDeletedKeyFromDeletedKeyItem(keyItem: DeletedKeyItem): DeletedKey;
/**
 * @internal
 * Shapes the exposed {@link KeyProperties} based on a received KeyItem.
 */
export declare function getKeyPropertiesFromKeyItem(keyItem: KeyItem): KeyProperties;
/**
 * @internal
 */
export declare const keyRotationTransformations: {
    propertiesToGenerated: (parameters: KeyRotationPolicyProperties) => Partial<GeneratedPolicy>;
    generatedToPublic(generated: GeneratedPolicy): KeyRotationPolicy;
};
//# sourceMappingURL=transformations.d.ts.map
import { RecoverDeletedKeyPollOperationState } from "./operation.js";
import { KeyVaultKey } from "../../keysModels.js";
import { KeyVaultKeyPoller, KeyVaultKeyPollerOptions } from "../keyVaultKeyPoller.js";
/**
 * Class that deletes a poller that waits until a key finishes being deleted
 */
export declare class RecoverDeletedKeyPoller extends KeyVaultKeyPoller<RecoverDeletedKeyPollOperationState, KeyVaultKey> {
    constructor(options: KeyVaultKeyPollerOptions);
}
//# sourceMappingURL=poller.d.ts.map
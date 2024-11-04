import { DeleteKeyPollOperationState } from "./operation.js";
import { DeletedKey } from "../../keysModels.js";
import { KeyVaultKeyPoller, KeyVaultKeyPollerOptions } from "../keyVaultKeyPoller.js";
/**
 * Class that creates a poller that waits until a key finishes being deleted.
 */
export declare class DeleteKeyPoller extends KeyVaultKeyPoller<DeleteKeyPollOperationState, DeletedKey> {
    constructor(options: KeyVaultKeyPollerOptions);
}
//# sourceMappingURL=poller.d.ts.map
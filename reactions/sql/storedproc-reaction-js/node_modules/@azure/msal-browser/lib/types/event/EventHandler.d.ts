import { Logger } from "@azure/msal-common/browser";
import { InteractionType } from "../utils/BrowserConstants.js";
import { EventCallbackFunction, EventError, EventPayload } from "./EventMessage.js";
import { EventType } from "./EventType.js";
export declare class EventHandler {
    private eventCallbacks;
    private logger;
    constructor(logger?: Logger);
    /**
     * Adds event callbacks to array
     * @param callback - callback to be invoked when an event is raised
     * @param eventTypes - list of events that this callback will be invoked for, if not provided callback will be invoked for all events
     * @param callbackId - Identifier for the callback, used to locate and remove the callback when no longer required
     */
    addEventCallback(callback: EventCallbackFunction, eventTypes?: Array<EventType>, callbackId?: string): string | null;
    /**
     * Removes callback with provided id from callback array
     * @param callbackId
     */
    removeEventCallback(callbackId: string): void;
    /**
     * Emits events by calling callback with event message
     * @param eventType
     * @param interactionType
     * @param payload
     * @param error
     */
    emitEvent(eventType: EventType, interactionType?: InteractionType, payload?: EventPayload, error?: EventError): void;
}
//# sourceMappingURL=EventHandler.d.ts.map
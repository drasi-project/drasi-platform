// source: orchestrator_service.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js');
goog.object.extend(proto, google_protobuf_timestamp_pb);
var google_protobuf_wrappers_pb = require('google-protobuf/google/protobuf/wrappers_pb.js');
goog.object.extend(proto, google_protobuf_wrappers_pb);
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');
goog.object.extend(proto, google_protobuf_empty_pb);
goog.exportSymbol('proto.ActivityRequest', null, global);
goog.exportSymbol('proto.ActivityResponse', null, global);
goog.exportSymbol('proto.CompleteOrchestrationAction', null, global);
goog.exportSymbol('proto.CompleteTaskResponse', null, global);
goog.exportSymbol('proto.ContinueAsNewEvent', null, global);
goog.exportSymbol('proto.CreateInstanceRequest', null, global);
goog.exportSymbol('proto.CreateInstanceResponse', null, global);
goog.exportSymbol('proto.CreateSubOrchestrationAction', null, global);
goog.exportSymbol('proto.CreateTaskHubRequest', null, global);
goog.exportSymbol('proto.CreateTaskHubResponse', null, global);
goog.exportSymbol('proto.CreateTimerAction', null, global);
goog.exportSymbol('proto.DeleteTaskHubRequest', null, global);
goog.exportSymbol('proto.DeleteTaskHubResponse', null, global);
goog.exportSymbol('proto.EventRaisedEvent', null, global);
goog.exportSymbol('proto.EventSentEvent', null, global);
goog.exportSymbol('proto.ExecutionCompletedEvent', null, global);
goog.exportSymbol('proto.ExecutionResumedEvent', null, global);
goog.exportSymbol('proto.ExecutionStartedEvent', null, global);
goog.exportSymbol('proto.ExecutionSuspendedEvent', null, global);
goog.exportSymbol('proto.ExecutionTerminatedEvent', null, global);
goog.exportSymbol('proto.GenericEvent', null, global);
goog.exportSymbol('proto.GetInstanceRequest', null, global);
goog.exportSymbol('proto.GetInstanceResponse', null, global);
goog.exportSymbol('proto.GetWorkItemsRequest', null, global);
goog.exportSymbol('proto.HistoryEvent', null, global);
goog.exportSymbol('proto.HistoryEvent.EventtypeCase', null, global);
goog.exportSymbol('proto.HistoryStateEvent', null, global);
goog.exportSymbol('proto.InstanceQuery', null, global);
goog.exportSymbol('proto.OrchestrationInstance', null, global);
goog.exportSymbol('proto.OrchestrationState', null, global);
goog.exportSymbol('proto.OrchestrationStatus', null, global);
goog.exportSymbol('proto.OrchestratorAction', null, global);
goog.exportSymbol('proto.OrchestratorAction.OrchestratoractiontypeCase', null, global);
goog.exportSymbol('proto.OrchestratorCompletedEvent', null, global);
goog.exportSymbol('proto.OrchestratorRequest', null, global);
goog.exportSymbol('proto.OrchestratorResponse', null, global);
goog.exportSymbol('proto.OrchestratorStartedEvent', null, global);
goog.exportSymbol('proto.ParentInstanceInfo', null, global);
goog.exportSymbol('proto.PurgeInstanceFilter', null, global);
goog.exportSymbol('proto.PurgeInstancesRequest', null, global);
goog.exportSymbol('proto.PurgeInstancesRequest.RequestCase', null, global);
goog.exportSymbol('proto.PurgeInstancesResponse', null, global);
goog.exportSymbol('proto.QueryInstancesRequest', null, global);
goog.exportSymbol('proto.QueryInstancesResponse', null, global);
goog.exportSymbol('proto.RaiseEventRequest', null, global);
goog.exportSymbol('proto.RaiseEventResponse', null, global);
goog.exportSymbol('proto.ResumeRequest', null, global);
goog.exportSymbol('proto.ResumeResponse', null, global);
goog.exportSymbol('proto.RewindInstanceRequest', null, global);
goog.exportSymbol('proto.RewindInstanceResponse', null, global);
goog.exportSymbol('proto.ScheduleTaskAction', null, global);
goog.exportSymbol('proto.SendEventAction', null, global);
goog.exportSymbol('proto.SubOrchestrationInstanceCompletedEvent', null, global);
goog.exportSymbol('proto.SubOrchestrationInstanceCreatedEvent', null, global);
goog.exportSymbol('proto.SubOrchestrationInstanceFailedEvent', null, global);
goog.exportSymbol('proto.SuspendRequest', null, global);
goog.exportSymbol('proto.SuspendResponse', null, global);
goog.exportSymbol('proto.TaskCompletedEvent', null, global);
goog.exportSymbol('proto.TaskFailedEvent', null, global);
goog.exportSymbol('proto.TaskFailureDetails', null, global);
goog.exportSymbol('proto.TaskScheduledEvent', null, global);
goog.exportSymbol('proto.TerminateRequest', null, global);
goog.exportSymbol('proto.TerminateResponse', null, global);
goog.exportSymbol('proto.TimerCreatedEvent', null, global);
goog.exportSymbol('proto.TimerFiredEvent', null, global);
goog.exportSymbol('proto.WorkItem', null, global);
goog.exportSymbol('proto.WorkItem.RequestCase', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.OrchestrationInstance = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.OrchestrationInstance, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.OrchestrationInstance.displayName = 'proto.OrchestrationInstance';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ActivityRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ActivityRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ActivityRequest.displayName = 'proto.ActivityRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ActivityResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ActivityResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ActivityResponse.displayName = 'proto.ActivityResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.TaskFailureDetails = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.TaskFailureDetails, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TaskFailureDetails.displayName = 'proto.TaskFailureDetails';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ParentInstanceInfo = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ParentInstanceInfo, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ParentInstanceInfo.displayName = 'proto.ParentInstanceInfo';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ExecutionStartedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ExecutionStartedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ExecutionStartedEvent.displayName = 'proto.ExecutionStartedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ExecutionCompletedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ExecutionCompletedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ExecutionCompletedEvent.displayName = 'proto.ExecutionCompletedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ExecutionTerminatedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ExecutionTerminatedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ExecutionTerminatedEvent.displayName = 'proto.ExecutionTerminatedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.TaskScheduledEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.TaskScheduledEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TaskScheduledEvent.displayName = 'proto.TaskScheduledEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.TaskCompletedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.TaskCompletedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TaskCompletedEvent.displayName = 'proto.TaskCompletedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.TaskFailedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.TaskFailedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TaskFailedEvent.displayName = 'proto.TaskFailedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.SubOrchestrationInstanceCreatedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.SubOrchestrationInstanceCreatedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.SubOrchestrationInstanceCreatedEvent.displayName = 'proto.SubOrchestrationInstanceCreatedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.SubOrchestrationInstanceCompletedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.SubOrchestrationInstanceCompletedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.SubOrchestrationInstanceCompletedEvent.displayName = 'proto.SubOrchestrationInstanceCompletedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.SubOrchestrationInstanceFailedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.SubOrchestrationInstanceFailedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.SubOrchestrationInstanceFailedEvent.displayName = 'proto.SubOrchestrationInstanceFailedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.TimerCreatedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.TimerCreatedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TimerCreatedEvent.displayName = 'proto.TimerCreatedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.TimerFiredEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.TimerFiredEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TimerFiredEvent.displayName = 'proto.TimerFiredEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.OrchestratorStartedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.OrchestratorStartedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.OrchestratorStartedEvent.displayName = 'proto.OrchestratorStartedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.OrchestratorCompletedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.OrchestratorCompletedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.OrchestratorCompletedEvent.displayName = 'proto.OrchestratorCompletedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.EventSentEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.EventSentEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.EventSentEvent.displayName = 'proto.EventSentEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.EventRaisedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.EventRaisedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.EventRaisedEvent.displayName = 'proto.EventRaisedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.GenericEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.GenericEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.GenericEvent.displayName = 'proto.GenericEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.HistoryStateEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.HistoryStateEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.HistoryStateEvent.displayName = 'proto.HistoryStateEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ContinueAsNewEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ContinueAsNewEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ContinueAsNewEvent.displayName = 'proto.ContinueAsNewEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ExecutionSuspendedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ExecutionSuspendedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ExecutionSuspendedEvent.displayName = 'proto.ExecutionSuspendedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ExecutionResumedEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ExecutionResumedEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ExecutionResumedEvent.displayName = 'proto.ExecutionResumedEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.HistoryEvent = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.HistoryEvent.oneofGroups_);
};
goog.inherits(proto.HistoryEvent, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.HistoryEvent.displayName = 'proto.HistoryEvent';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ScheduleTaskAction = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ScheduleTaskAction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ScheduleTaskAction.displayName = 'proto.ScheduleTaskAction';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.CreateSubOrchestrationAction = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.CreateSubOrchestrationAction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.CreateSubOrchestrationAction.displayName = 'proto.CreateSubOrchestrationAction';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.CreateTimerAction = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.CreateTimerAction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.CreateTimerAction.displayName = 'proto.CreateTimerAction';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.SendEventAction = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.SendEventAction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.SendEventAction.displayName = 'proto.SendEventAction';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.CompleteOrchestrationAction = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.CompleteOrchestrationAction.repeatedFields_, null);
};
goog.inherits(proto.CompleteOrchestrationAction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.CompleteOrchestrationAction.displayName = 'proto.CompleteOrchestrationAction';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.OrchestratorAction = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.OrchestratorAction.oneofGroups_);
};
goog.inherits(proto.OrchestratorAction, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.OrchestratorAction.displayName = 'proto.OrchestratorAction';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.OrchestratorRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.OrchestratorRequest.repeatedFields_, null);
};
goog.inherits(proto.OrchestratorRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.OrchestratorRequest.displayName = 'proto.OrchestratorRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.OrchestratorResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.OrchestratorResponse.repeatedFields_, null);
};
goog.inherits(proto.OrchestratorResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.OrchestratorResponse.displayName = 'proto.OrchestratorResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.CreateInstanceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.CreateInstanceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.CreateInstanceRequest.displayName = 'proto.CreateInstanceRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.CreateInstanceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.CreateInstanceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.CreateInstanceResponse.displayName = 'proto.CreateInstanceResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.GetInstanceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.GetInstanceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.GetInstanceRequest.displayName = 'proto.GetInstanceRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.GetInstanceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.GetInstanceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.GetInstanceResponse.displayName = 'proto.GetInstanceResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.RewindInstanceRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.RewindInstanceRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.RewindInstanceRequest.displayName = 'proto.RewindInstanceRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.RewindInstanceResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.RewindInstanceResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.RewindInstanceResponse.displayName = 'proto.RewindInstanceResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.OrchestrationState = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.OrchestrationState, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.OrchestrationState.displayName = 'proto.OrchestrationState';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.RaiseEventRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.RaiseEventRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.RaiseEventRequest.displayName = 'proto.RaiseEventRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.RaiseEventResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.RaiseEventResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.RaiseEventResponse.displayName = 'proto.RaiseEventResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.TerminateRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.TerminateRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TerminateRequest.displayName = 'proto.TerminateRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.TerminateResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.TerminateResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.TerminateResponse.displayName = 'proto.TerminateResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.SuspendRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.SuspendRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.SuspendRequest.displayName = 'proto.SuspendRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.SuspendResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.SuspendResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.SuspendResponse.displayName = 'proto.SuspendResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ResumeRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ResumeRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ResumeRequest.displayName = 'proto.ResumeRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.ResumeResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.ResumeResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.ResumeResponse.displayName = 'proto.ResumeResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.QueryInstancesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.QueryInstancesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.QueryInstancesRequest.displayName = 'proto.QueryInstancesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.InstanceQuery = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.InstanceQuery.repeatedFields_, null);
};
goog.inherits(proto.InstanceQuery, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.InstanceQuery.displayName = 'proto.InstanceQuery';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.QueryInstancesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.QueryInstancesResponse.repeatedFields_, null);
};
goog.inherits(proto.QueryInstancesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.QueryInstancesResponse.displayName = 'proto.QueryInstancesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.PurgeInstancesRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.PurgeInstancesRequest.oneofGroups_);
};
goog.inherits(proto.PurgeInstancesRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.PurgeInstancesRequest.displayName = 'proto.PurgeInstancesRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.PurgeInstanceFilter = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.PurgeInstanceFilter.repeatedFields_, null);
};
goog.inherits(proto.PurgeInstanceFilter, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.PurgeInstanceFilter.displayName = 'proto.PurgeInstanceFilter';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.PurgeInstancesResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.PurgeInstancesResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.PurgeInstancesResponse.displayName = 'proto.PurgeInstancesResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.CreateTaskHubRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.CreateTaskHubRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.CreateTaskHubRequest.displayName = 'proto.CreateTaskHubRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.CreateTaskHubResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.CreateTaskHubResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.CreateTaskHubResponse.displayName = 'proto.CreateTaskHubResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.DeleteTaskHubRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.DeleteTaskHubRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.DeleteTaskHubRequest.displayName = 'proto.DeleteTaskHubRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.DeleteTaskHubResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.DeleteTaskHubResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.DeleteTaskHubResponse.displayName = 'proto.DeleteTaskHubResponse';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.GetWorkItemsRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.GetWorkItemsRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.GetWorkItemsRequest.displayName = 'proto.GetWorkItemsRequest';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.WorkItem = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, proto.WorkItem.oneofGroups_);
};
goog.inherits(proto.WorkItem, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.WorkItem.displayName = 'proto.WorkItem';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.CompleteTaskResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.CompleteTaskResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.CompleteTaskResponse.displayName = 'proto.CompleteTaskResponse';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.OrchestrationInstance.prototype.toObject = function(opt_includeInstance) {
  return proto.OrchestrationInstance.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.OrchestrationInstance} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestrationInstance.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    executionid: (f = msg.getExecutionid()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.OrchestrationInstance}
 */
proto.OrchestrationInstance.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.OrchestrationInstance;
  return proto.OrchestrationInstance.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.OrchestrationInstance} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.OrchestrationInstance}
 */
proto.OrchestrationInstance.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setExecutionid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.OrchestrationInstance.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.OrchestrationInstance.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.OrchestrationInstance} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestrationInstance.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getExecutionid();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.OrchestrationInstance.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.OrchestrationInstance} returns this
 */
proto.OrchestrationInstance.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue executionId = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.OrchestrationInstance.prototype.getExecutionid = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.OrchestrationInstance} returns this
*/
proto.OrchestrationInstance.prototype.setExecutionid = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestrationInstance} returns this
 */
proto.OrchestrationInstance.prototype.clearExecutionid = function() {
  return this.setExecutionid(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestrationInstance.prototype.hasExecutionid = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ActivityRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.ActivityRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ActivityRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ActivityRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    version: (f = msg.getVersion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    orchestrationinstance: (f = msg.getOrchestrationinstance()) && proto.OrchestrationInstance.toObject(includeInstance, f),
    taskid: jspb.Message.getFieldWithDefault(msg, 5, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ActivityRequest}
 */
proto.ActivityRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ActivityRequest;
  return proto.ActivityRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ActivityRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ActivityRequest}
 */
proto.ActivityRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setVersion(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    case 4:
      var value = new proto.OrchestrationInstance;
      reader.readMessage(value,proto.OrchestrationInstance.deserializeBinaryFromReader);
      msg.setOrchestrationinstance(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTaskid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ActivityRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ActivityRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ActivityRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ActivityRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getVersion();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getOrchestrationinstance();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.OrchestrationInstance.serializeBinaryToWriter
    );
  }
  f = message.getTaskid();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.ActivityRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.ActivityRequest} returns this
 */
proto.ActivityRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue version = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ActivityRequest.prototype.getVersion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ActivityRequest} returns this
*/
proto.ActivityRequest.prototype.setVersion = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ActivityRequest} returns this
 */
proto.ActivityRequest.prototype.clearVersion = function() {
  return this.setVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ActivityRequest.prototype.hasVersion = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional google.protobuf.StringValue input = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ActivityRequest.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ActivityRequest} returns this
*/
proto.ActivityRequest.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ActivityRequest} returns this
 */
proto.ActivityRequest.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ActivityRequest.prototype.hasInput = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional OrchestrationInstance orchestrationInstance = 4;
 * @return {?proto.OrchestrationInstance}
 */
proto.ActivityRequest.prototype.getOrchestrationinstance = function() {
  return /** @type{?proto.OrchestrationInstance} */ (
    jspb.Message.getWrapperField(this, proto.OrchestrationInstance, 4));
};


/**
 * @param {?proto.OrchestrationInstance|undefined} value
 * @return {!proto.ActivityRequest} returns this
*/
proto.ActivityRequest.prototype.setOrchestrationinstance = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ActivityRequest} returns this
 */
proto.ActivityRequest.prototype.clearOrchestrationinstance = function() {
  return this.setOrchestrationinstance(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ActivityRequest.prototype.hasOrchestrationinstance = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional int32 taskId = 5;
 * @return {number}
 */
proto.ActivityRequest.prototype.getTaskid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.ActivityRequest} returns this
 */
proto.ActivityRequest.prototype.setTaskid = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ActivityResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.ActivityResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ActivityResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ActivityResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    taskid: jspb.Message.getFieldWithDefault(msg, 2, 0),
    result: (f = msg.getResult()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    failuredetails: (f = msg.getFailuredetails()) && proto.TaskFailureDetails.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ActivityResponse}
 */
proto.ActivityResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ActivityResponse;
  return proto.ActivityResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ActivityResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ActivityResponse}
 */
proto.ActivityResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTaskid(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setResult(value);
      break;
    case 4:
      var value = new proto.TaskFailureDetails;
      reader.readMessage(value,proto.TaskFailureDetails.deserializeBinaryFromReader);
      msg.setFailuredetails(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ActivityResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ActivityResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ActivityResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ActivityResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getTaskid();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
  f = message.getResult();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getFailuredetails();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.TaskFailureDetails.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.ActivityResponse.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.ActivityResponse} returns this
 */
proto.ActivityResponse.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional int32 taskId = 2;
 * @return {number}
 */
proto.ActivityResponse.prototype.getTaskid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.ActivityResponse} returns this
 */
proto.ActivityResponse.prototype.setTaskid = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};


/**
 * optional google.protobuf.StringValue result = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ActivityResponse.prototype.getResult = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ActivityResponse} returns this
*/
proto.ActivityResponse.prototype.setResult = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ActivityResponse} returns this
 */
proto.ActivityResponse.prototype.clearResult = function() {
  return this.setResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ActivityResponse.prototype.hasResult = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional TaskFailureDetails failureDetails = 4;
 * @return {?proto.TaskFailureDetails}
 */
proto.ActivityResponse.prototype.getFailuredetails = function() {
  return /** @type{?proto.TaskFailureDetails} */ (
    jspb.Message.getWrapperField(this, proto.TaskFailureDetails, 4));
};


/**
 * @param {?proto.TaskFailureDetails|undefined} value
 * @return {!proto.ActivityResponse} returns this
*/
proto.ActivityResponse.prototype.setFailuredetails = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ActivityResponse} returns this
 */
proto.ActivityResponse.prototype.clearFailuredetails = function() {
  return this.setFailuredetails(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ActivityResponse.prototype.hasFailuredetails = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.TaskFailureDetails.prototype.toObject = function(opt_includeInstance) {
  return proto.TaskFailureDetails.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TaskFailureDetails} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskFailureDetails.toObject = function(includeInstance, msg) {
  var f, obj = {
    errortype: jspb.Message.getFieldWithDefault(msg, 1, ""),
    errormessage: jspb.Message.getFieldWithDefault(msg, 2, ""),
    stacktrace: (f = msg.getStacktrace()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    innerfailure: (f = msg.getInnerfailure()) && proto.TaskFailureDetails.toObject(includeInstance, f),
    isnonretriable: jspb.Message.getBooleanFieldWithDefault(msg, 5, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.TaskFailureDetails}
 */
proto.TaskFailureDetails.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TaskFailureDetails;
  return proto.TaskFailureDetails.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TaskFailureDetails} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TaskFailureDetails}
 */
proto.TaskFailureDetails.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setErrortype(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setErrormessage(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setStacktrace(value);
      break;
    case 4:
      var value = new proto.TaskFailureDetails;
      reader.readMessage(value,proto.TaskFailureDetails.deserializeBinaryFromReader);
      msg.setInnerfailure(value);
      break;
    case 5:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setIsnonretriable(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.TaskFailureDetails.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TaskFailureDetails.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TaskFailureDetails} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskFailureDetails.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getErrortype();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getErrormessage();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getStacktrace();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getInnerfailure();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.TaskFailureDetails.serializeBinaryToWriter
    );
  }
  f = message.getIsnonretriable();
  if (f) {
    writer.writeBool(
      5,
      f
    );
  }
};


/**
 * optional string errorType = 1;
 * @return {string}
 */
proto.TaskFailureDetails.prototype.getErrortype = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskFailureDetails} returns this
 */
proto.TaskFailureDetails.prototype.setErrortype = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string errorMessage = 2;
 * @return {string}
 */
proto.TaskFailureDetails.prototype.getErrormessage = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskFailureDetails} returns this
 */
proto.TaskFailureDetails.prototype.setErrormessage = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.StringValue stackTrace = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.TaskFailureDetails.prototype.getStacktrace = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.TaskFailureDetails} returns this
*/
proto.TaskFailureDetails.prototype.setStacktrace = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.TaskFailureDetails} returns this
 */
proto.TaskFailureDetails.prototype.clearStacktrace = function() {
  return this.setStacktrace(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.TaskFailureDetails.prototype.hasStacktrace = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional TaskFailureDetails innerFailure = 4;
 * @return {?proto.TaskFailureDetails}
 */
proto.TaskFailureDetails.prototype.getInnerfailure = function() {
  return /** @type{?proto.TaskFailureDetails} */ (
    jspb.Message.getWrapperField(this, proto.TaskFailureDetails, 4));
};


/**
 * @param {?proto.TaskFailureDetails|undefined} value
 * @return {!proto.TaskFailureDetails} returns this
*/
proto.TaskFailureDetails.prototype.setInnerfailure = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.TaskFailureDetails} returns this
 */
proto.TaskFailureDetails.prototype.clearInnerfailure = function() {
  return this.setInnerfailure(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.TaskFailureDetails.prototype.hasInnerfailure = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional bool isNonRetriable = 5;
 * @return {boolean}
 */
proto.TaskFailureDetails.prototype.getIsnonretriable = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 5, false));
};


/**
 * @param {boolean} value
 * @return {!proto.TaskFailureDetails} returns this
 */
proto.TaskFailureDetails.prototype.setIsnonretriable = function(value) {
  return jspb.Message.setProto3BooleanField(this, 5, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ParentInstanceInfo.prototype.toObject = function(opt_includeInstance) {
  return proto.ParentInstanceInfo.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ParentInstanceInfo} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ParentInstanceInfo.toObject = function(includeInstance, msg) {
  var f, obj = {
    taskscheduledid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    name: (f = msg.getName()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    version: (f = msg.getVersion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    orchestrationinstance: (f = msg.getOrchestrationinstance()) && proto.OrchestrationInstance.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ParentInstanceInfo}
 */
proto.ParentInstanceInfo.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ParentInstanceInfo;
  return proto.ParentInstanceInfo.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ParentInstanceInfo} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ParentInstanceInfo}
 */
proto.ParentInstanceInfo.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTaskscheduledid(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setName(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setVersion(value);
      break;
    case 4:
      var value = new proto.OrchestrationInstance;
      reader.readMessage(value,proto.OrchestrationInstance.deserializeBinaryFromReader);
      msg.setOrchestrationinstance(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ParentInstanceInfo.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ParentInstanceInfo.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ParentInstanceInfo} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ParentInstanceInfo.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTaskscheduledid();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getName();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getVersion();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getOrchestrationinstance();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.OrchestrationInstance.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 taskScheduledId = 1;
 * @return {number}
 */
proto.ParentInstanceInfo.prototype.getTaskscheduledid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.ParentInstanceInfo} returns this
 */
proto.ParentInstanceInfo.prototype.setTaskscheduledid = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue name = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ParentInstanceInfo.prototype.getName = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ParentInstanceInfo} returns this
*/
proto.ParentInstanceInfo.prototype.setName = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ParentInstanceInfo} returns this
 */
proto.ParentInstanceInfo.prototype.clearName = function() {
  return this.setName(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ParentInstanceInfo.prototype.hasName = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional google.protobuf.StringValue version = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ParentInstanceInfo.prototype.getVersion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ParentInstanceInfo} returns this
*/
proto.ParentInstanceInfo.prototype.setVersion = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ParentInstanceInfo} returns this
 */
proto.ParentInstanceInfo.prototype.clearVersion = function() {
  return this.setVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ParentInstanceInfo.prototype.hasVersion = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional OrchestrationInstance orchestrationInstance = 4;
 * @return {?proto.OrchestrationInstance}
 */
proto.ParentInstanceInfo.prototype.getOrchestrationinstance = function() {
  return /** @type{?proto.OrchestrationInstance} */ (
    jspb.Message.getWrapperField(this, proto.OrchestrationInstance, 4));
};


/**
 * @param {?proto.OrchestrationInstance|undefined} value
 * @return {!proto.ParentInstanceInfo} returns this
*/
proto.ParentInstanceInfo.prototype.setOrchestrationinstance = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ParentInstanceInfo} returns this
 */
proto.ParentInstanceInfo.prototype.clearOrchestrationinstance = function() {
  return this.setOrchestrationinstance(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ParentInstanceInfo.prototype.hasOrchestrationinstance = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ExecutionStartedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.ExecutionStartedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ExecutionStartedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionStartedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    version: (f = msg.getVersion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    orchestrationinstance: (f = msg.getOrchestrationinstance()) && proto.OrchestrationInstance.toObject(includeInstance, f),
    parentinstance: (f = msg.getParentinstance()) && proto.ParentInstanceInfo.toObject(includeInstance, f),
    scheduledstarttimestamp: (f = msg.getScheduledstarttimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    correlationdata: (f = msg.getCorrelationdata()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ExecutionStartedEvent}
 */
proto.ExecutionStartedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ExecutionStartedEvent;
  return proto.ExecutionStartedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ExecutionStartedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ExecutionStartedEvent}
 */
proto.ExecutionStartedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setVersion(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    case 4:
      var value = new proto.OrchestrationInstance;
      reader.readMessage(value,proto.OrchestrationInstance.deserializeBinaryFromReader);
      msg.setOrchestrationinstance(value);
      break;
    case 5:
      var value = new proto.ParentInstanceInfo;
      reader.readMessage(value,proto.ParentInstanceInfo.deserializeBinaryFromReader);
      msg.setParentinstance(value);
      break;
    case 6:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setScheduledstarttimestamp(value);
      break;
    case 7:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setCorrelationdata(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ExecutionStartedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ExecutionStartedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ExecutionStartedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionStartedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getVersion();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getOrchestrationinstance();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.OrchestrationInstance.serializeBinaryToWriter
    );
  }
  f = message.getParentinstance();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.ParentInstanceInfo.serializeBinaryToWriter
    );
  }
  f = message.getScheduledstarttimestamp();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getCorrelationdata();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.ExecutionStartedEvent.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.ExecutionStartedEvent} returns this
 */
proto.ExecutionStartedEvent.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue version = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ExecutionStartedEvent.prototype.getVersion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ExecutionStartedEvent} returns this
*/
proto.ExecutionStartedEvent.prototype.setVersion = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionStartedEvent} returns this
 */
proto.ExecutionStartedEvent.prototype.clearVersion = function() {
  return this.setVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionStartedEvent.prototype.hasVersion = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional google.protobuf.StringValue input = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ExecutionStartedEvent.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ExecutionStartedEvent} returns this
*/
proto.ExecutionStartedEvent.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionStartedEvent} returns this
 */
proto.ExecutionStartedEvent.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionStartedEvent.prototype.hasInput = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional OrchestrationInstance orchestrationInstance = 4;
 * @return {?proto.OrchestrationInstance}
 */
proto.ExecutionStartedEvent.prototype.getOrchestrationinstance = function() {
  return /** @type{?proto.OrchestrationInstance} */ (
    jspb.Message.getWrapperField(this, proto.OrchestrationInstance, 4));
};


/**
 * @param {?proto.OrchestrationInstance|undefined} value
 * @return {!proto.ExecutionStartedEvent} returns this
*/
proto.ExecutionStartedEvent.prototype.setOrchestrationinstance = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionStartedEvent} returns this
 */
proto.ExecutionStartedEvent.prototype.clearOrchestrationinstance = function() {
  return this.setOrchestrationinstance(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionStartedEvent.prototype.hasOrchestrationinstance = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional ParentInstanceInfo parentInstance = 5;
 * @return {?proto.ParentInstanceInfo}
 */
proto.ExecutionStartedEvent.prototype.getParentinstance = function() {
  return /** @type{?proto.ParentInstanceInfo} */ (
    jspb.Message.getWrapperField(this, proto.ParentInstanceInfo, 5));
};


/**
 * @param {?proto.ParentInstanceInfo|undefined} value
 * @return {!proto.ExecutionStartedEvent} returns this
*/
proto.ExecutionStartedEvent.prototype.setParentinstance = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionStartedEvent} returns this
 */
proto.ExecutionStartedEvent.prototype.clearParentinstance = function() {
  return this.setParentinstance(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionStartedEvent.prototype.hasParentinstance = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional google.protobuf.Timestamp scheduledStartTimestamp = 6;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.ExecutionStartedEvent.prototype.getScheduledstarttimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 6));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.ExecutionStartedEvent} returns this
*/
proto.ExecutionStartedEvent.prototype.setScheduledstarttimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionStartedEvent} returns this
 */
proto.ExecutionStartedEvent.prototype.clearScheduledstarttimestamp = function() {
  return this.setScheduledstarttimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionStartedEvent.prototype.hasScheduledstarttimestamp = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional google.protobuf.StringValue correlationData = 7;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ExecutionStartedEvent.prototype.getCorrelationdata = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 7));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ExecutionStartedEvent} returns this
*/
proto.ExecutionStartedEvent.prototype.setCorrelationdata = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionStartedEvent} returns this
 */
proto.ExecutionStartedEvent.prototype.clearCorrelationdata = function() {
  return this.setCorrelationdata(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionStartedEvent.prototype.hasCorrelationdata = function() {
  return jspb.Message.getField(this, 7) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ExecutionCompletedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.ExecutionCompletedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ExecutionCompletedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionCompletedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    orchestrationstatus: jspb.Message.getFieldWithDefault(msg, 1, 0),
    result: (f = msg.getResult()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    failuredetails: (f = msg.getFailuredetails()) && proto.TaskFailureDetails.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ExecutionCompletedEvent}
 */
proto.ExecutionCompletedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ExecutionCompletedEvent;
  return proto.ExecutionCompletedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ExecutionCompletedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ExecutionCompletedEvent}
 */
proto.ExecutionCompletedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.OrchestrationStatus} */ (reader.readEnum());
      msg.setOrchestrationstatus(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setResult(value);
      break;
    case 3:
      var value = new proto.TaskFailureDetails;
      reader.readMessage(value,proto.TaskFailureDetails.deserializeBinaryFromReader);
      msg.setFailuredetails(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ExecutionCompletedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ExecutionCompletedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ExecutionCompletedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionCompletedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrchestrationstatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getResult();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getFailuredetails();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.TaskFailureDetails.serializeBinaryToWriter
    );
  }
};


/**
 * optional OrchestrationStatus orchestrationStatus = 1;
 * @return {!proto.OrchestrationStatus}
 */
proto.ExecutionCompletedEvent.prototype.getOrchestrationstatus = function() {
  return /** @type {!proto.OrchestrationStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.OrchestrationStatus} value
 * @return {!proto.ExecutionCompletedEvent} returns this
 */
proto.ExecutionCompletedEvent.prototype.setOrchestrationstatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue result = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ExecutionCompletedEvent.prototype.getResult = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ExecutionCompletedEvent} returns this
*/
proto.ExecutionCompletedEvent.prototype.setResult = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionCompletedEvent} returns this
 */
proto.ExecutionCompletedEvent.prototype.clearResult = function() {
  return this.setResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionCompletedEvent.prototype.hasResult = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional TaskFailureDetails failureDetails = 3;
 * @return {?proto.TaskFailureDetails}
 */
proto.ExecutionCompletedEvent.prototype.getFailuredetails = function() {
  return /** @type{?proto.TaskFailureDetails} */ (
    jspb.Message.getWrapperField(this, proto.TaskFailureDetails, 3));
};


/**
 * @param {?proto.TaskFailureDetails|undefined} value
 * @return {!proto.ExecutionCompletedEvent} returns this
*/
proto.ExecutionCompletedEvent.prototype.setFailuredetails = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionCompletedEvent} returns this
 */
proto.ExecutionCompletedEvent.prototype.clearFailuredetails = function() {
  return this.setFailuredetails(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionCompletedEvent.prototype.hasFailuredetails = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ExecutionTerminatedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.ExecutionTerminatedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ExecutionTerminatedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionTerminatedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ExecutionTerminatedEvent}
 */
proto.ExecutionTerminatedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ExecutionTerminatedEvent;
  return proto.ExecutionTerminatedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ExecutionTerminatedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ExecutionTerminatedEvent}
 */
proto.ExecutionTerminatedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ExecutionTerminatedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ExecutionTerminatedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ExecutionTerminatedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionTerminatedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional google.protobuf.StringValue input = 1;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ExecutionTerminatedEvent.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 1));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ExecutionTerminatedEvent} returns this
*/
proto.ExecutionTerminatedEvent.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionTerminatedEvent} returns this
 */
proto.ExecutionTerminatedEvent.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionTerminatedEvent.prototype.hasInput = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.TaskScheduledEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.TaskScheduledEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TaskScheduledEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskScheduledEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    version: (f = msg.getVersion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.TaskScheduledEvent}
 */
proto.TaskScheduledEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TaskScheduledEvent;
  return proto.TaskScheduledEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TaskScheduledEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TaskScheduledEvent}
 */
proto.TaskScheduledEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setVersion(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.TaskScheduledEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TaskScheduledEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TaskScheduledEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskScheduledEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getVersion();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.TaskScheduledEvent.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.TaskScheduledEvent} returns this
 */
proto.TaskScheduledEvent.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue version = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.TaskScheduledEvent.prototype.getVersion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.TaskScheduledEvent} returns this
*/
proto.TaskScheduledEvent.prototype.setVersion = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.TaskScheduledEvent} returns this
 */
proto.TaskScheduledEvent.prototype.clearVersion = function() {
  return this.setVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.TaskScheduledEvent.prototype.hasVersion = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional google.protobuf.StringValue input = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.TaskScheduledEvent.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.TaskScheduledEvent} returns this
*/
proto.TaskScheduledEvent.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.TaskScheduledEvent} returns this
 */
proto.TaskScheduledEvent.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.TaskScheduledEvent.prototype.hasInput = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.TaskCompletedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.TaskCompletedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TaskCompletedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskCompletedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    taskscheduledid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    result: (f = msg.getResult()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.TaskCompletedEvent}
 */
proto.TaskCompletedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TaskCompletedEvent;
  return proto.TaskCompletedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TaskCompletedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TaskCompletedEvent}
 */
proto.TaskCompletedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTaskscheduledid(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setResult(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.TaskCompletedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TaskCompletedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TaskCompletedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskCompletedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTaskscheduledid();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getResult();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 taskScheduledId = 1;
 * @return {number}
 */
proto.TaskCompletedEvent.prototype.getTaskscheduledid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.TaskCompletedEvent} returns this
 */
proto.TaskCompletedEvent.prototype.setTaskscheduledid = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue result = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.TaskCompletedEvent.prototype.getResult = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.TaskCompletedEvent} returns this
*/
proto.TaskCompletedEvent.prototype.setResult = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.TaskCompletedEvent} returns this
 */
proto.TaskCompletedEvent.prototype.clearResult = function() {
  return this.setResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.TaskCompletedEvent.prototype.hasResult = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.TaskFailedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.TaskFailedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TaskFailedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskFailedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    taskscheduledid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    failuredetails: (f = msg.getFailuredetails()) && proto.TaskFailureDetails.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.TaskFailedEvent}
 */
proto.TaskFailedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TaskFailedEvent;
  return proto.TaskFailedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TaskFailedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TaskFailedEvent}
 */
proto.TaskFailedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTaskscheduledid(value);
      break;
    case 2:
      var value = new proto.TaskFailureDetails;
      reader.readMessage(value,proto.TaskFailureDetails.deserializeBinaryFromReader);
      msg.setFailuredetails(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.TaskFailedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TaskFailedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TaskFailedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TaskFailedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTaskscheduledid();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getFailuredetails();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.TaskFailureDetails.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 taskScheduledId = 1;
 * @return {number}
 */
proto.TaskFailedEvent.prototype.getTaskscheduledid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.TaskFailedEvent} returns this
 */
proto.TaskFailedEvent.prototype.setTaskscheduledid = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional TaskFailureDetails failureDetails = 2;
 * @return {?proto.TaskFailureDetails}
 */
proto.TaskFailedEvent.prototype.getFailuredetails = function() {
  return /** @type{?proto.TaskFailureDetails} */ (
    jspb.Message.getWrapperField(this, proto.TaskFailureDetails, 2));
};


/**
 * @param {?proto.TaskFailureDetails|undefined} value
 * @return {!proto.TaskFailedEvent} returns this
*/
proto.TaskFailedEvent.prototype.setFailuredetails = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.TaskFailedEvent} returns this
 */
proto.TaskFailedEvent.prototype.clearFailuredetails = function() {
  return this.setFailuredetails(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.TaskFailedEvent.prototype.hasFailuredetails = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.SubOrchestrationInstanceCreatedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.SubOrchestrationInstanceCreatedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SubOrchestrationInstanceCreatedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    version: (f = msg.getVersion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.SubOrchestrationInstanceCreatedEvent}
 */
proto.SubOrchestrationInstanceCreatedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.SubOrchestrationInstanceCreatedEvent;
  return proto.SubOrchestrationInstanceCreatedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.SubOrchestrationInstanceCreatedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.SubOrchestrationInstanceCreatedEvent}
 */
proto.SubOrchestrationInstanceCreatedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setVersion(value);
      break;
    case 4:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.SubOrchestrationInstanceCreatedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.SubOrchestrationInstanceCreatedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SubOrchestrationInstanceCreatedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getVersion();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.SubOrchestrationInstanceCreatedEvent} returns this
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.SubOrchestrationInstanceCreatedEvent} returns this
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.StringValue version = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.getVersion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.SubOrchestrationInstanceCreatedEvent} returns this
*/
proto.SubOrchestrationInstanceCreatedEvent.prototype.setVersion = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.SubOrchestrationInstanceCreatedEvent} returns this
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.clearVersion = function() {
  return this.setVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.hasVersion = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional google.protobuf.StringValue input = 4;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 4));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.SubOrchestrationInstanceCreatedEvent} returns this
*/
proto.SubOrchestrationInstanceCreatedEvent.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.SubOrchestrationInstanceCreatedEvent} returns this
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.SubOrchestrationInstanceCreatedEvent.prototype.hasInput = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.SubOrchestrationInstanceCompletedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.SubOrchestrationInstanceCompletedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.SubOrchestrationInstanceCompletedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SubOrchestrationInstanceCompletedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    taskscheduledid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    result: (f = msg.getResult()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.SubOrchestrationInstanceCompletedEvent}
 */
proto.SubOrchestrationInstanceCompletedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.SubOrchestrationInstanceCompletedEvent;
  return proto.SubOrchestrationInstanceCompletedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.SubOrchestrationInstanceCompletedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.SubOrchestrationInstanceCompletedEvent}
 */
proto.SubOrchestrationInstanceCompletedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTaskscheduledid(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setResult(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.SubOrchestrationInstanceCompletedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.SubOrchestrationInstanceCompletedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.SubOrchestrationInstanceCompletedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SubOrchestrationInstanceCompletedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTaskscheduledid();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getResult();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 taskScheduledId = 1;
 * @return {number}
 */
proto.SubOrchestrationInstanceCompletedEvent.prototype.getTaskscheduledid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.SubOrchestrationInstanceCompletedEvent} returns this
 */
proto.SubOrchestrationInstanceCompletedEvent.prototype.setTaskscheduledid = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue result = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.SubOrchestrationInstanceCompletedEvent.prototype.getResult = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.SubOrchestrationInstanceCompletedEvent} returns this
*/
proto.SubOrchestrationInstanceCompletedEvent.prototype.setResult = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.SubOrchestrationInstanceCompletedEvent} returns this
 */
proto.SubOrchestrationInstanceCompletedEvent.prototype.clearResult = function() {
  return this.setResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.SubOrchestrationInstanceCompletedEvent.prototype.hasResult = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.SubOrchestrationInstanceFailedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.SubOrchestrationInstanceFailedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.SubOrchestrationInstanceFailedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SubOrchestrationInstanceFailedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    taskscheduledid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    failuredetails: (f = msg.getFailuredetails()) && proto.TaskFailureDetails.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.SubOrchestrationInstanceFailedEvent}
 */
proto.SubOrchestrationInstanceFailedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.SubOrchestrationInstanceFailedEvent;
  return proto.SubOrchestrationInstanceFailedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.SubOrchestrationInstanceFailedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.SubOrchestrationInstanceFailedEvent}
 */
proto.SubOrchestrationInstanceFailedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTaskscheduledid(value);
      break;
    case 2:
      var value = new proto.TaskFailureDetails;
      reader.readMessage(value,proto.TaskFailureDetails.deserializeBinaryFromReader);
      msg.setFailuredetails(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.SubOrchestrationInstanceFailedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.SubOrchestrationInstanceFailedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.SubOrchestrationInstanceFailedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SubOrchestrationInstanceFailedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTaskscheduledid();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getFailuredetails();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.TaskFailureDetails.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 taskScheduledId = 1;
 * @return {number}
 */
proto.SubOrchestrationInstanceFailedEvent.prototype.getTaskscheduledid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.SubOrchestrationInstanceFailedEvent} returns this
 */
proto.SubOrchestrationInstanceFailedEvent.prototype.setTaskscheduledid = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional TaskFailureDetails failureDetails = 2;
 * @return {?proto.TaskFailureDetails}
 */
proto.SubOrchestrationInstanceFailedEvent.prototype.getFailuredetails = function() {
  return /** @type{?proto.TaskFailureDetails} */ (
    jspb.Message.getWrapperField(this, proto.TaskFailureDetails, 2));
};


/**
 * @param {?proto.TaskFailureDetails|undefined} value
 * @return {!proto.SubOrchestrationInstanceFailedEvent} returns this
*/
proto.SubOrchestrationInstanceFailedEvent.prototype.setFailuredetails = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.SubOrchestrationInstanceFailedEvent} returns this
 */
proto.SubOrchestrationInstanceFailedEvent.prototype.clearFailuredetails = function() {
  return this.setFailuredetails(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.SubOrchestrationInstanceFailedEvent.prototype.hasFailuredetails = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.TimerCreatedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.TimerCreatedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TimerCreatedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TimerCreatedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    fireat: (f = msg.getFireat()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.TimerCreatedEvent}
 */
proto.TimerCreatedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TimerCreatedEvent;
  return proto.TimerCreatedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TimerCreatedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TimerCreatedEvent}
 */
proto.TimerCreatedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setFireat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.TimerCreatedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TimerCreatedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TimerCreatedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TimerCreatedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFireat();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional google.protobuf.Timestamp fireAt = 1;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.TimerCreatedEvent.prototype.getFireat = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 1));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.TimerCreatedEvent} returns this
*/
proto.TimerCreatedEvent.prototype.setFireat = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.TimerCreatedEvent} returns this
 */
proto.TimerCreatedEvent.prototype.clearFireat = function() {
  return this.setFireat(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.TimerCreatedEvent.prototype.hasFireat = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.TimerFiredEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.TimerFiredEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TimerFiredEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TimerFiredEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    fireat: (f = msg.getFireat()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    timerid: jspb.Message.getFieldWithDefault(msg, 2, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.TimerFiredEvent}
 */
proto.TimerFiredEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TimerFiredEvent;
  return proto.TimerFiredEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TimerFiredEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TimerFiredEvent}
 */
proto.TimerFiredEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setFireat(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setTimerid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.TimerFiredEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TimerFiredEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TimerFiredEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TimerFiredEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFireat();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getTimerid();
  if (f !== 0) {
    writer.writeInt32(
      2,
      f
    );
  }
};


/**
 * optional google.protobuf.Timestamp fireAt = 1;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.TimerFiredEvent.prototype.getFireat = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 1));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.TimerFiredEvent} returns this
*/
proto.TimerFiredEvent.prototype.setFireat = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.TimerFiredEvent} returns this
 */
proto.TimerFiredEvent.prototype.clearFireat = function() {
  return this.setFireat(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.TimerFiredEvent.prototype.hasFireat = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional int32 timerId = 2;
 * @return {number}
 */
proto.TimerFiredEvent.prototype.getTimerid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 2, 0));
};


/**
 * @param {number} value
 * @return {!proto.TimerFiredEvent} returns this
 */
proto.TimerFiredEvent.prototype.setTimerid = function(value) {
  return jspb.Message.setProto3IntField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.OrchestratorStartedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.OrchestratorStartedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.OrchestratorStartedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorStartedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.OrchestratorStartedEvent}
 */
proto.OrchestratorStartedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.OrchestratorStartedEvent;
  return proto.OrchestratorStartedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.OrchestratorStartedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.OrchestratorStartedEvent}
 */
proto.OrchestratorStartedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.OrchestratorStartedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.OrchestratorStartedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.OrchestratorStartedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorStartedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.OrchestratorCompletedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.OrchestratorCompletedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.OrchestratorCompletedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorCompletedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.OrchestratorCompletedEvent}
 */
proto.OrchestratorCompletedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.OrchestratorCompletedEvent;
  return proto.OrchestratorCompletedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.OrchestratorCompletedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.OrchestratorCompletedEvent}
 */
proto.OrchestratorCompletedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.OrchestratorCompletedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.OrchestratorCompletedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.OrchestratorCompletedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorCompletedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.EventSentEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.EventSentEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.EventSentEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.EventSentEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.EventSentEvent}
 */
proto.EventSentEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.EventSentEvent;
  return proto.EventSentEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.EventSentEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.EventSentEvent}
 */
proto.EventSentEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.EventSentEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.EventSentEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.EventSentEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.EventSentEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.EventSentEvent.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.EventSentEvent} returns this
 */
proto.EventSentEvent.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.EventSentEvent.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.EventSentEvent} returns this
 */
proto.EventSentEvent.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.StringValue input = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.EventSentEvent.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.EventSentEvent} returns this
*/
proto.EventSentEvent.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.EventSentEvent} returns this
 */
proto.EventSentEvent.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.EventSentEvent.prototype.hasInput = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.EventRaisedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.EventRaisedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.EventRaisedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.EventRaisedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.EventRaisedEvent}
 */
proto.EventRaisedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.EventRaisedEvent;
  return proto.EventRaisedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.EventRaisedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.EventRaisedEvent}
 */
proto.EventRaisedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.EventRaisedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.EventRaisedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.EventRaisedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.EventRaisedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.EventRaisedEvent.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.EventRaisedEvent} returns this
 */
proto.EventRaisedEvent.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue input = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.EventRaisedEvent.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.EventRaisedEvent} returns this
*/
proto.EventRaisedEvent.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.EventRaisedEvent} returns this
 */
proto.EventRaisedEvent.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.EventRaisedEvent.prototype.hasInput = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.GenericEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.GenericEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.GenericEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GenericEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    data: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.GenericEvent}
 */
proto.GenericEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.GenericEvent;
  return proto.GenericEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.GenericEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.GenericEvent}
 */
proto.GenericEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.GenericEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.GenericEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.GenericEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GenericEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getData();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string data = 1;
 * @return {string}
 */
proto.GenericEvent.prototype.getData = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.GenericEvent} returns this
 */
proto.GenericEvent.prototype.setData = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.HistoryStateEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.HistoryStateEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.HistoryStateEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.HistoryStateEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    orchestrationstate: (f = msg.getOrchestrationstate()) && proto.OrchestrationState.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.HistoryStateEvent}
 */
proto.HistoryStateEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.HistoryStateEvent;
  return proto.HistoryStateEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.HistoryStateEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.HistoryStateEvent}
 */
proto.HistoryStateEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.OrchestrationState;
      reader.readMessage(value,proto.OrchestrationState.deserializeBinaryFromReader);
      msg.setOrchestrationstate(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.HistoryStateEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.HistoryStateEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.HistoryStateEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.HistoryStateEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrchestrationstate();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.OrchestrationState.serializeBinaryToWriter
    );
  }
};


/**
 * optional OrchestrationState orchestrationState = 1;
 * @return {?proto.OrchestrationState}
 */
proto.HistoryStateEvent.prototype.getOrchestrationstate = function() {
  return /** @type{?proto.OrchestrationState} */ (
    jspb.Message.getWrapperField(this, proto.OrchestrationState, 1));
};


/**
 * @param {?proto.OrchestrationState|undefined} value
 * @return {!proto.HistoryStateEvent} returns this
*/
proto.HistoryStateEvent.prototype.setOrchestrationstate = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryStateEvent} returns this
 */
proto.HistoryStateEvent.prototype.clearOrchestrationstate = function() {
  return this.setOrchestrationstate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryStateEvent.prototype.hasOrchestrationstate = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ContinueAsNewEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.ContinueAsNewEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ContinueAsNewEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ContinueAsNewEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ContinueAsNewEvent}
 */
proto.ContinueAsNewEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ContinueAsNewEvent;
  return proto.ContinueAsNewEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ContinueAsNewEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ContinueAsNewEvent}
 */
proto.ContinueAsNewEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ContinueAsNewEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ContinueAsNewEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ContinueAsNewEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ContinueAsNewEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional google.protobuf.StringValue input = 1;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ContinueAsNewEvent.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 1));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ContinueAsNewEvent} returns this
*/
proto.ContinueAsNewEvent.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ContinueAsNewEvent} returns this
 */
proto.ContinueAsNewEvent.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ContinueAsNewEvent.prototype.hasInput = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ExecutionSuspendedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.ExecutionSuspendedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ExecutionSuspendedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionSuspendedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ExecutionSuspendedEvent}
 */
proto.ExecutionSuspendedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ExecutionSuspendedEvent;
  return proto.ExecutionSuspendedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ExecutionSuspendedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ExecutionSuspendedEvent}
 */
proto.ExecutionSuspendedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ExecutionSuspendedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ExecutionSuspendedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ExecutionSuspendedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionSuspendedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional google.protobuf.StringValue input = 1;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ExecutionSuspendedEvent.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 1));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ExecutionSuspendedEvent} returns this
*/
proto.ExecutionSuspendedEvent.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionSuspendedEvent} returns this
 */
proto.ExecutionSuspendedEvent.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionSuspendedEvent.prototype.hasInput = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ExecutionResumedEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.ExecutionResumedEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ExecutionResumedEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionResumedEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ExecutionResumedEvent}
 */
proto.ExecutionResumedEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ExecutionResumedEvent;
  return proto.ExecutionResumedEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ExecutionResumedEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ExecutionResumedEvent}
 */
proto.ExecutionResumedEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ExecutionResumedEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ExecutionResumedEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ExecutionResumedEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ExecutionResumedEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional google.protobuf.StringValue input = 1;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ExecutionResumedEvent.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 1));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ExecutionResumedEvent} returns this
*/
proto.ExecutionResumedEvent.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ExecutionResumedEvent} returns this
 */
proto.ExecutionResumedEvent.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ExecutionResumedEvent.prototype.hasInput = function() {
  return jspb.Message.getField(this, 1) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.HistoryEvent.oneofGroups_ = [[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22]];

/**
 * @enum {number}
 */
proto.HistoryEvent.EventtypeCase = {
  EVENTTYPE_NOT_SET: 0,
  EXECUTIONSTARTED: 3,
  EXECUTIONCOMPLETED: 4,
  EXECUTIONTERMINATED: 5,
  TASKSCHEDULED: 6,
  TASKCOMPLETED: 7,
  TASKFAILED: 8,
  SUBORCHESTRATIONINSTANCECREATED: 9,
  SUBORCHESTRATIONINSTANCECOMPLETED: 10,
  SUBORCHESTRATIONINSTANCEFAILED: 11,
  TIMERCREATED: 12,
  TIMERFIRED: 13,
  ORCHESTRATORSTARTED: 14,
  ORCHESTRATORCOMPLETED: 15,
  EVENTSENT: 16,
  EVENTRAISED: 17,
  GENERICEVENT: 18,
  HISTORYSTATE: 19,
  CONTINUEASNEW: 20,
  EXECUTIONSUSPENDED: 21,
  EXECUTIONRESUMED: 22
};

/**
 * @return {proto.HistoryEvent.EventtypeCase}
 */
proto.HistoryEvent.prototype.getEventtypeCase = function() {
  return /** @type {proto.HistoryEvent.EventtypeCase} */(jspb.Message.computeOneofCase(this, proto.HistoryEvent.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.HistoryEvent.prototype.toObject = function(opt_includeInstance) {
  return proto.HistoryEvent.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.HistoryEvent} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.HistoryEvent.toObject = function(includeInstance, msg) {
  var f, obj = {
    eventid: jspb.Message.getFieldWithDefault(msg, 1, 0),
    timestamp: (f = msg.getTimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    executionstarted: (f = msg.getExecutionstarted()) && proto.ExecutionStartedEvent.toObject(includeInstance, f),
    executioncompleted: (f = msg.getExecutioncompleted()) && proto.ExecutionCompletedEvent.toObject(includeInstance, f),
    executionterminated: (f = msg.getExecutionterminated()) && proto.ExecutionTerminatedEvent.toObject(includeInstance, f),
    taskscheduled: (f = msg.getTaskscheduled()) && proto.TaskScheduledEvent.toObject(includeInstance, f),
    taskcompleted: (f = msg.getTaskcompleted()) && proto.TaskCompletedEvent.toObject(includeInstance, f),
    taskfailed: (f = msg.getTaskfailed()) && proto.TaskFailedEvent.toObject(includeInstance, f),
    suborchestrationinstancecreated: (f = msg.getSuborchestrationinstancecreated()) && proto.SubOrchestrationInstanceCreatedEvent.toObject(includeInstance, f),
    suborchestrationinstancecompleted: (f = msg.getSuborchestrationinstancecompleted()) && proto.SubOrchestrationInstanceCompletedEvent.toObject(includeInstance, f),
    suborchestrationinstancefailed: (f = msg.getSuborchestrationinstancefailed()) && proto.SubOrchestrationInstanceFailedEvent.toObject(includeInstance, f),
    timercreated: (f = msg.getTimercreated()) && proto.TimerCreatedEvent.toObject(includeInstance, f),
    timerfired: (f = msg.getTimerfired()) && proto.TimerFiredEvent.toObject(includeInstance, f),
    orchestratorstarted: (f = msg.getOrchestratorstarted()) && proto.OrchestratorStartedEvent.toObject(includeInstance, f),
    orchestratorcompleted: (f = msg.getOrchestratorcompleted()) && proto.OrchestratorCompletedEvent.toObject(includeInstance, f),
    eventsent: (f = msg.getEventsent()) && proto.EventSentEvent.toObject(includeInstance, f),
    eventraised: (f = msg.getEventraised()) && proto.EventRaisedEvent.toObject(includeInstance, f),
    genericevent: (f = msg.getGenericevent()) && proto.GenericEvent.toObject(includeInstance, f),
    historystate: (f = msg.getHistorystate()) && proto.HistoryStateEvent.toObject(includeInstance, f),
    continueasnew: (f = msg.getContinueasnew()) && proto.ContinueAsNewEvent.toObject(includeInstance, f),
    executionsuspended: (f = msg.getExecutionsuspended()) && proto.ExecutionSuspendedEvent.toObject(includeInstance, f),
    executionresumed: (f = msg.getExecutionresumed()) && proto.ExecutionResumedEvent.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.HistoryEvent}
 */
proto.HistoryEvent.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.HistoryEvent;
  return proto.HistoryEvent.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.HistoryEvent} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.HistoryEvent}
 */
proto.HistoryEvent.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setEventid(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setTimestamp(value);
      break;
    case 3:
      var value = new proto.ExecutionStartedEvent;
      reader.readMessage(value,proto.ExecutionStartedEvent.deserializeBinaryFromReader);
      msg.setExecutionstarted(value);
      break;
    case 4:
      var value = new proto.ExecutionCompletedEvent;
      reader.readMessage(value,proto.ExecutionCompletedEvent.deserializeBinaryFromReader);
      msg.setExecutioncompleted(value);
      break;
    case 5:
      var value = new proto.ExecutionTerminatedEvent;
      reader.readMessage(value,proto.ExecutionTerminatedEvent.deserializeBinaryFromReader);
      msg.setExecutionterminated(value);
      break;
    case 6:
      var value = new proto.TaskScheduledEvent;
      reader.readMessage(value,proto.TaskScheduledEvent.deserializeBinaryFromReader);
      msg.setTaskscheduled(value);
      break;
    case 7:
      var value = new proto.TaskCompletedEvent;
      reader.readMessage(value,proto.TaskCompletedEvent.deserializeBinaryFromReader);
      msg.setTaskcompleted(value);
      break;
    case 8:
      var value = new proto.TaskFailedEvent;
      reader.readMessage(value,proto.TaskFailedEvent.deserializeBinaryFromReader);
      msg.setTaskfailed(value);
      break;
    case 9:
      var value = new proto.SubOrchestrationInstanceCreatedEvent;
      reader.readMessage(value,proto.SubOrchestrationInstanceCreatedEvent.deserializeBinaryFromReader);
      msg.setSuborchestrationinstancecreated(value);
      break;
    case 10:
      var value = new proto.SubOrchestrationInstanceCompletedEvent;
      reader.readMessage(value,proto.SubOrchestrationInstanceCompletedEvent.deserializeBinaryFromReader);
      msg.setSuborchestrationinstancecompleted(value);
      break;
    case 11:
      var value = new proto.SubOrchestrationInstanceFailedEvent;
      reader.readMessage(value,proto.SubOrchestrationInstanceFailedEvent.deserializeBinaryFromReader);
      msg.setSuborchestrationinstancefailed(value);
      break;
    case 12:
      var value = new proto.TimerCreatedEvent;
      reader.readMessage(value,proto.TimerCreatedEvent.deserializeBinaryFromReader);
      msg.setTimercreated(value);
      break;
    case 13:
      var value = new proto.TimerFiredEvent;
      reader.readMessage(value,proto.TimerFiredEvent.deserializeBinaryFromReader);
      msg.setTimerfired(value);
      break;
    case 14:
      var value = new proto.OrchestratorStartedEvent;
      reader.readMessage(value,proto.OrchestratorStartedEvent.deserializeBinaryFromReader);
      msg.setOrchestratorstarted(value);
      break;
    case 15:
      var value = new proto.OrchestratorCompletedEvent;
      reader.readMessage(value,proto.OrchestratorCompletedEvent.deserializeBinaryFromReader);
      msg.setOrchestratorcompleted(value);
      break;
    case 16:
      var value = new proto.EventSentEvent;
      reader.readMessage(value,proto.EventSentEvent.deserializeBinaryFromReader);
      msg.setEventsent(value);
      break;
    case 17:
      var value = new proto.EventRaisedEvent;
      reader.readMessage(value,proto.EventRaisedEvent.deserializeBinaryFromReader);
      msg.setEventraised(value);
      break;
    case 18:
      var value = new proto.GenericEvent;
      reader.readMessage(value,proto.GenericEvent.deserializeBinaryFromReader);
      msg.setGenericevent(value);
      break;
    case 19:
      var value = new proto.HistoryStateEvent;
      reader.readMessage(value,proto.HistoryStateEvent.deserializeBinaryFromReader);
      msg.setHistorystate(value);
      break;
    case 20:
      var value = new proto.ContinueAsNewEvent;
      reader.readMessage(value,proto.ContinueAsNewEvent.deserializeBinaryFromReader);
      msg.setContinueasnew(value);
      break;
    case 21:
      var value = new proto.ExecutionSuspendedEvent;
      reader.readMessage(value,proto.ExecutionSuspendedEvent.deserializeBinaryFromReader);
      msg.setExecutionsuspended(value);
      break;
    case 22:
      var value = new proto.ExecutionResumedEvent;
      reader.readMessage(value,proto.ExecutionResumedEvent.deserializeBinaryFromReader);
      msg.setExecutionresumed(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.HistoryEvent.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.HistoryEvent.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.HistoryEvent} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.HistoryEvent.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getEventid();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getTimestamp();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getExecutionstarted();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.ExecutionStartedEvent.serializeBinaryToWriter
    );
  }
  f = message.getExecutioncompleted();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.ExecutionCompletedEvent.serializeBinaryToWriter
    );
  }
  f = message.getExecutionterminated();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.ExecutionTerminatedEvent.serializeBinaryToWriter
    );
  }
  f = message.getTaskscheduled();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.TaskScheduledEvent.serializeBinaryToWriter
    );
  }
  f = message.getTaskcompleted();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      proto.TaskCompletedEvent.serializeBinaryToWriter
    );
  }
  f = message.getTaskfailed();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      proto.TaskFailedEvent.serializeBinaryToWriter
    );
  }
  f = message.getSuborchestrationinstancecreated();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      proto.SubOrchestrationInstanceCreatedEvent.serializeBinaryToWriter
    );
  }
  f = message.getSuborchestrationinstancecompleted();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      proto.SubOrchestrationInstanceCompletedEvent.serializeBinaryToWriter
    );
  }
  f = message.getSuborchestrationinstancefailed();
  if (f != null) {
    writer.writeMessage(
      11,
      f,
      proto.SubOrchestrationInstanceFailedEvent.serializeBinaryToWriter
    );
  }
  f = message.getTimercreated();
  if (f != null) {
    writer.writeMessage(
      12,
      f,
      proto.TimerCreatedEvent.serializeBinaryToWriter
    );
  }
  f = message.getTimerfired();
  if (f != null) {
    writer.writeMessage(
      13,
      f,
      proto.TimerFiredEvent.serializeBinaryToWriter
    );
  }
  f = message.getOrchestratorstarted();
  if (f != null) {
    writer.writeMessage(
      14,
      f,
      proto.OrchestratorStartedEvent.serializeBinaryToWriter
    );
  }
  f = message.getOrchestratorcompleted();
  if (f != null) {
    writer.writeMessage(
      15,
      f,
      proto.OrchestratorCompletedEvent.serializeBinaryToWriter
    );
  }
  f = message.getEventsent();
  if (f != null) {
    writer.writeMessage(
      16,
      f,
      proto.EventSentEvent.serializeBinaryToWriter
    );
  }
  f = message.getEventraised();
  if (f != null) {
    writer.writeMessage(
      17,
      f,
      proto.EventRaisedEvent.serializeBinaryToWriter
    );
  }
  f = message.getGenericevent();
  if (f != null) {
    writer.writeMessage(
      18,
      f,
      proto.GenericEvent.serializeBinaryToWriter
    );
  }
  f = message.getHistorystate();
  if (f != null) {
    writer.writeMessage(
      19,
      f,
      proto.HistoryStateEvent.serializeBinaryToWriter
    );
  }
  f = message.getContinueasnew();
  if (f != null) {
    writer.writeMessage(
      20,
      f,
      proto.ContinueAsNewEvent.serializeBinaryToWriter
    );
  }
  f = message.getExecutionsuspended();
  if (f != null) {
    writer.writeMessage(
      21,
      f,
      proto.ExecutionSuspendedEvent.serializeBinaryToWriter
    );
  }
  f = message.getExecutionresumed();
  if (f != null) {
    writer.writeMessage(
      22,
      f,
      proto.ExecutionResumedEvent.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 eventId = 1;
 * @return {number}
 */
proto.HistoryEvent.prototype.getEventid = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.setEventid = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional google.protobuf.Timestamp timestamp = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.HistoryEvent.prototype.getTimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setTimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearTimestamp = function() {
  return this.setTimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasTimestamp = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional ExecutionStartedEvent executionStarted = 3;
 * @return {?proto.ExecutionStartedEvent}
 */
proto.HistoryEvent.prototype.getExecutionstarted = function() {
  return /** @type{?proto.ExecutionStartedEvent} */ (
    jspb.Message.getWrapperField(this, proto.ExecutionStartedEvent, 3));
};


/**
 * @param {?proto.ExecutionStartedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setExecutionstarted = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearExecutionstarted = function() {
  return this.setExecutionstarted(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasExecutionstarted = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional ExecutionCompletedEvent executionCompleted = 4;
 * @return {?proto.ExecutionCompletedEvent}
 */
proto.HistoryEvent.prototype.getExecutioncompleted = function() {
  return /** @type{?proto.ExecutionCompletedEvent} */ (
    jspb.Message.getWrapperField(this, proto.ExecutionCompletedEvent, 4));
};


/**
 * @param {?proto.ExecutionCompletedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setExecutioncompleted = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearExecutioncompleted = function() {
  return this.setExecutioncompleted(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasExecutioncompleted = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional ExecutionTerminatedEvent executionTerminated = 5;
 * @return {?proto.ExecutionTerminatedEvent}
 */
proto.HistoryEvent.prototype.getExecutionterminated = function() {
  return /** @type{?proto.ExecutionTerminatedEvent} */ (
    jspb.Message.getWrapperField(this, proto.ExecutionTerminatedEvent, 5));
};


/**
 * @param {?proto.ExecutionTerminatedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setExecutionterminated = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearExecutionterminated = function() {
  return this.setExecutionterminated(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasExecutionterminated = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional TaskScheduledEvent taskScheduled = 6;
 * @return {?proto.TaskScheduledEvent}
 */
proto.HistoryEvent.prototype.getTaskscheduled = function() {
  return /** @type{?proto.TaskScheduledEvent} */ (
    jspb.Message.getWrapperField(this, proto.TaskScheduledEvent, 6));
};


/**
 * @param {?proto.TaskScheduledEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setTaskscheduled = function(value) {
  return jspb.Message.setOneofWrapperField(this, 6, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearTaskscheduled = function() {
  return this.setTaskscheduled(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasTaskscheduled = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional TaskCompletedEvent taskCompleted = 7;
 * @return {?proto.TaskCompletedEvent}
 */
proto.HistoryEvent.prototype.getTaskcompleted = function() {
  return /** @type{?proto.TaskCompletedEvent} */ (
    jspb.Message.getWrapperField(this, proto.TaskCompletedEvent, 7));
};


/**
 * @param {?proto.TaskCompletedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setTaskcompleted = function(value) {
  return jspb.Message.setOneofWrapperField(this, 7, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearTaskcompleted = function() {
  return this.setTaskcompleted(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasTaskcompleted = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional TaskFailedEvent taskFailed = 8;
 * @return {?proto.TaskFailedEvent}
 */
proto.HistoryEvent.prototype.getTaskfailed = function() {
  return /** @type{?proto.TaskFailedEvent} */ (
    jspb.Message.getWrapperField(this, proto.TaskFailedEvent, 8));
};


/**
 * @param {?proto.TaskFailedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setTaskfailed = function(value) {
  return jspb.Message.setOneofWrapperField(this, 8, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearTaskfailed = function() {
  return this.setTaskfailed(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasTaskfailed = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional SubOrchestrationInstanceCreatedEvent subOrchestrationInstanceCreated = 9;
 * @return {?proto.SubOrchestrationInstanceCreatedEvent}
 */
proto.HistoryEvent.prototype.getSuborchestrationinstancecreated = function() {
  return /** @type{?proto.SubOrchestrationInstanceCreatedEvent} */ (
    jspb.Message.getWrapperField(this, proto.SubOrchestrationInstanceCreatedEvent, 9));
};


/**
 * @param {?proto.SubOrchestrationInstanceCreatedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setSuborchestrationinstancecreated = function(value) {
  return jspb.Message.setOneofWrapperField(this, 9, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearSuborchestrationinstancecreated = function() {
  return this.setSuborchestrationinstancecreated(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasSuborchestrationinstancecreated = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional SubOrchestrationInstanceCompletedEvent subOrchestrationInstanceCompleted = 10;
 * @return {?proto.SubOrchestrationInstanceCompletedEvent}
 */
proto.HistoryEvent.prototype.getSuborchestrationinstancecompleted = function() {
  return /** @type{?proto.SubOrchestrationInstanceCompletedEvent} */ (
    jspb.Message.getWrapperField(this, proto.SubOrchestrationInstanceCompletedEvent, 10));
};


/**
 * @param {?proto.SubOrchestrationInstanceCompletedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setSuborchestrationinstancecompleted = function(value) {
  return jspb.Message.setOneofWrapperField(this, 10, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearSuborchestrationinstancecompleted = function() {
  return this.setSuborchestrationinstancecompleted(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasSuborchestrationinstancecompleted = function() {
  return jspb.Message.getField(this, 10) != null;
};


/**
 * optional SubOrchestrationInstanceFailedEvent subOrchestrationInstanceFailed = 11;
 * @return {?proto.SubOrchestrationInstanceFailedEvent}
 */
proto.HistoryEvent.prototype.getSuborchestrationinstancefailed = function() {
  return /** @type{?proto.SubOrchestrationInstanceFailedEvent} */ (
    jspb.Message.getWrapperField(this, proto.SubOrchestrationInstanceFailedEvent, 11));
};


/**
 * @param {?proto.SubOrchestrationInstanceFailedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setSuborchestrationinstancefailed = function(value) {
  return jspb.Message.setOneofWrapperField(this, 11, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearSuborchestrationinstancefailed = function() {
  return this.setSuborchestrationinstancefailed(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasSuborchestrationinstancefailed = function() {
  return jspb.Message.getField(this, 11) != null;
};


/**
 * optional TimerCreatedEvent timerCreated = 12;
 * @return {?proto.TimerCreatedEvent}
 */
proto.HistoryEvent.prototype.getTimercreated = function() {
  return /** @type{?proto.TimerCreatedEvent} */ (
    jspb.Message.getWrapperField(this, proto.TimerCreatedEvent, 12));
};


/**
 * @param {?proto.TimerCreatedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setTimercreated = function(value) {
  return jspb.Message.setOneofWrapperField(this, 12, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearTimercreated = function() {
  return this.setTimercreated(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasTimercreated = function() {
  return jspb.Message.getField(this, 12) != null;
};


/**
 * optional TimerFiredEvent timerFired = 13;
 * @return {?proto.TimerFiredEvent}
 */
proto.HistoryEvent.prototype.getTimerfired = function() {
  return /** @type{?proto.TimerFiredEvent} */ (
    jspb.Message.getWrapperField(this, proto.TimerFiredEvent, 13));
};


/**
 * @param {?proto.TimerFiredEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setTimerfired = function(value) {
  return jspb.Message.setOneofWrapperField(this, 13, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearTimerfired = function() {
  return this.setTimerfired(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasTimerfired = function() {
  return jspb.Message.getField(this, 13) != null;
};


/**
 * optional OrchestratorStartedEvent orchestratorStarted = 14;
 * @return {?proto.OrchestratorStartedEvent}
 */
proto.HistoryEvent.prototype.getOrchestratorstarted = function() {
  return /** @type{?proto.OrchestratorStartedEvent} */ (
    jspb.Message.getWrapperField(this, proto.OrchestratorStartedEvent, 14));
};


/**
 * @param {?proto.OrchestratorStartedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setOrchestratorstarted = function(value) {
  return jspb.Message.setOneofWrapperField(this, 14, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearOrchestratorstarted = function() {
  return this.setOrchestratorstarted(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasOrchestratorstarted = function() {
  return jspb.Message.getField(this, 14) != null;
};


/**
 * optional OrchestratorCompletedEvent orchestratorCompleted = 15;
 * @return {?proto.OrchestratorCompletedEvent}
 */
proto.HistoryEvent.prototype.getOrchestratorcompleted = function() {
  return /** @type{?proto.OrchestratorCompletedEvent} */ (
    jspb.Message.getWrapperField(this, proto.OrchestratorCompletedEvent, 15));
};


/**
 * @param {?proto.OrchestratorCompletedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setOrchestratorcompleted = function(value) {
  return jspb.Message.setOneofWrapperField(this, 15, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearOrchestratorcompleted = function() {
  return this.setOrchestratorcompleted(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasOrchestratorcompleted = function() {
  return jspb.Message.getField(this, 15) != null;
};


/**
 * optional EventSentEvent eventSent = 16;
 * @return {?proto.EventSentEvent}
 */
proto.HistoryEvent.prototype.getEventsent = function() {
  return /** @type{?proto.EventSentEvent} */ (
    jspb.Message.getWrapperField(this, proto.EventSentEvent, 16));
};


/**
 * @param {?proto.EventSentEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setEventsent = function(value) {
  return jspb.Message.setOneofWrapperField(this, 16, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearEventsent = function() {
  return this.setEventsent(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasEventsent = function() {
  return jspb.Message.getField(this, 16) != null;
};


/**
 * optional EventRaisedEvent eventRaised = 17;
 * @return {?proto.EventRaisedEvent}
 */
proto.HistoryEvent.prototype.getEventraised = function() {
  return /** @type{?proto.EventRaisedEvent} */ (
    jspb.Message.getWrapperField(this, proto.EventRaisedEvent, 17));
};


/**
 * @param {?proto.EventRaisedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setEventraised = function(value) {
  return jspb.Message.setOneofWrapperField(this, 17, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearEventraised = function() {
  return this.setEventraised(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasEventraised = function() {
  return jspb.Message.getField(this, 17) != null;
};


/**
 * optional GenericEvent genericEvent = 18;
 * @return {?proto.GenericEvent}
 */
proto.HistoryEvent.prototype.getGenericevent = function() {
  return /** @type{?proto.GenericEvent} */ (
    jspb.Message.getWrapperField(this, proto.GenericEvent, 18));
};


/**
 * @param {?proto.GenericEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setGenericevent = function(value) {
  return jspb.Message.setOneofWrapperField(this, 18, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearGenericevent = function() {
  return this.setGenericevent(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasGenericevent = function() {
  return jspb.Message.getField(this, 18) != null;
};


/**
 * optional HistoryStateEvent historyState = 19;
 * @return {?proto.HistoryStateEvent}
 */
proto.HistoryEvent.prototype.getHistorystate = function() {
  return /** @type{?proto.HistoryStateEvent} */ (
    jspb.Message.getWrapperField(this, proto.HistoryStateEvent, 19));
};


/**
 * @param {?proto.HistoryStateEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setHistorystate = function(value) {
  return jspb.Message.setOneofWrapperField(this, 19, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearHistorystate = function() {
  return this.setHistorystate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasHistorystate = function() {
  return jspb.Message.getField(this, 19) != null;
};


/**
 * optional ContinueAsNewEvent continueAsNew = 20;
 * @return {?proto.ContinueAsNewEvent}
 */
proto.HistoryEvent.prototype.getContinueasnew = function() {
  return /** @type{?proto.ContinueAsNewEvent} */ (
    jspb.Message.getWrapperField(this, proto.ContinueAsNewEvent, 20));
};


/**
 * @param {?proto.ContinueAsNewEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setContinueasnew = function(value) {
  return jspb.Message.setOneofWrapperField(this, 20, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearContinueasnew = function() {
  return this.setContinueasnew(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasContinueasnew = function() {
  return jspb.Message.getField(this, 20) != null;
};


/**
 * optional ExecutionSuspendedEvent executionSuspended = 21;
 * @return {?proto.ExecutionSuspendedEvent}
 */
proto.HistoryEvent.prototype.getExecutionsuspended = function() {
  return /** @type{?proto.ExecutionSuspendedEvent} */ (
    jspb.Message.getWrapperField(this, proto.ExecutionSuspendedEvent, 21));
};


/**
 * @param {?proto.ExecutionSuspendedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setExecutionsuspended = function(value) {
  return jspb.Message.setOneofWrapperField(this, 21, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearExecutionsuspended = function() {
  return this.setExecutionsuspended(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasExecutionsuspended = function() {
  return jspb.Message.getField(this, 21) != null;
};


/**
 * optional ExecutionResumedEvent executionResumed = 22;
 * @return {?proto.ExecutionResumedEvent}
 */
proto.HistoryEvent.prototype.getExecutionresumed = function() {
  return /** @type{?proto.ExecutionResumedEvent} */ (
    jspb.Message.getWrapperField(this, proto.ExecutionResumedEvent, 22));
};


/**
 * @param {?proto.ExecutionResumedEvent|undefined} value
 * @return {!proto.HistoryEvent} returns this
*/
proto.HistoryEvent.prototype.setExecutionresumed = function(value) {
  return jspb.Message.setOneofWrapperField(this, 22, proto.HistoryEvent.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.HistoryEvent} returns this
 */
proto.HistoryEvent.prototype.clearExecutionresumed = function() {
  return this.setExecutionresumed(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.HistoryEvent.prototype.hasExecutionresumed = function() {
  return jspb.Message.getField(this, 22) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ScheduleTaskAction.prototype.toObject = function(opt_includeInstance) {
  return proto.ScheduleTaskAction.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ScheduleTaskAction} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ScheduleTaskAction.toObject = function(includeInstance, msg) {
  var f, obj = {
    name: jspb.Message.getFieldWithDefault(msg, 1, ""),
    version: (f = msg.getVersion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ScheduleTaskAction}
 */
proto.ScheduleTaskAction.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ScheduleTaskAction;
  return proto.ScheduleTaskAction.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ScheduleTaskAction} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ScheduleTaskAction}
 */
proto.ScheduleTaskAction.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setVersion(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ScheduleTaskAction.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ScheduleTaskAction.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ScheduleTaskAction} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ScheduleTaskAction.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getVersion();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string name = 1;
 * @return {string}
 */
proto.ScheduleTaskAction.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.ScheduleTaskAction} returns this
 */
proto.ScheduleTaskAction.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue version = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ScheduleTaskAction.prototype.getVersion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ScheduleTaskAction} returns this
*/
proto.ScheduleTaskAction.prototype.setVersion = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ScheduleTaskAction} returns this
 */
proto.ScheduleTaskAction.prototype.clearVersion = function() {
  return this.setVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ScheduleTaskAction.prototype.hasVersion = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional google.protobuf.StringValue input = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ScheduleTaskAction.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ScheduleTaskAction} returns this
*/
proto.ScheduleTaskAction.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ScheduleTaskAction} returns this
 */
proto.ScheduleTaskAction.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ScheduleTaskAction.prototype.hasInput = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.CreateSubOrchestrationAction.prototype.toObject = function(opt_includeInstance) {
  return proto.CreateSubOrchestrationAction.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.CreateSubOrchestrationAction} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateSubOrchestrationAction.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    version: (f = msg.getVersion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.CreateSubOrchestrationAction}
 */
proto.CreateSubOrchestrationAction.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CreateSubOrchestrationAction;
  return proto.CreateSubOrchestrationAction.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.CreateSubOrchestrationAction} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.CreateSubOrchestrationAction}
 */
proto.CreateSubOrchestrationAction.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setVersion(value);
      break;
    case 4:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.CreateSubOrchestrationAction.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.CreateSubOrchestrationAction.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.CreateSubOrchestrationAction} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateSubOrchestrationAction.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getVersion();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.CreateSubOrchestrationAction.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.CreateSubOrchestrationAction} returns this
 */
proto.CreateSubOrchestrationAction.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.CreateSubOrchestrationAction.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.CreateSubOrchestrationAction} returns this
 */
proto.CreateSubOrchestrationAction.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.StringValue version = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.CreateSubOrchestrationAction.prototype.getVersion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.CreateSubOrchestrationAction} returns this
*/
proto.CreateSubOrchestrationAction.prototype.setVersion = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CreateSubOrchestrationAction} returns this
 */
proto.CreateSubOrchestrationAction.prototype.clearVersion = function() {
  return this.setVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CreateSubOrchestrationAction.prototype.hasVersion = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional google.protobuf.StringValue input = 4;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.CreateSubOrchestrationAction.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 4));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.CreateSubOrchestrationAction} returns this
*/
proto.CreateSubOrchestrationAction.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CreateSubOrchestrationAction} returns this
 */
proto.CreateSubOrchestrationAction.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CreateSubOrchestrationAction.prototype.hasInput = function() {
  return jspb.Message.getField(this, 4) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.CreateTimerAction.prototype.toObject = function(opt_includeInstance) {
  return proto.CreateTimerAction.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.CreateTimerAction} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateTimerAction.toObject = function(includeInstance, msg) {
  var f, obj = {
    fireat: (f = msg.getFireat()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.CreateTimerAction}
 */
proto.CreateTimerAction.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CreateTimerAction;
  return proto.CreateTimerAction.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.CreateTimerAction} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.CreateTimerAction}
 */
proto.CreateTimerAction.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setFireat(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.CreateTimerAction.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.CreateTimerAction.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.CreateTimerAction} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateTimerAction.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getFireat();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional google.protobuf.Timestamp fireAt = 1;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.CreateTimerAction.prototype.getFireat = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 1));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.CreateTimerAction} returns this
*/
proto.CreateTimerAction.prototype.setFireat = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CreateTimerAction} returns this
 */
proto.CreateTimerAction.prototype.clearFireat = function() {
  return this.setFireat(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CreateTimerAction.prototype.hasFireat = function() {
  return jspb.Message.getField(this, 1) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.SendEventAction.prototype.toObject = function(opt_includeInstance) {
  return proto.SendEventAction.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.SendEventAction} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SendEventAction.toObject = function(includeInstance, msg) {
  var f, obj = {
    instance: (f = msg.getInstance()) && proto.OrchestrationInstance.toObject(includeInstance, f),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    data: (f = msg.getData()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.SendEventAction}
 */
proto.SendEventAction.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.SendEventAction;
  return proto.SendEventAction.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.SendEventAction} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.SendEventAction}
 */
proto.SendEventAction.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.OrchestrationInstance;
      reader.readMessage(value,proto.OrchestrationInstance.deserializeBinaryFromReader);
      msg.setInstance(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setData(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.SendEventAction.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.SendEventAction.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.SendEventAction} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SendEventAction.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstance();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.OrchestrationInstance.serializeBinaryToWriter
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getData();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional OrchestrationInstance instance = 1;
 * @return {?proto.OrchestrationInstance}
 */
proto.SendEventAction.prototype.getInstance = function() {
  return /** @type{?proto.OrchestrationInstance} */ (
    jspb.Message.getWrapperField(this, proto.OrchestrationInstance, 1));
};


/**
 * @param {?proto.OrchestrationInstance|undefined} value
 * @return {!proto.SendEventAction} returns this
*/
proto.SendEventAction.prototype.setInstance = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.SendEventAction} returns this
 */
proto.SendEventAction.prototype.clearInstance = function() {
  return this.setInstance(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.SendEventAction.prototype.hasInstance = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.SendEventAction.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.SendEventAction} returns this
 */
proto.SendEventAction.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.StringValue data = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.SendEventAction.prototype.getData = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.SendEventAction} returns this
*/
proto.SendEventAction.prototype.setData = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.SendEventAction} returns this
 */
proto.SendEventAction.prototype.clearData = function() {
  return this.setData(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.SendEventAction.prototype.hasData = function() {
  return jspb.Message.getField(this, 3) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.CompleteOrchestrationAction.repeatedFields_ = [5];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.CompleteOrchestrationAction.prototype.toObject = function(opt_includeInstance) {
  return proto.CompleteOrchestrationAction.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.CompleteOrchestrationAction} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CompleteOrchestrationAction.toObject = function(includeInstance, msg) {
  var f, obj = {
    orchestrationstatus: jspb.Message.getFieldWithDefault(msg, 1, 0),
    result: (f = msg.getResult()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    details: (f = msg.getDetails()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    newversion: (f = msg.getNewversion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    carryovereventsList: jspb.Message.toObjectList(msg.getCarryovereventsList(),
    proto.HistoryEvent.toObject, includeInstance),
    failuredetails: (f = msg.getFailuredetails()) && proto.TaskFailureDetails.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.CompleteOrchestrationAction}
 */
proto.CompleteOrchestrationAction.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CompleteOrchestrationAction;
  return proto.CompleteOrchestrationAction.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.CompleteOrchestrationAction} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.CompleteOrchestrationAction}
 */
proto.CompleteOrchestrationAction.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {!proto.OrchestrationStatus} */ (reader.readEnum());
      msg.setOrchestrationstatus(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setResult(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setDetails(value);
      break;
    case 4:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setNewversion(value);
      break;
    case 5:
      var value = new proto.HistoryEvent;
      reader.readMessage(value,proto.HistoryEvent.deserializeBinaryFromReader);
      msg.addCarryoverevents(value);
      break;
    case 6:
      var value = new proto.TaskFailureDetails;
      reader.readMessage(value,proto.TaskFailureDetails.deserializeBinaryFromReader);
      msg.setFailuredetails(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.CompleteOrchestrationAction.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.CompleteOrchestrationAction.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.CompleteOrchestrationAction} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CompleteOrchestrationAction.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrchestrationstatus();
  if (f !== 0.0) {
    writer.writeEnum(
      1,
      f
    );
  }
  f = message.getResult();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getDetails();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getNewversion();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getCarryovereventsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      5,
      f,
      proto.HistoryEvent.serializeBinaryToWriter
    );
  }
  f = message.getFailuredetails();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.TaskFailureDetails.serializeBinaryToWriter
    );
  }
};


/**
 * optional OrchestrationStatus orchestrationStatus = 1;
 * @return {!proto.OrchestrationStatus}
 */
proto.CompleteOrchestrationAction.prototype.getOrchestrationstatus = function() {
  return /** @type {!proto.OrchestrationStatus} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {!proto.OrchestrationStatus} value
 * @return {!proto.CompleteOrchestrationAction} returns this
 */
proto.CompleteOrchestrationAction.prototype.setOrchestrationstatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue result = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.CompleteOrchestrationAction.prototype.getResult = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.CompleteOrchestrationAction} returns this
*/
proto.CompleteOrchestrationAction.prototype.setResult = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CompleteOrchestrationAction} returns this
 */
proto.CompleteOrchestrationAction.prototype.clearResult = function() {
  return this.setResult(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CompleteOrchestrationAction.prototype.hasResult = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional google.protobuf.StringValue details = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.CompleteOrchestrationAction.prototype.getDetails = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.CompleteOrchestrationAction} returns this
*/
proto.CompleteOrchestrationAction.prototype.setDetails = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CompleteOrchestrationAction} returns this
 */
proto.CompleteOrchestrationAction.prototype.clearDetails = function() {
  return this.setDetails(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CompleteOrchestrationAction.prototype.hasDetails = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional google.protobuf.StringValue newVersion = 4;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.CompleteOrchestrationAction.prototype.getNewversion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 4));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.CompleteOrchestrationAction} returns this
*/
proto.CompleteOrchestrationAction.prototype.setNewversion = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CompleteOrchestrationAction} returns this
 */
proto.CompleteOrchestrationAction.prototype.clearNewversion = function() {
  return this.setNewversion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CompleteOrchestrationAction.prototype.hasNewversion = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * repeated HistoryEvent carryoverEvents = 5;
 * @return {!Array<!proto.HistoryEvent>}
 */
proto.CompleteOrchestrationAction.prototype.getCarryovereventsList = function() {
  return /** @type{!Array<!proto.HistoryEvent>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.HistoryEvent, 5));
};


/**
 * @param {!Array<!proto.HistoryEvent>} value
 * @return {!proto.CompleteOrchestrationAction} returns this
*/
proto.CompleteOrchestrationAction.prototype.setCarryovereventsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 5, value);
};


/**
 * @param {!proto.HistoryEvent=} opt_value
 * @param {number=} opt_index
 * @return {!proto.HistoryEvent}
 */
proto.CompleteOrchestrationAction.prototype.addCarryoverevents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 5, opt_value, proto.HistoryEvent, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.CompleteOrchestrationAction} returns this
 */
proto.CompleteOrchestrationAction.prototype.clearCarryovereventsList = function() {
  return this.setCarryovereventsList([]);
};


/**
 * optional TaskFailureDetails failureDetails = 6;
 * @return {?proto.TaskFailureDetails}
 */
proto.CompleteOrchestrationAction.prototype.getFailuredetails = function() {
  return /** @type{?proto.TaskFailureDetails} */ (
    jspb.Message.getWrapperField(this, proto.TaskFailureDetails, 6));
};


/**
 * @param {?proto.TaskFailureDetails|undefined} value
 * @return {!proto.CompleteOrchestrationAction} returns this
*/
proto.CompleteOrchestrationAction.prototype.setFailuredetails = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CompleteOrchestrationAction} returns this
 */
proto.CompleteOrchestrationAction.prototype.clearFailuredetails = function() {
  return this.setFailuredetails(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CompleteOrchestrationAction.prototype.hasFailuredetails = function() {
  return jspb.Message.getField(this, 6) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.OrchestratorAction.oneofGroups_ = [[2,3,4,5,6]];

/**
 * @enum {number}
 */
proto.OrchestratorAction.OrchestratoractiontypeCase = {
  ORCHESTRATORACTIONTYPE_NOT_SET: 0,
  SCHEDULETASK: 2,
  CREATESUBORCHESTRATION: 3,
  CREATETIMER: 4,
  SENDEVENT: 5,
  COMPLETEORCHESTRATION: 6
};

/**
 * @return {proto.OrchestratorAction.OrchestratoractiontypeCase}
 */
proto.OrchestratorAction.prototype.getOrchestratoractiontypeCase = function() {
  return /** @type {proto.OrchestratorAction.OrchestratoractiontypeCase} */(jspb.Message.computeOneofCase(this, proto.OrchestratorAction.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.OrchestratorAction.prototype.toObject = function(opt_includeInstance) {
  return proto.OrchestratorAction.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.OrchestratorAction} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorAction.toObject = function(includeInstance, msg) {
  var f, obj = {
    id: jspb.Message.getFieldWithDefault(msg, 1, 0),
    scheduletask: (f = msg.getScheduletask()) && proto.ScheduleTaskAction.toObject(includeInstance, f),
    createsuborchestration: (f = msg.getCreatesuborchestration()) && proto.CreateSubOrchestrationAction.toObject(includeInstance, f),
    createtimer: (f = msg.getCreatetimer()) && proto.CreateTimerAction.toObject(includeInstance, f),
    sendevent: (f = msg.getSendevent()) && proto.SendEventAction.toObject(includeInstance, f),
    completeorchestration: (f = msg.getCompleteorchestration()) && proto.CompleteOrchestrationAction.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.OrchestratorAction}
 */
proto.OrchestratorAction.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.OrchestratorAction;
  return proto.OrchestratorAction.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.OrchestratorAction} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.OrchestratorAction}
 */
proto.OrchestratorAction.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = new proto.ScheduleTaskAction;
      reader.readMessage(value,proto.ScheduleTaskAction.deserializeBinaryFromReader);
      msg.setScheduletask(value);
      break;
    case 3:
      var value = new proto.CreateSubOrchestrationAction;
      reader.readMessage(value,proto.CreateSubOrchestrationAction.deserializeBinaryFromReader);
      msg.setCreatesuborchestration(value);
      break;
    case 4:
      var value = new proto.CreateTimerAction;
      reader.readMessage(value,proto.CreateTimerAction.deserializeBinaryFromReader);
      msg.setCreatetimer(value);
      break;
    case 5:
      var value = new proto.SendEventAction;
      reader.readMessage(value,proto.SendEventAction.deserializeBinaryFromReader);
      msg.setSendevent(value);
      break;
    case 6:
      var value = new proto.CompleteOrchestrationAction;
      reader.readMessage(value,proto.CompleteOrchestrationAction.deserializeBinaryFromReader);
      msg.setCompleteorchestration(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.OrchestratorAction.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.OrchestratorAction.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.OrchestratorAction} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorAction.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
  f = message.getScheduletask();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.ScheduleTaskAction.serializeBinaryToWriter
    );
  }
  f = message.getCreatesuborchestration();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      proto.CreateSubOrchestrationAction.serializeBinaryToWriter
    );
  }
  f = message.getCreatetimer();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      proto.CreateTimerAction.serializeBinaryToWriter
    );
  }
  f = message.getSendevent();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      proto.SendEventAction.serializeBinaryToWriter
    );
  }
  f = message.getCompleteorchestration();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      proto.CompleteOrchestrationAction.serializeBinaryToWriter
    );
  }
};


/**
 * optional int32 id = 1;
 * @return {number}
 */
proto.OrchestratorAction.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.OrchestratorAction} returns this
 */
proto.OrchestratorAction.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};


/**
 * optional ScheduleTaskAction scheduleTask = 2;
 * @return {?proto.ScheduleTaskAction}
 */
proto.OrchestratorAction.prototype.getScheduletask = function() {
  return /** @type{?proto.ScheduleTaskAction} */ (
    jspb.Message.getWrapperField(this, proto.ScheduleTaskAction, 2));
};


/**
 * @param {?proto.ScheduleTaskAction|undefined} value
 * @return {!proto.OrchestratorAction} returns this
*/
proto.OrchestratorAction.prototype.setScheduletask = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.OrchestratorAction.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestratorAction} returns this
 */
proto.OrchestratorAction.prototype.clearScheduletask = function() {
  return this.setScheduletask(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestratorAction.prototype.hasScheduletask = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional CreateSubOrchestrationAction createSubOrchestration = 3;
 * @return {?proto.CreateSubOrchestrationAction}
 */
proto.OrchestratorAction.prototype.getCreatesuborchestration = function() {
  return /** @type{?proto.CreateSubOrchestrationAction} */ (
    jspb.Message.getWrapperField(this, proto.CreateSubOrchestrationAction, 3));
};


/**
 * @param {?proto.CreateSubOrchestrationAction|undefined} value
 * @return {!proto.OrchestratorAction} returns this
*/
proto.OrchestratorAction.prototype.setCreatesuborchestration = function(value) {
  return jspb.Message.setOneofWrapperField(this, 3, proto.OrchestratorAction.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestratorAction} returns this
 */
proto.OrchestratorAction.prototype.clearCreatesuborchestration = function() {
  return this.setCreatesuborchestration(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestratorAction.prototype.hasCreatesuborchestration = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional CreateTimerAction createTimer = 4;
 * @return {?proto.CreateTimerAction}
 */
proto.OrchestratorAction.prototype.getCreatetimer = function() {
  return /** @type{?proto.CreateTimerAction} */ (
    jspb.Message.getWrapperField(this, proto.CreateTimerAction, 4));
};


/**
 * @param {?proto.CreateTimerAction|undefined} value
 * @return {!proto.OrchestratorAction} returns this
*/
proto.OrchestratorAction.prototype.setCreatetimer = function(value) {
  return jspb.Message.setOneofWrapperField(this, 4, proto.OrchestratorAction.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestratorAction} returns this
 */
proto.OrchestratorAction.prototype.clearCreatetimer = function() {
  return this.setCreatetimer(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestratorAction.prototype.hasCreatetimer = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional SendEventAction sendEvent = 5;
 * @return {?proto.SendEventAction}
 */
proto.OrchestratorAction.prototype.getSendevent = function() {
  return /** @type{?proto.SendEventAction} */ (
    jspb.Message.getWrapperField(this, proto.SendEventAction, 5));
};


/**
 * @param {?proto.SendEventAction|undefined} value
 * @return {!proto.OrchestratorAction} returns this
*/
proto.OrchestratorAction.prototype.setSendevent = function(value) {
  return jspb.Message.setOneofWrapperField(this, 5, proto.OrchestratorAction.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestratorAction} returns this
 */
proto.OrchestratorAction.prototype.clearSendevent = function() {
  return this.setSendevent(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestratorAction.prototype.hasSendevent = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional CompleteOrchestrationAction completeOrchestration = 6;
 * @return {?proto.CompleteOrchestrationAction}
 */
proto.OrchestratorAction.prototype.getCompleteorchestration = function() {
  return /** @type{?proto.CompleteOrchestrationAction} */ (
    jspb.Message.getWrapperField(this, proto.CompleteOrchestrationAction, 6));
};


/**
 * @param {?proto.CompleteOrchestrationAction|undefined} value
 * @return {!proto.OrchestratorAction} returns this
*/
proto.OrchestratorAction.prototype.setCompleteorchestration = function(value) {
  return jspb.Message.setOneofWrapperField(this, 6, proto.OrchestratorAction.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestratorAction} returns this
 */
proto.OrchestratorAction.prototype.clearCompleteorchestration = function() {
  return this.setCompleteorchestration(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestratorAction.prototype.hasCompleteorchestration = function() {
  return jspb.Message.getField(this, 6) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.OrchestratorRequest.repeatedFields_ = [3,4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.OrchestratorRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.OrchestratorRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.OrchestratorRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    executionid: (f = msg.getExecutionid()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    pasteventsList: jspb.Message.toObjectList(msg.getPasteventsList(),
    proto.HistoryEvent.toObject, includeInstance),
    neweventsList: jspb.Message.toObjectList(msg.getNeweventsList(),
    proto.HistoryEvent.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.OrchestratorRequest}
 */
proto.OrchestratorRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.OrchestratorRequest;
  return proto.OrchestratorRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.OrchestratorRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.OrchestratorRequest}
 */
proto.OrchestratorRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setExecutionid(value);
      break;
    case 3:
      var value = new proto.HistoryEvent;
      reader.readMessage(value,proto.HistoryEvent.deserializeBinaryFromReader);
      msg.addPastevents(value);
      break;
    case 4:
      var value = new proto.HistoryEvent;
      reader.readMessage(value,proto.HistoryEvent.deserializeBinaryFromReader);
      msg.addNewevents(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.OrchestratorRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.OrchestratorRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.OrchestratorRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getExecutionid();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getPasteventsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      3,
      f,
      proto.HistoryEvent.serializeBinaryToWriter
    );
  }
  f = message.getNeweventsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      proto.HistoryEvent.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.OrchestratorRequest.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.OrchestratorRequest} returns this
 */
proto.OrchestratorRequest.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue executionId = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.OrchestratorRequest.prototype.getExecutionid = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.OrchestratorRequest} returns this
*/
proto.OrchestratorRequest.prototype.setExecutionid = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestratorRequest} returns this
 */
proto.OrchestratorRequest.prototype.clearExecutionid = function() {
  return this.setExecutionid(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestratorRequest.prototype.hasExecutionid = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * repeated HistoryEvent pastEvents = 3;
 * @return {!Array<!proto.HistoryEvent>}
 */
proto.OrchestratorRequest.prototype.getPasteventsList = function() {
  return /** @type{!Array<!proto.HistoryEvent>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.HistoryEvent, 3));
};


/**
 * @param {!Array<!proto.HistoryEvent>} value
 * @return {!proto.OrchestratorRequest} returns this
*/
proto.OrchestratorRequest.prototype.setPasteventsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 3, value);
};


/**
 * @param {!proto.HistoryEvent=} opt_value
 * @param {number=} opt_index
 * @return {!proto.HistoryEvent}
 */
proto.OrchestratorRequest.prototype.addPastevents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 3, opt_value, proto.HistoryEvent, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.OrchestratorRequest} returns this
 */
proto.OrchestratorRequest.prototype.clearPasteventsList = function() {
  return this.setPasteventsList([]);
};


/**
 * repeated HistoryEvent newEvents = 4;
 * @return {!Array<!proto.HistoryEvent>}
 */
proto.OrchestratorRequest.prototype.getNeweventsList = function() {
  return /** @type{!Array<!proto.HistoryEvent>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.HistoryEvent, 4));
};


/**
 * @param {!Array<!proto.HistoryEvent>} value
 * @return {!proto.OrchestratorRequest} returns this
*/
proto.OrchestratorRequest.prototype.setNeweventsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.HistoryEvent=} opt_value
 * @param {number=} opt_index
 * @return {!proto.HistoryEvent}
 */
proto.OrchestratorRequest.prototype.addNewevents = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.HistoryEvent, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.OrchestratorRequest} returns this
 */
proto.OrchestratorRequest.prototype.clearNeweventsList = function() {
  return this.setNeweventsList([]);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.OrchestratorResponse.repeatedFields_ = [2];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.OrchestratorResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.OrchestratorResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.OrchestratorResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    actionsList: jspb.Message.toObjectList(msg.getActionsList(),
    proto.OrchestratorAction.toObject, includeInstance),
    customstatus: (f = msg.getCustomstatus()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.OrchestratorResponse}
 */
proto.OrchestratorResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.OrchestratorResponse;
  return proto.OrchestratorResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.OrchestratorResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.OrchestratorResponse}
 */
proto.OrchestratorResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = new proto.OrchestratorAction;
      reader.readMessage(value,proto.OrchestratorAction.deserializeBinaryFromReader);
      msg.addActions(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setCustomstatus(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.OrchestratorResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.OrchestratorResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.OrchestratorResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestratorResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getActionsList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      2,
      f,
      proto.OrchestratorAction.serializeBinaryToWriter
    );
  }
  f = message.getCustomstatus();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.OrchestratorResponse.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.OrchestratorResponse} returns this
 */
proto.OrchestratorResponse.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * repeated OrchestratorAction actions = 2;
 * @return {!Array<!proto.OrchestratorAction>}
 */
proto.OrchestratorResponse.prototype.getActionsList = function() {
  return /** @type{!Array<!proto.OrchestratorAction>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.OrchestratorAction, 2));
};


/**
 * @param {!Array<!proto.OrchestratorAction>} value
 * @return {!proto.OrchestratorResponse} returns this
*/
proto.OrchestratorResponse.prototype.setActionsList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 2, value);
};


/**
 * @param {!proto.OrchestratorAction=} opt_value
 * @param {number=} opt_index
 * @return {!proto.OrchestratorAction}
 */
proto.OrchestratorResponse.prototype.addActions = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 2, opt_value, proto.OrchestratorAction, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.OrchestratorResponse} returns this
 */
proto.OrchestratorResponse.prototype.clearActionsList = function() {
  return this.setActionsList([]);
};


/**
 * optional google.protobuf.StringValue customStatus = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.OrchestratorResponse.prototype.getCustomstatus = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.OrchestratorResponse} returns this
*/
proto.OrchestratorResponse.prototype.setCustomstatus = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestratorResponse} returns this
 */
proto.OrchestratorResponse.prototype.clearCustomstatus = function() {
  return this.setCustomstatus(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestratorResponse.prototype.hasCustomstatus = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.CreateInstanceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.CreateInstanceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.CreateInstanceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateInstanceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    version: (f = msg.getVersion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    scheduledstarttimestamp: (f = msg.getScheduledstarttimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.CreateInstanceRequest}
 */
proto.CreateInstanceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CreateInstanceRequest;
  return proto.CreateInstanceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.CreateInstanceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.CreateInstanceRequest}
 */
proto.CreateInstanceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setVersion(value);
      break;
    case 4:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    case 5:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setScheduledstarttimestamp(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.CreateInstanceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.CreateInstanceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.CreateInstanceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateInstanceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getVersion();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      4,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getScheduledstarttimestamp();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.CreateInstanceRequest.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.CreateInstanceRequest} returns this
 */
proto.CreateInstanceRequest.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.CreateInstanceRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.CreateInstanceRequest} returns this
 */
proto.CreateInstanceRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.StringValue version = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.CreateInstanceRequest.prototype.getVersion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.CreateInstanceRequest} returns this
*/
proto.CreateInstanceRequest.prototype.setVersion = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CreateInstanceRequest} returns this
 */
proto.CreateInstanceRequest.prototype.clearVersion = function() {
  return this.setVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CreateInstanceRequest.prototype.hasVersion = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional google.protobuf.StringValue input = 4;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.CreateInstanceRequest.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 4));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.CreateInstanceRequest} returns this
*/
proto.CreateInstanceRequest.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 4, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CreateInstanceRequest} returns this
 */
proto.CreateInstanceRequest.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CreateInstanceRequest.prototype.hasInput = function() {
  return jspb.Message.getField(this, 4) != null;
};


/**
 * optional google.protobuf.Timestamp scheduledStartTimestamp = 5;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.CreateInstanceRequest.prototype.getScheduledstarttimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 5));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.CreateInstanceRequest} returns this
*/
proto.CreateInstanceRequest.prototype.setScheduledstarttimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.CreateInstanceRequest} returns this
 */
proto.CreateInstanceRequest.prototype.clearScheduledstarttimestamp = function() {
  return this.setScheduledstarttimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.CreateInstanceRequest.prototype.hasScheduledstarttimestamp = function() {
  return jspb.Message.getField(this, 5) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.CreateInstanceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.CreateInstanceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.CreateInstanceResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateInstanceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.CreateInstanceResponse}
 */
proto.CreateInstanceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CreateInstanceResponse;
  return proto.CreateInstanceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.CreateInstanceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.CreateInstanceResponse}
 */
proto.CreateInstanceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.CreateInstanceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.CreateInstanceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.CreateInstanceResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateInstanceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.CreateInstanceResponse.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.CreateInstanceResponse} returns this
 */
proto.CreateInstanceResponse.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.GetInstanceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.GetInstanceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.GetInstanceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GetInstanceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    getinputsandoutputs: jspb.Message.getBooleanFieldWithDefault(msg, 2, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.GetInstanceRequest}
 */
proto.GetInstanceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.GetInstanceRequest;
  return proto.GetInstanceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.GetInstanceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.GetInstanceRequest}
 */
proto.GetInstanceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setGetinputsandoutputs(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.GetInstanceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.GetInstanceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.GetInstanceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GetInstanceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getGetinputsandoutputs();
  if (f) {
    writer.writeBool(
      2,
      f
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.GetInstanceRequest.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.GetInstanceRequest} returns this
 */
proto.GetInstanceRequest.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional bool getInputsAndOutputs = 2;
 * @return {boolean}
 */
proto.GetInstanceRequest.prototype.getGetinputsandoutputs = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 2, false));
};


/**
 * @param {boolean} value
 * @return {!proto.GetInstanceRequest} returns this
 */
proto.GetInstanceRequest.prototype.setGetinputsandoutputs = function(value) {
  return jspb.Message.setProto3BooleanField(this, 2, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.GetInstanceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.GetInstanceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.GetInstanceResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GetInstanceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    exists: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
    orchestrationstate: (f = msg.getOrchestrationstate()) && proto.OrchestrationState.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.GetInstanceResponse}
 */
proto.GetInstanceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.GetInstanceResponse;
  return proto.GetInstanceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.GetInstanceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.GetInstanceResponse}
 */
proto.GetInstanceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setExists(value);
      break;
    case 2:
      var value = new proto.OrchestrationState;
      reader.readMessage(value,proto.OrchestrationState.deserializeBinaryFromReader);
      msg.setOrchestrationstate(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.GetInstanceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.GetInstanceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.GetInstanceResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GetInstanceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getExists();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
  f = message.getOrchestrationstate();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.OrchestrationState.serializeBinaryToWriter
    );
  }
};


/**
 * optional bool exists = 1;
 * @return {boolean}
 */
proto.GetInstanceResponse.prototype.getExists = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.GetInstanceResponse} returns this
 */
proto.GetInstanceResponse.prototype.setExists = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};


/**
 * optional OrchestrationState orchestrationState = 2;
 * @return {?proto.OrchestrationState}
 */
proto.GetInstanceResponse.prototype.getOrchestrationstate = function() {
  return /** @type{?proto.OrchestrationState} */ (
    jspb.Message.getWrapperField(this, proto.OrchestrationState, 2));
};


/**
 * @param {?proto.OrchestrationState|undefined} value
 * @return {!proto.GetInstanceResponse} returns this
*/
proto.GetInstanceResponse.prototype.setOrchestrationstate = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.GetInstanceResponse} returns this
 */
proto.GetInstanceResponse.prototype.clearOrchestrationstate = function() {
  return this.setOrchestrationstate(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.GetInstanceResponse.prototype.hasOrchestrationstate = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.RewindInstanceRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.RewindInstanceRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.RewindInstanceRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RewindInstanceRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    reason: (f = msg.getReason()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.RewindInstanceRequest}
 */
proto.RewindInstanceRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.RewindInstanceRequest;
  return proto.RewindInstanceRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.RewindInstanceRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.RewindInstanceRequest}
 */
proto.RewindInstanceRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.RewindInstanceRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.RewindInstanceRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.RewindInstanceRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RewindInstanceRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getReason();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.RewindInstanceRequest.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.RewindInstanceRequest} returns this
 */
proto.RewindInstanceRequest.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue reason = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.RewindInstanceRequest.prototype.getReason = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.RewindInstanceRequest} returns this
*/
proto.RewindInstanceRequest.prototype.setReason = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.RewindInstanceRequest} returns this
 */
proto.RewindInstanceRequest.prototype.clearReason = function() {
  return this.setReason(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.RewindInstanceRequest.prototype.hasReason = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.RewindInstanceResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.RewindInstanceResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.RewindInstanceResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RewindInstanceResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.RewindInstanceResponse}
 */
proto.RewindInstanceResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.RewindInstanceResponse;
  return proto.RewindInstanceResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.RewindInstanceResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.RewindInstanceResponse}
 */
proto.RewindInstanceResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.RewindInstanceResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.RewindInstanceResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.RewindInstanceResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RewindInstanceResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.OrchestrationState.prototype.toObject = function(opt_includeInstance) {
  return proto.OrchestrationState.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.OrchestrationState} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestrationState.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    version: (f = msg.getVersion()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    orchestrationstatus: jspb.Message.getFieldWithDefault(msg, 4, 0),
    scheduledstarttimestamp: (f = msg.getScheduledstarttimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    createdtimestamp: (f = msg.getCreatedtimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    lastupdatedtimestamp: (f = msg.getLastupdatedtimestamp()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    output: (f = msg.getOutput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    customstatus: (f = msg.getCustomstatus()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    failuredetails: (f = msg.getFailuredetails()) && proto.TaskFailureDetails.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.OrchestrationState}
 */
proto.OrchestrationState.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.OrchestrationState;
  return proto.OrchestrationState.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.OrchestrationState} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.OrchestrationState}
 */
proto.OrchestrationState.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setVersion(value);
      break;
    case 4:
      var value = /** @type {!proto.OrchestrationStatus} */ (reader.readEnum());
      msg.setOrchestrationstatus(value);
      break;
    case 5:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setScheduledstarttimestamp(value);
      break;
    case 6:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedtimestamp(value);
      break;
    case 7:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setLastupdatedtimestamp(value);
      break;
    case 8:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    case 9:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setOutput(value);
      break;
    case 10:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setCustomstatus(value);
      break;
    case 11:
      var value = new proto.TaskFailureDetails;
      reader.readMessage(value,proto.TaskFailureDetails.deserializeBinaryFromReader);
      msg.setFailuredetails(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.OrchestrationState.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.OrchestrationState.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.OrchestrationState} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.OrchestrationState.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getVersion();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getOrchestrationstatus();
  if (f !== 0.0) {
    writer.writeEnum(
      4,
      f
    );
  }
  f = message.getScheduledstarttimestamp();
  if (f != null) {
    writer.writeMessage(
      5,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getCreatedtimestamp();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getLastupdatedtimestamp();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      8,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getOutput();
  if (f != null) {
    writer.writeMessage(
      9,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getCustomstatus();
  if (f != null) {
    writer.writeMessage(
      10,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getFailuredetails();
  if (f != null) {
    writer.writeMessage(
      11,
      f,
      proto.TaskFailureDetails.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.OrchestrationState.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.OrchestrationState.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.StringValue version = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.OrchestrationState.prototype.getVersion = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.OrchestrationState} returns this
*/
proto.OrchestrationState.prototype.setVersion = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.clearVersion = function() {
  return this.setVersion(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestrationState.prototype.hasVersion = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * optional OrchestrationStatus orchestrationStatus = 4;
 * @return {!proto.OrchestrationStatus}
 */
proto.OrchestrationState.prototype.getOrchestrationstatus = function() {
  return /** @type {!proto.OrchestrationStatus} */ (jspb.Message.getFieldWithDefault(this, 4, 0));
};


/**
 * @param {!proto.OrchestrationStatus} value
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.setOrchestrationstatus = function(value) {
  return jspb.Message.setProto3EnumField(this, 4, value);
};


/**
 * optional google.protobuf.Timestamp scheduledStartTimestamp = 5;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.OrchestrationState.prototype.getScheduledstarttimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 5));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.OrchestrationState} returns this
*/
proto.OrchestrationState.prototype.setScheduledstarttimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 5, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.clearScheduledstarttimestamp = function() {
  return this.setScheduledstarttimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestrationState.prototype.hasScheduledstarttimestamp = function() {
  return jspb.Message.getField(this, 5) != null;
};


/**
 * optional google.protobuf.Timestamp createdTimestamp = 6;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.OrchestrationState.prototype.getCreatedtimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 6));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.OrchestrationState} returns this
*/
proto.OrchestrationState.prototype.setCreatedtimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.clearCreatedtimestamp = function() {
  return this.setCreatedtimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestrationState.prototype.hasCreatedtimestamp = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional google.protobuf.Timestamp lastUpdatedTimestamp = 7;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.OrchestrationState.prototype.getLastupdatedtimestamp = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 7));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.OrchestrationState} returns this
*/
proto.OrchestrationState.prototype.setLastupdatedtimestamp = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.clearLastupdatedtimestamp = function() {
  return this.setLastupdatedtimestamp(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestrationState.prototype.hasLastupdatedtimestamp = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional google.protobuf.StringValue input = 8;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.OrchestrationState.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 8));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.OrchestrationState} returns this
*/
proto.OrchestrationState.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 8, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestrationState.prototype.hasInput = function() {
  return jspb.Message.getField(this, 8) != null;
};


/**
 * optional google.protobuf.StringValue output = 9;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.OrchestrationState.prototype.getOutput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 9));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.OrchestrationState} returns this
*/
proto.OrchestrationState.prototype.setOutput = function(value) {
  return jspb.Message.setWrapperField(this, 9, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.clearOutput = function() {
  return this.setOutput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestrationState.prototype.hasOutput = function() {
  return jspb.Message.getField(this, 9) != null;
};


/**
 * optional google.protobuf.StringValue customStatus = 10;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.OrchestrationState.prototype.getCustomstatus = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 10));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.OrchestrationState} returns this
*/
proto.OrchestrationState.prototype.setCustomstatus = function(value) {
  return jspb.Message.setWrapperField(this, 10, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.clearCustomstatus = function() {
  return this.setCustomstatus(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestrationState.prototype.hasCustomstatus = function() {
  return jspb.Message.getField(this, 10) != null;
};


/**
 * optional TaskFailureDetails failureDetails = 11;
 * @return {?proto.TaskFailureDetails}
 */
proto.OrchestrationState.prototype.getFailuredetails = function() {
  return /** @type{?proto.TaskFailureDetails} */ (
    jspb.Message.getWrapperField(this, proto.TaskFailureDetails, 11));
};


/**
 * @param {?proto.TaskFailureDetails|undefined} value
 * @return {!proto.OrchestrationState} returns this
*/
proto.OrchestrationState.prototype.setFailuredetails = function(value) {
  return jspb.Message.setWrapperField(this, 11, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.OrchestrationState} returns this
 */
proto.OrchestrationState.prototype.clearFailuredetails = function() {
  return this.setFailuredetails(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.OrchestrationState.prototype.hasFailuredetails = function() {
  return jspb.Message.getField(this, 11) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.RaiseEventRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.RaiseEventRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.RaiseEventRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RaiseEventRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    name: jspb.Message.getFieldWithDefault(msg, 2, ""),
    input: (f = msg.getInput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.RaiseEventRequest}
 */
proto.RaiseEventRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.RaiseEventRequest;
  return proto.RaiseEventRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.RaiseEventRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.RaiseEventRequest}
 */
proto.RaiseEventRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setName(value);
      break;
    case 3:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.RaiseEventRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.RaiseEventRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.RaiseEventRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RaiseEventRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getName();
  if (f.length > 0) {
    writer.writeString(
      2,
      f
    );
  }
  f = message.getInput();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.RaiseEventRequest.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.RaiseEventRequest} returns this
 */
proto.RaiseEventRequest.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional string name = 2;
 * @return {string}
 */
proto.RaiseEventRequest.prototype.getName = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};


/**
 * @param {string} value
 * @return {!proto.RaiseEventRequest} returns this
 */
proto.RaiseEventRequest.prototype.setName = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};


/**
 * optional google.protobuf.StringValue input = 3;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.RaiseEventRequest.prototype.getInput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 3));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.RaiseEventRequest} returns this
*/
proto.RaiseEventRequest.prototype.setInput = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.RaiseEventRequest} returns this
 */
proto.RaiseEventRequest.prototype.clearInput = function() {
  return this.setInput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.RaiseEventRequest.prototype.hasInput = function() {
  return jspb.Message.getField(this, 3) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.RaiseEventResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.RaiseEventResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.RaiseEventResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RaiseEventResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.RaiseEventResponse}
 */
proto.RaiseEventResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.RaiseEventResponse;
  return proto.RaiseEventResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.RaiseEventResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.RaiseEventResponse}
 */
proto.RaiseEventResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.RaiseEventResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.RaiseEventResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.RaiseEventResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.RaiseEventResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.TerminateRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.TerminateRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TerminateRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TerminateRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    output: (f = msg.getOutput()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.TerminateRequest}
 */
proto.TerminateRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TerminateRequest;
  return proto.TerminateRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TerminateRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TerminateRequest}
 */
proto.TerminateRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setOutput(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.TerminateRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TerminateRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TerminateRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TerminateRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getOutput();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.TerminateRequest.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.TerminateRequest} returns this
 */
proto.TerminateRequest.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue output = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.TerminateRequest.prototype.getOutput = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.TerminateRequest} returns this
*/
proto.TerminateRequest.prototype.setOutput = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.TerminateRequest} returns this
 */
proto.TerminateRequest.prototype.clearOutput = function() {
  return this.setOutput(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.TerminateRequest.prototype.hasOutput = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.TerminateResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.TerminateResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.TerminateResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TerminateResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.TerminateResponse}
 */
proto.TerminateResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.TerminateResponse;
  return proto.TerminateResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.TerminateResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.TerminateResponse}
 */
proto.TerminateResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.TerminateResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.TerminateResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.TerminateResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.TerminateResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.SuspendRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.SuspendRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.SuspendRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SuspendRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    reason: (f = msg.getReason()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.SuspendRequest}
 */
proto.SuspendRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.SuspendRequest;
  return proto.SuspendRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.SuspendRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.SuspendRequest}
 */
proto.SuspendRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.SuspendRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.SuspendRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.SuspendRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SuspendRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getReason();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.SuspendRequest.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.SuspendRequest} returns this
 */
proto.SuspendRequest.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue reason = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.SuspendRequest.prototype.getReason = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.SuspendRequest} returns this
*/
proto.SuspendRequest.prototype.setReason = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.SuspendRequest} returns this
 */
proto.SuspendRequest.prototype.clearReason = function() {
  return this.setReason(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.SuspendRequest.prototype.hasReason = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.SuspendResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.SuspendResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.SuspendResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SuspendResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.SuspendResponse}
 */
proto.SuspendResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.SuspendResponse;
  return proto.SuspendResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.SuspendResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.SuspendResponse}
 */
proto.SuspendResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.SuspendResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.SuspendResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.SuspendResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.SuspendResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ResumeRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.ResumeRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ResumeRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ResumeRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    reason: (f = msg.getReason()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ResumeRequest}
 */
proto.ResumeRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ResumeRequest;
  return proto.ResumeRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ResumeRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ResumeRequest}
 */
proto.ResumeRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setReason(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ResumeRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ResumeRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ResumeRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ResumeRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getInstanceid();
  if (f.length > 0) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getReason();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.ResumeRequest.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.ResumeRequest} returns this
 */
proto.ResumeRequest.prototype.setInstanceid = function(value) {
  return jspb.Message.setProto3StringField(this, 1, value);
};


/**
 * optional google.protobuf.StringValue reason = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.ResumeRequest.prototype.getReason = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.ResumeRequest} returns this
*/
proto.ResumeRequest.prototype.setReason = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.ResumeRequest} returns this
 */
proto.ResumeRequest.prototype.clearReason = function() {
  return this.setReason(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.ResumeRequest.prototype.hasReason = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.ResumeResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.ResumeResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.ResumeResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ResumeResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.ResumeResponse}
 */
proto.ResumeResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.ResumeResponse;
  return proto.ResumeResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.ResumeResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.ResumeResponse}
 */
proto.ResumeResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.ResumeResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.ResumeResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.ResumeResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.ResumeResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.QueryInstancesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.QueryInstancesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.QueryInstancesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.QueryInstancesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    query: (f = msg.getQuery()) && proto.InstanceQuery.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.QueryInstancesRequest}
 */
proto.QueryInstancesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.QueryInstancesRequest;
  return proto.QueryInstancesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.QueryInstancesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.QueryInstancesRequest}
 */
proto.QueryInstancesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.InstanceQuery;
      reader.readMessage(value,proto.InstanceQuery.deserializeBinaryFromReader);
      msg.setQuery(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.QueryInstancesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.QueryInstancesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.QueryInstancesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.QueryInstancesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getQuery();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.InstanceQuery.serializeBinaryToWriter
    );
  }
};


/**
 * optional InstanceQuery query = 1;
 * @return {?proto.InstanceQuery}
 */
proto.QueryInstancesRequest.prototype.getQuery = function() {
  return /** @type{?proto.InstanceQuery} */ (
    jspb.Message.getWrapperField(this, proto.InstanceQuery, 1));
};


/**
 * @param {?proto.InstanceQuery|undefined} value
 * @return {!proto.QueryInstancesRequest} returns this
*/
proto.QueryInstancesRequest.prototype.setQuery = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.QueryInstancesRequest} returns this
 */
proto.QueryInstancesRequest.prototype.clearQuery = function() {
  return this.setQuery(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.QueryInstancesRequest.prototype.hasQuery = function() {
  return jspb.Message.getField(this, 1) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.InstanceQuery.repeatedFields_ = [1,4];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.InstanceQuery.prototype.toObject = function(opt_includeInstance) {
  return proto.InstanceQuery.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.InstanceQuery} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.InstanceQuery.toObject = function(includeInstance, msg) {
  var f, obj = {
    runtimestatusList: (f = jspb.Message.getRepeatedField(msg, 1)) == null ? undefined : f,
    createdtimefrom: (f = msg.getCreatedtimefrom()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    createdtimeto: (f = msg.getCreatedtimeto()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    taskhubnamesList: jspb.Message.toObjectList(msg.getTaskhubnamesList(),
    google_protobuf_wrappers_pb.StringValue.toObject, includeInstance),
    maxinstancecount: jspb.Message.getFieldWithDefault(msg, 5, 0),
    continuationtoken: (f = msg.getContinuationtoken()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    instanceidprefix: (f = msg.getInstanceidprefix()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f),
    fetchinputsandoutputs: jspb.Message.getBooleanFieldWithDefault(msg, 8, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.InstanceQuery}
 */
proto.InstanceQuery.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.InstanceQuery;
  return proto.InstanceQuery.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.InstanceQuery} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.InstanceQuery}
 */
proto.InstanceQuery.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var values = /** @type {!Array<!proto.OrchestrationStatus>} */ (reader.isDelimited() ? reader.readPackedEnum() : [reader.readEnum()]);
      for (var i = 0; i < values.length; i++) {
        msg.addRuntimestatus(values[i]);
      }
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedtimefrom(value);
      break;
    case 3:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedtimeto(value);
      break;
    case 4:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.addTaskhubnames(value);
      break;
    case 5:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setMaxinstancecount(value);
      break;
    case 6:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setContinuationtoken(value);
      break;
    case 7:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setInstanceidprefix(value);
      break;
    case 8:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setFetchinputsandoutputs(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.InstanceQuery.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.InstanceQuery.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.InstanceQuery} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.InstanceQuery.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRuntimestatusList();
  if (f.length > 0) {
    writer.writePackedEnum(
      1,
      f
    );
  }
  f = message.getCreatedtimefrom();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getCreatedtimeto();
  if (f != null) {
    writer.writeMessage(
      3,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getTaskhubnamesList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      4,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getMaxinstancecount();
  if (f !== 0) {
    writer.writeInt32(
      5,
      f
    );
  }
  f = message.getContinuationtoken();
  if (f != null) {
    writer.writeMessage(
      6,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getInstanceidprefix();
  if (f != null) {
    writer.writeMessage(
      7,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
  f = message.getFetchinputsandoutputs();
  if (f) {
    writer.writeBool(
      8,
      f
    );
  }
};


/**
 * repeated OrchestrationStatus runtimeStatus = 1;
 * @return {!Array<!proto.OrchestrationStatus>}
 */
proto.InstanceQuery.prototype.getRuntimestatusList = function() {
  return /** @type {!Array<!proto.OrchestrationStatus>} */ (jspb.Message.getRepeatedField(this, 1));
};


/**
 * @param {!Array<!proto.OrchestrationStatus>} value
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.setRuntimestatusList = function(value) {
  return jspb.Message.setField(this, 1, value || []);
};


/**
 * @param {!proto.OrchestrationStatus} value
 * @param {number=} opt_index
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.addRuntimestatus = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 1, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.clearRuntimestatusList = function() {
  return this.setRuntimestatusList([]);
};


/**
 * optional google.protobuf.Timestamp createdTimeFrom = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.InstanceQuery.prototype.getCreatedtimefrom = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.InstanceQuery} returns this
*/
proto.InstanceQuery.prototype.setCreatedtimefrom = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.clearCreatedtimefrom = function() {
  return this.setCreatedtimefrom(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.InstanceQuery.prototype.hasCreatedtimefrom = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * optional google.protobuf.Timestamp createdTimeTo = 3;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.InstanceQuery.prototype.getCreatedtimeto = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 3));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.InstanceQuery} returns this
*/
proto.InstanceQuery.prototype.setCreatedtimeto = function(value) {
  return jspb.Message.setWrapperField(this, 3, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.clearCreatedtimeto = function() {
  return this.setCreatedtimeto(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.InstanceQuery.prototype.hasCreatedtimeto = function() {
  return jspb.Message.getField(this, 3) != null;
};


/**
 * repeated google.protobuf.StringValue taskHubNames = 4;
 * @return {!Array<!proto.google.protobuf.StringValue>}
 */
proto.InstanceQuery.prototype.getTaskhubnamesList = function() {
  return /** @type{!Array<!proto.google.protobuf.StringValue>} */ (
    jspb.Message.getRepeatedWrapperField(this, google_protobuf_wrappers_pb.StringValue, 4));
};


/**
 * @param {!Array<!proto.google.protobuf.StringValue>} value
 * @return {!proto.InstanceQuery} returns this
*/
proto.InstanceQuery.prototype.setTaskhubnamesList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 4, value);
};


/**
 * @param {!proto.google.protobuf.StringValue=} opt_value
 * @param {number=} opt_index
 * @return {!proto.google.protobuf.StringValue}
 */
proto.InstanceQuery.prototype.addTaskhubnames = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 4, opt_value, proto.google.protobuf.StringValue, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.clearTaskhubnamesList = function() {
  return this.setTaskhubnamesList([]);
};


/**
 * optional int32 maxInstanceCount = 5;
 * @return {number}
 */
proto.InstanceQuery.prototype.getMaxinstancecount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 5, 0));
};


/**
 * @param {number} value
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.setMaxinstancecount = function(value) {
  return jspb.Message.setProto3IntField(this, 5, value);
};


/**
 * optional google.protobuf.StringValue continuationToken = 6;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.InstanceQuery.prototype.getContinuationtoken = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 6));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.InstanceQuery} returns this
*/
proto.InstanceQuery.prototype.setContinuationtoken = function(value) {
  return jspb.Message.setWrapperField(this, 6, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.clearContinuationtoken = function() {
  return this.setContinuationtoken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.InstanceQuery.prototype.hasContinuationtoken = function() {
  return jspb.Message.getField(this, 6) != null;
};


/**
 * optional google.protobuf.StringValue instanceIdPrefix = 7;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.InstanceQuery.prototype.getInstanceidprefix = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 7));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.InstanceQuery} returns this
*/
proto.InstanceQuery.prototype.setInstanceidprefix = function(value) {
  return jspb.Message.setWrapperField(this, 7, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.clearInstanceidprefix = function() {
  return this.setInstanceidprefix(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.InstanceQuery.prototype.hasInstanceidprefix = function() {
  return jspb.Message.getField(this, 7) != null;
};


/**
 * optional bool fetchInputsAndOutputs = 8;
 * @return {boolean}
 */
proto.InstanceQuery.prototype.getFetchinputsandoutputs = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 8, false));
};


/**
 * @param {boolean} value
 * @return {!proto.InstanceQuery} returns this
 */
proto.InstanceQuery.prototype.setFetchinputsandoutputs = function(value) {
  return jspb.Message.setProto3BooleanField(this, 8, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.QueryInstancesResponse.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.QueryInstancesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.QueryInstancesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.QueryInstancesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.QueryInstancesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    orchestrationstateList: jspb.Message.toObjectList(msg.getOrchestrationstateList(),
    proto.OrchestrationState.toObject, includeInstance),
    continuationtoken: (f = msg.getContinuationtoken()) && google_protobuf_wrappers_pb.StringValue.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.QueryInstancesResponse}
 */
proto.QueryInstancesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.QueryInstancesResponse;
  return proto.QueryInstancesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.QueryInstancesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.QueryInstancesResponse}
 */
proto.QueryInstancesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.OrchestrationState;
      reader.readMessage(value,proto.OrchestrationState.deserializeBinaryFromReader);
      msg.addOrchestrationstate(value);
      break;
    case 2:
      var value = new google_protobuf_wrappers_pb.StringValue;
      reader.readMessage(value,google_protobuf_wrappers_pb.StringValue.deserializeBinaryFromReader);
      msg.setContinuationtoken(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.QueryInstancesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.QueryInstancesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.QueryInstancesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.QueryInstancesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrchestrationstateList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.OrchestrationState.serializeBinaryToWriter
    );
  }
  f = message.getContinuationtoken();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_wrappers_pb.StringValue.serializeBinaryToWriter
    );
  }
};


/**
 * repeated OrchestrationState orchestrationState = 1;
 * @return {!Array<!proto.OrchestrationState>}
 */
proto.QueryInstancesResponse.prototype.getOrchestrationstateList = function() {
  return /** @type{!Array<!proto.OrchestrationState>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.OrchestrationState, 1));
};


/**
 * @param {!Array<!proto.OrchestrationState>} value
 * @return {!proto.QueryInstancesResponse} returns this
*/
proto.QueryInstancesResponse.prototype.setOrchestrationstateList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.OrchestrationState=} opt_value
 * @param {number=} opt_index
 * @return {!proto.OrchestrationState}
 */
proto.QueryInstancesResponse.prototype.addOrchestrationstate = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.OrchestrationState, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.QueryInstancesResponse} returns this
 */
proto.QueryInstancesResponse.prototype.clearOrchestrationstateList = function() {
  return this.setOrchestrationstateList([]);
};


/**
 * optional google.protobuf.StringValue continuationToken = 2;
 * @return {?proto.google.protobuf.StringValue}
 */
proto.QueryInstancesResponse.prototype.getContinuationtoken = function() {
  return /** @type{?proto.google.protobuf.StringValue} */ (
    jspb.Message.getWrapperField(this, google_protobuf_wrappers_pb.StringValue, 2));
};


/**
 * @param {?proto.google.protobuf.StringValue|undefined} value
 * @return {!proto.QueryInstancesResponse} returns this
*/
proto.QueryInstancesResponse.prototype.setContinuationtoken = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.QueryInstancesResponse} returns this
 */
proto.QueryInstancesResponse.prototype.clearContinuationtoken = function() {
  return this.setContinuationtoken(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.QueryInstancesResponse.prototype.hasContinuationtoken = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.PurgeInstancesRequest.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.PurgeInstancesRequest.RequestCase = {
  REQUEST_NOT_SET: 0,
  INSTANCEID: 1,
  PURGEINSTANCEFILTER: 2
};

/**
 * @return {proto.PurgeInstancesRequest.RequestCase}
 */
proto.PurgeInstancesRequest.prototype.getRequestCase = function() {
  return /** @type {proto.PurgeInstancesRequest.RequestCase} */(jspb.Message.computeOneofCase(this, proto.PurgeInstancesRequest.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.PurgeInstancesRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.PurgeInstancesRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PurgeInstancesRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PurgeInstancesRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    instanceid: jspb.Message.getFieldWithDefault(msg, 1, ""),
    purgeinstancefilter: (f = msg.getPurgeinstancefilter()) && proto.PurgeInstanceFilter.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.PurgeInstancesRequest}
 */
proto.PurgeInstancesRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PurgeInstancesRequest;
  return proto.PurgeInstancesRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PurgeInstancesRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PurgeInstancesRequest}
 */
proto.PurgeInstancesRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {string} */ (reader.readString());
      msg.setInstanceid(value);
      break;
    case 2:
      var value = new proto.PurgeInstanceFilter;
      reader.readMessage(value,proto.PurgeInstanceFilter.deserializeBinaryFromReader);
      msg.setPurgeinstancefilter(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.PurgeInstancesRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.PurgeInstancesRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.PurgeInstancesRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PurgeInstancesRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = /** @type {string} */ (jspb.Message.getField(message, 1));
  if (f != null) {
    writer.writeString(
      1,
      f
    );
  }
  f = message.getPurgeinstancefilter();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.PurgeInstanceFilter.serializeBinaryToWriter
    );
  }
};


/**
 * optional string instanceId = 1;
 * @return {string}
 */
proto.PurgeInstancesRequest.prototype.getInstanceid = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 1, ""));
};


/**
 * @param {string} value
 * @return {!proto.PurgeInstancesRequest} returns this
 */
proto.PurgeInstancesRequest.prototype.setInstanceid = function(value) {
  return jspb.Message.setOneofField(this, 1, proto.PurgeInstancesRequest.oneofGroups_[0], value);
};


/**
 * Clears the field making it undefined.
 * @return {!proto.PurgeInstancesRequest} returns this
 */
proto.PurgeInstancesRequest.prototype.clearInstanceid = function() {
  return jspb.Message.setOneofField(this, 1, proto.PurgeInstancesRequest.oneofGroups_[0], undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PurgeInstancesRequest.prototype.hasInstanceid = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional PurgeInstanceFilter purgeInstanceFilter = 2;
 * @return {?proto.PurgeInstanceFilter}
 */
proto.PurgeInstancesRequest.prototype.getPurgeinstancefilter = function() {
  return /** @type{?proto.PurgeInstanceFilter} */ (
    jspb.Message.getWrapperField(this, proto.PurgeInstanceFilter, 2));
};


/**
 * @param {?proto.PurgeInstanceFilter|undefined} value
 * @return {!proto.PurgeInstancesRequest} returns this
*/
proto.PurgeInstancesRequest.prototype.setPurgeinstancefilter = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.PurgeInstancesRequest.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.PurgeInstancesRequest} returns this
 */
proto.PurgeInstancesRequest.prototype.clearPurgeinstancefilter = function() {
  return this.setPurgeinstancefilter(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PurgeInstancesRequest.prototype.hasPurgeinstancefilter = function() {
  return jspb.Message.getField(this, 2) != null;
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.PurgeInstanceFilter.repeatedFields_ = [3];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.PurgeInstanceFilter.prototype.toObject = function(opt_includeInstance) {
  return proto.PurgeInstanceFilter.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PurgeInstanceFilter} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PurgeInstanceFilter.toObject = function(includeInstance, msg) {
  var f, obj = {
    createdtimefrom: (f = msg.getCreatedtimefrom()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    createdtimeto: (f = msg.getCreatedtimeto()) && google_protobuf_timestamp_pb.Timestamp.toObject(includeInstance, f),
    runtimestatusList: (f = jspb.Message.getRepeatedField(msg, 3)) == null ? undefined : f
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.PurgeInstanceFilter}
 */
proto.PurgeInstanceFilter.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PurgeInstanceFilter;
  return proto.PurgeInstanceFilter.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PurgeInstanceFilter} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PurgeInstanceFilter}
 */
proto.PurgeInstanceFilter.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedtimefrom(value);
      break;
    case 2:
      var value = new google_protobuf_timestamp_pb.Timestamp;
      reader.readMessage(value,google_protobuf_timestamp_pb.Timestamp.deserializeBinaryFromReader);
      msg.setCreatedtimeto(value);
      break;
    case 3:
      var values = /** @type {!Array<!proto.OrchestrationStatus>} */ (reader.isDelimited() ? reader.readPackedEnum() : [reader.readEnum()]);
      for (var i = 0; i < values.length; i++) {
        msg.addRuntimestatus(values[i]);
      }
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.PurgeInstanceFilter.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.PurgeInstanceFilter.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.PurgeInstanceFilter} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PurgeInstanceFilter.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getCreatedtimefrom();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getCreatedtimeto();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      google_protobuf_timestamp_pb.Timestamp.serializeBinaryToWriter
    );
  }
  f = message.getRuntimestatusList();
  if (f.length > 0) {
    writer.writePackedEnum(
      3,
      f
    );
  }
};


/**
 * optional google.protobuf.Timestamp createdTimeFrom = 1;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.PurgeInstanceFilter.prototype.getCreatedtimefrom = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 1));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.PurgeInstanceFilter} returns this
*/
proto.PurgeInstanceFilter.prototype.setCreatedtimefrom = function(value) {
  return jspb.Message.setWrapperField(this, 1, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.PurgeInstanceFilter} returns this
 */
proto.PurgeInstanceFilter.prototype.clearCreatedtimefrom = function() {
  return this.setCreatedtimefrom(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PurgeInstanceFilter.prototype.hasCreatedtimefrom = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional google.protobuf.Timestamp createdTimeTo = 2;
 * @return {?proto.google.protobuf.Timestamp}
 */
proto.PurgeInstanceFilter.prototype.getCreatedtimeto = function() {
  return /** @type{?proto.google.protobuf.Timestamp} */ (
    jspb.Message.getWrapperField(this, google_protobuf_timestamp_pb.Timestamp, 2));
};


/**
 * @param {?proto.google.protobuf.Timestamp|undefined} value
 * @return {!proto.PurgeInstanceFilter} returns this
*/
proto.PurgeInstanceFilter.prototype.setCreatedtimeto = function(value) {
  return jspb.Message.setWrapperField(this, 2, value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.PurgeInstanceFilter} returns this
 */
proto.PurgeInstanceFilter.prototype.clearCreatedtimeto = function() {
  return this.setCreatedtimeto(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.PurgeInstanceFilter.prototype.hasCreatedtimeto = function() {
  return jspb.Message.getField(this, 2) != null;
};


/**
 * repeated OrchestrationStatus runtimeStatus = 3;
 * @return {!Array<!proto.OrchestrationStatus>}
 */
proto.PurgeInstanceFilter.prototype.getRuntimestatusList = function() {
  return /** @type {!Array<!proto.OrchestrationStatus>} */ (jspb.Message.getRepeatedField(this, 3));
};


/**
 * @param {!Array<!proto.OrchestrationStatus>} value
 * @return {!proto.PurgeInstanceFilter} returns this
 */
proto.PurgeInstanceFilter.prototype.setRuntimestatusList = function(value) {
  return jspb.Message.setField(this, 3, value || []);
};


/**
 * @param {!proto.OrchestrationStatus} value
 * @param {number=} opt_index
 * @return {!proto.PurgeInstanceFilter} returns this
 */
proto.PurgeInstanceFilter.prototype.addRuntimestatus = function(value, opt_index) {
  return jspb.Message.addToRepeatedField(this, 3, value, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.PurgeInstanceFilter} returns this
 */
proto.PurgeInstanceFilter.prototype.clearRuntimestatusList = function() {
  return this.setRuntimestatusList([]);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.PurgeInstancesResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.PurgeInstancesResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.PurgeInstancesResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PurgeInstancesResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
    deletedinstancecount: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.PurgeInstancesResponse}
 */
proto.PurgeInstancesResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.PurgeInstancesResponse;
  return proto.PurgeInstancesResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.PurgeInstancesResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.PurgeInstancesResponse}
 */
proto.PurgeInstancesResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setDeletedinstancecount(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.PurgeInstancesResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.PurgeInstancesResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.PurgeInstancesResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.PurgeInstancesResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getDeletedinstancecount();
  if (f !== 0) {
    writer.writeInt32(
      1,
      f
    );
  }
};


/**
 * optional int32 deletedInstanceCount = 1;
 * @return {number}
 */
proto.PurgeInstancesResponse.prototype.getDeletedinstancecount = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};


/**
 * @param {number} value
 * @return {!proto.PurgeInstancesResponse} returns this
 */
proto.PurgeInstancesResponse.prototype.setDeletedinstancecount = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.CreateTaskHubRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.CreateTaskHubRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.CreateTaskHubRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateTaskHubRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
    recreateifexists: jspb.Message.getBooleanFieldWithDefault(msg, 1, false)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.CreateTaskHubRequest}
 */
proto.CreateTaskHubRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CreateTaskHubRequest;
  return proto.CreateTaskHubRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.CreateTaskHubRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.CreateTaskHubRequest}
 */
proto.CreateTaskHubRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setRecreateifexists(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.CreateTaskHubRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.CreateTaskHubRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.CreateTaskHubRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateTaskHubRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getRecreateifexists();
  if (f) {
    writer.writeBool(
      1,
      f
    );
  }
};


/**
 * optional bool recreateIfExists = 1;
 * @return {boolean}
 */
proto.CreateTaskHubRequest.prototype.getRecreateifexists = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 1, false));
};


/**
 * @param {boolean} value
 * @return {!proto.CreateTaskHubRequest} returns this
 */
proto.CreateTaskHubRequest.prototype.setRecreateifexists = function(value) {
  return jspb.Message.setProto3BooleanField(this, 1, value);
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.CreateTaskHubResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.CreateTaskHubResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.CreateTaskHubResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateTaskHubResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.CreateTaskHubResponse}
 */
proto.CreateTaskHubResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CreateTaskHubResponse;
  return proto.CreateTaskHubResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.CreateTaskHubResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.CreateTaskHubResponse}
 */
proto.CreateTaskHubResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.CreateTaskHubResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.CreateTaskHubResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.CreateTaskHubResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CreateTaskHubResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.DeleteTaskHubRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.DeleteTaskHubRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.DeleteTaskHubRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.DeleteTaskHubRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.DeleteTaskHubRequest}
 */
proto.DeleteTaskHubRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.DeleteTaskHubRequest;
  return proto.DeleteTaskHubRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.DeleteTaskHubRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.DeleteTaskHubRequest}
 */
proto.DeleteTaskHubRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.DeleteTaskHubRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.DeleteTaskHubRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.DeleteTaskHubRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.DeleteTaskHubRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.DeleteTaskHubResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.DeleteTaskHubResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.DeleteTaskHubResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.DeleteTaskHubResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.DeleteTaskHubResponse}
 */
proto.DeleteTaskHubResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.DeleteTaskHubResponse;
  return proto.DeleteTaskHubResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.DeleteTaskHubResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.DeleteTaskHubResponse}
 */
proto.DeleteTaskHubResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.DeleteTaskHubResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.DeleteTaskHubResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.DeleteTaskHubResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.DeleteTaskHubResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.GetWorkItemsRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.GetWorkItemsRequest.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.GetWorkItemsRequest} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GetWorkItemsRequest.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.GetWorkItemsRequest}
 */
proto.GetWorkItemsRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.GetWorkItemsRequest;
  return proto.GetWorkItemsRequest.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.GetWorkItemsRequest} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.GetWorkItemsRequest}
 */
proto.GetWorkItemsRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.GetWorkItemsRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.GetWorkItemsRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.GetWorkItemsRequest} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.GetWorkItemsRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};



/**
 * Oneof group definitions for this message. Each group defines the field
 * numbers belonging to that group. When of these fields' value is set, all
 * other fields in the group are cleared. During deserialization, if multiple
 * fields are encountered for a group, only the last value seen will be kept.
 * @private {!Array<!Array<number>>}
 * @const
 */
proto.WorkItem.oneofGroups_ = [[1,2]];

/**
 * @enum {number}
 */
proto.WorkItem.RequestCase = {
  REQUEST_NOT_SET: 0,
  ORCHESTRATORREQUEST: 1,
  ACTIVITYREQUEST: 2
};

/**
 * @return {proto.WorkItem.RequestCase}
 */
proto.WorkItem.prototype.getRequestCase = function() {
  return /** @type {proto.WorkItem.RequestCase} */(jspb.Message.computeOneofCase(this, proto.WorkItem.oneofGroups_[0]));
};



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.WorkItem.prototype.toObject = function(opt_includeInstance) {
  return proto.WorkItem.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.WorkItem} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.WorkItem.toObject = function(includeInstance, msg) {
  var f, obj = {
    orchestratorrequest: (f = msg.getOrchestratorrequest()) && proto.OrchestratorRequest.toObject(includeInstance, f),
    activityrequest: (f = msg.getActivityrequest()) && proto.ActivityRequest.toObject(includeInstance, f)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.WorkItem}
 */
proto.WorkItem.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.WorkItem;
  return proto.WorkItem.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.WorkItem} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.WorkItem}
 */
proto.WorkItem.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.OrchestratorRequest;
      reader.readMessage(value,proto.OrchestratorRequest.deserializeBinaryFromReader);
      msg.setOrchestratorrequest(value);
      break;
    case 2:
      var value = new proto.ActivityRequest;
      reader.readMessage(value,proto.ActivityRequest.deserializeBinaryFromReader);
      msg.setActivityrequest(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.WorkItem.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.WorkItem.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.WorkItem} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.WorkItem.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getOrchestratorrequest();
  if (f != null) {
    writer.writeMessage(
      1,
      f,
      proto.OrchestratorRequest.serializeBinaryToWriter
    );
  }
  f = message.getActivityrequest();
  if (f != null) {
    writer.writeMessage(
      2,
      f,
      proto.ActivityRequest.serializeBinaryToWriter
    );
  }
};


/**
 * optional OrchestratorRequest orchestratorRequest = 1;
 * @return {?proto.OrchestratorRequest}
 */
proto.WorkItem.prototype.getOrchestratorrequest = function() {
  return /** @type{?proto.OrchestratorRequest} */ (
    jspb.Message.getWrapperField(this, proto.OrchestratorRequest, 1));
};


/**
 * @param {?proto.OrchestratorRequest|undefined} value
 * @return {!proto.WorkItem} returns this
*/
proto.WorkItem.prototype.setOrchestratorrequest = function(value) {
  return jspb.Message.setOneofWrapperField(this, 1, proto.WorkItem.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.WorkItem} returns this
 */
proto.WorkItem.prototype.clearOrchestratorrequest = function() {
  return this.setOrchestratorrequest(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.WorkItem.prototype.hasOrchestratorrequest = function() {
  return jspb.Message.getField(this, 1) != null;
};


/**
 * optional ActivityRequest activityRequest = 2;
 * @return {?proto.ActivityRequest}
 */
proto.WorkItem.prototype.getActivityrequest = function() {
  return /** @type{?proto.ActivityRequest} */ (
    jspb.Message.getWrapperField(this, proto.ActivityRequest, 2));
};


/**
 * @param {?proto.ActivityRequest|undefined} value
 * @return {!proto.WorkItem} returns this
*/
proto.WorkItem.prototype.setActivityrequest = function(value) {
  return jspb.Message.setOneofWrapperField(this, 2, proto.WorkItem.oneofGroups_[0], value);
};


/**
 * Clears the message field making it undefined.
 * @return {!proto.WorkItem} returns this
 */
proto.WorkItem.prototype.clearActivityrequest = function() {
  return this.setActivityrequest(undefined);
};


/**
 * Returns whether this field is set.
 * @return {boolean}
 */
proto.WorkItem.prototype.hasActivityrequest = function() {
  return jspb.Message.getField(this, 2) != null;
};





if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.CompleteTaskResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.CompleteTaskResponse.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.CompleteTaskResponse} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CompleteTaskResponse.toObject = function(includeInstance, msg) {
  var f, obj = {

  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.CompleteTaskResponse}
 */
proto.CompleteTaskResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CompleteTaskResponse;
  return proto.CompleteTaskResponse.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.CompleteTaskResponse} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.CompleteTaskResponse}
 */
proto.CompleteTaskResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.CompleteTaskResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.CompleteTaskResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.CompleteTaskResponse} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.CompleteTaskResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};


/**
 * @enum {number}
 */
proto.OrchestrationStatus = {
  ORCHESTRATION_STATUS_RUNNING: 0,
  ORCHESTRATION_STATUS_COMPLETED: 1,
  ORCHESTRATION_STATUS_CONTINUED_AS_NEW: 2,
  ORCHESTRATION_STATUS_FAILED: 3,
  ORCHESTRATION_STATUS_CANCELED: 4,
  ORCHESTRATION_STATUS_TERMINATED: 5,
  ORCHESTRATION_STATUS_PENDING: 6,
  ORCHESTRATION_STATUS_SUSPENDED: 7
};

goog.object.extend(exports, proto);

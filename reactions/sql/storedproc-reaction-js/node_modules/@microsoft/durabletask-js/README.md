# DurableTask Javascript

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This repo contains a Javascript client SDK for use with the [Durable Task Framework for Go](https://github.com/microsoft/durabletask-go) and [Dapr Workflow](https://docs.dapr.io/developing-applications/building-blocks/workflow/workflow-overview/). With this SDK, you can define, schedule, and manage durable orchestrations using ordinary Javascript code.

> This SDK is currently under active development and is not yet ready for production use.

Note that this project is **not** currently affiliated with the [Durable Functions](https://docs.microsoft.com/azure/azure-functions/durable/durable-functions-overview) project for Azure Functions.

⚠️ **This SDK is currently under active development and is not yet ready for production use.** ⚠️

## Supported patterns

The following orchestration patterns are currently supported.

### Function chaining

An orchestration can chain a sequence of function calls using the following syntax:

```typescript
function hello(ctx: ActivityContext, name: string): string {
  return `Hello ${name}!`;
}

const sequence: TOrchestrator = async function* (ctx: OrchestrationContext): any {
  const cities = [];

  const result1 = yield ctx.callActivity(hello, "Tokyo");
  cities.push(result1);
  const result2 = yield ctx.callActivity(hello, "Seatle");
  cities.push(result2);
  const result3 = yield ctx.callActivity(hello, "London");
  cities.push(result3);

  return cities;
};
```

You can find the full sample [here](./examples/activity-sequence.ts).

### Fan-out/fan-in

An orchestration can fan-out a dynamic number of function calls in parallel and then fan-in the results using the following syntax:

```typescript
# activity function for getting the list of work items
function getWorkItems (ctx: ActivityContext): string[] {
    //...
}

function processWorkItem(ctx: ActivityContext): number {
    //...
}

const orchestrator: TOrchestrator = async function* (ctx: OrchestrationContext): any {
    const tasks = [];
    const workItems = yield ctx.callActivity(getWorkItems);
    for (const workItem of workItems) {
    tasks.push(ctx.callActivity(processWorkItem, workItem));
    }
    const results = yield whenAll(tasks);
    return results
}
```

You can find the full sample [here](./examples/fanout-fanin.ts).

### Human interaction and durable timers

An orchestration can wait for a user-defined event, such as a human approval event, before proceding to the next step. In addition, the orchestration can create a timer with an arbitrary duration that triggers some alternate action if the external event hasn't been received:

```typescript
const orchestrator: TOrchestrator = async function* (ctx: OrchestrationContext, order: Order): any {
  if (order.cost < 1000) {
    return "Auto-approvied";
  }

  yield ctx.callActivity(sendApprovalRequest, order);
  const approvalEvent = ctx.waitForExternalEvent("approval_received");
  const timerEvent = ctx.createTimer(10 * 60);
  const winner = yield whenAny([approvalEvent, timerEvent]);
  if (winner == timerEvent) {
    return "Canceled";
  }

  ctx.callActivity(placeOrder, order);
  const approvalDetails = approvalEvent.getResult();
  return `Approved by ${approvalDetails.approver}`;
};
```

As an aside, you'll also notice that the example orchestration above works with custom business objects. Support for custom business objects includes support for custom classes, custom data classes, and named tuples. Serialization and deserialization of these objects is handled automatically by the SDK.

You can find the full sample [here](./examples/human_interaction.ts).

## Feature overview

The following features are currently supported:

### Orchestrations

Orchestrations are implemented using ordinary Python functions that take an `OrchestrationContext` as their first parameter. The `OrchestrationContext` provides APIs for starting child orchestrations, scheduling activities, and waiting for external events, among other things. Orchestrations are fault-tolerant and durable, meaning that they can automatically recover from failures and rebuild their local execution state. Orchestrator functions must be deterministic, meaning that they must always produce the same output given the same input.

### Activities

Activities are implemented using ordinary Python functions that take an `ActivityContext` as their first parameter. Activity functions are scheduled by orchestrations and have at-least-once execution guarantees, meaning that they will be executed at least once but may be executed multiple times in the event of a transient failure. Activity functions are where the real "work" of any orchestration is done.

### Durable timers

Orchestrations can schedule durable timers using the `create_timer` API. These timers are durable, meaning that they will survive orchestrator restarts and will fire even if the orchestrator is not actively in memory. Durable timers can be of any duration, from milliseconds to months.

### Sub-orchestrations

Orchestrations can start child orchestrations using the `call_sub_orchestrator` API. Child orchestrations are useful for encapsulating complex logic and for breaking up large orchestrations into smaller, more manageable pieces.

### External events

Orchestrations can wait for external events using the `wait_for_external_event` API. External events are useful for implementing human interaction patterns, such as waiting for a user to approve an order before continuing.

### Continue-as-new

Orchestrations can be continued as new using the `continue_as_new` API. This API allows an orchestration to restart itself from scratch, optionally with a new input.

### Suspend, resume, and terminate

Orchestrations can be suspended using the `suspend_orchestration` client API and will remain suspended until resumed using the `resume_orchestration` client API. A suspended orchestration will stop processing new events, but will continue to buffer any that happen to arrive until resumed, ensuring that no data is lost. An orchestration can also be terminated using the `terminate_orchestration` client API. Terminated orchestrations will stop processing new events and will discard any buffered events.

### Retry policies (TODO)

Orchestrations can specify retry policies for activities and sub-orchestrations. These policies control how many times and how frequently an activity or sub-orchestration will be retried in the event of a transient error.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Durable Task-compatible sidecar, like [Dapr Workflow](https://docs.dapr.io/developing-applications/building-blocks/workflow/workflow-overview/)

### Run the samples

See the [examples](./examples) directory for a list of sample orchestrations and instructions on how to run them.

## Development

### Generating protobufs

Protobuf definitions are stored in the [./submodules/durabletask-proto](./submodules/durabletask-proto) directory, which is a submodule. To update the submodule, run the following command from the project root:

```sh
git submodule update --init
```

Once the submodule is available, the corresponding source code can be regenerated using the following command from the project root:

```sh
npm install grpc_tools_node_protoc_ts --save-dev

# generate js codes via grpc-tools
grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:src/proto \
--grpc_out=grpc_js:src/proto \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I ./submodules/durabletask-protobuf/protos orchestrator_service.proto

protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=grpc_js:src/proto \
-I ./submodules/durabletask-protobuf/protos orchestrator_service.proto
```

### Running unit tests

Unit tests can be run using the following command from the project root. Unit tests _don't_ require a sidecar process to be running.

```sh
npm run test:unit
```

### Running E2E tests

To run the E2E tests, run the following command from the project root:

```sh
npm run test:e2e
```

This command will start a durabletask sidecar docker container (cgillum/durabletask-sidecar:latest).

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.

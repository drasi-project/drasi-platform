# Running tests

## Types of tests

We apply the [testing pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) to divide our tests into groups for each feature.

- Unit tests: exercise functions and types directly
- Integration tests: exercise features working with dependencies
- Functional test (also called end-to-end tests): exercise features in realistic user scenarios

## Unit tests

Unit tests can be run with the following command:

```sh
make test
```

We require unit tests to be added for new code as well as when making fixes or refactors in existing code. As a basic rule, ideally every PR contains some additions or changes to tests.

Unit tests should run with only the [basic prerequisites](../contributing-code-prerequisites/) installed. Do not add external dependencies needed for unit tests, prefer integration tests in those cases.

## Integration tests

> 🚧🚧🚧 Under Construction 🚧🚧🚧
>
> We don't currently define targets for integration tests. However we **do** have tests that require optional dependencies, and thus should be moved from the unit test category to the integration tests.

## Functional tests

In the [e2e tests folder](../../../../e2e-tests/) we hold tests for end to end scenarios. These tests will spin up a new Kind cluster named `drasi-test`, install a clean instance of Drasi inside it and deploy any additional resources needed per scenario. For example, the `simple-scenario` tests will also deploy a PostgreSQL instance and populate it with data, deploy a Drasi Source, Continuous Query and Reaction, and then proceed to manipulate the PostgreSQL data and watch for the changes flowing from the Reaction to make test assertions against. Once it is complete, it does not tear down the Kind cluster by default, to allow you to inspect the state of things.

These test are built with the Jest framework and can be run using the command:

```
npm test
```

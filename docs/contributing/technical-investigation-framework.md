# Technical Investigation Framework for Drasi Issues

This document provides a structured framework for conducting technical investigations of issues in the Drasi platform.

## Overview

Drasi is a data processing platform with three core components:
- **Sources**: Connect to data repositories to monitor changes
- **Continuous Queries**: Evaluate changes using Cypher Query Language
- **Reactions**: Trigger responses based on query result updates

## Repository Structure

```
drasi-platform/
├── cli/                    # Command-line interface
├── sources/                # Data source connectors
│   ├── cosmosdb/
│   ├── dataverse/
│   ├── eventhub/
│   ├── kubernetes/
│   ├── relational/
│   └── sdk/
├── query-container/        # Query processing engine
│   ├── publish-api/
│   ├── query-host/
│   └── view-svc/
├── reactions/              # Reaction implementations
│   ├── aws/
│   ├── azure/
│   ├── dapr/
│   ├── debezium/
│   ├── gremlin/
│   ├── http/
│   ├── signalr/
│   └── sdk/
├── control-planes/         # Control plane implementations
├── infrastructure/         # Infrastructure components
└── e2e-tests/             # End-to-end tests
```

## Investigation Process

### 1. Code Exploration and Problem Localization

#### For Source-Related Issues
- **Entry Points**: Check `sources/[type]/` directories
- **SDK Location**: `sources/sdk/` contains shared source functionality
- **Configuration**: Look for YAML/JSON configuration files
- **Key Files to Review**:
  - Source implementation files
  - Change feed processors
  - Data mappers and transformers

#### For Query-Related Issues
- **Entry Points**: `query-container/query-host/`
- **API Layer**: `query-container/publish-api/`
- **View Service**: `query-container/view-svc/`
- **Key Technologies**: Rust-based implementation (Cargo.toml, .rs files)
- **Key Concepts**:
  - Continuous query evaluation
  - Result set management
  - Change detection and propagation

#### For Reaction-Related Issues
- **Entry Points**: `reactions/[type]/` directories
- **SDK Location**: `reactions/sdk/` contains shared reaction functionality
- **Key Files to Review**:
  - Reaction handlers
  - Output formatters
  - Integration points with external systems

#### For CLI Issues
- **Entry Points**: `cli/cmd/` and `cli/main.go`
- **API Integration**: `cli/api/`
- **Configuration**: `cli/config/`
- **Technologies**: Go-based implementation

### 2. Reference Material Gathering

#### Code References
- **Tests**: Look in corresponding test directories (e.g., `*_test.go`, `*_test.rs`)
- **Examples**: Check `e2e-tests/` for real-world usage examples
- **Makefile**: Build and test commands are defined in component Makefiles

#### Documentation
- **Main Docs**: https://drasi.io
- **Contributing Guide**: `/docs/contributing/`
- **Component READMEs**: Each major component has a README.md

#### External Resources
- **Language-Specific**:
  - Go components: Check `go.mod` for dependencies
  - Rust components: Check `Cargo.toml` for dependencies
- **Kubernetes**: Many components run on Kubernetes

### 3. Behavior Analysis Template

When investigating an issue, document:

**Expected Behavior:**
- What should happen according to documentation
- What the code appears designed to do
- What tests indicate should occur

**Current Behavior:**
- What actually happens
- Error messages or unexpected outputs
- Reproduction steps

**Behavior Delta:**
- Specific differences between expected and actual
- Conditions triggering the issue
- Edge cases

### 4. Impact Assessment Guidelines

**Scope Analysis:**
- User Impact: How many users/use cases affected?
- Feature Dependencies: Which features depend on this?
- Blocking Issues: Does this prevent other functionality?

**Criticality Factors:**
- **Critical**: Data loss, security vulnerability, complete system failure
- **High**: Major feature broken, significant performance degradation
- **Medium**: Feature partially broken, workaround available
- **Low**: Minor issue, cosmetic problem, edge case

### 5. Cross-Cutting Concerns Checklist

- [ ] Check for similar patterns in other components
- [ ] Review dependencies and dependent modules
- [ ] Search for related past issues
- [ ] Check for architectural implications
- [ ] Consider backward compatibility
- [ ] Identify technical debt

## Common Issue Patterns

### Source Issues
- Connection failures
- Change detection delays
- Data mapping errors
- Schema evolution problems

### Query Issues
- Incorrect result sets
- Performance degradation
- Memory issues
- Cypher query parsing errors

### Reaction Issues
- Trigger failures
- Output formatting problems
- Integration errors with external systems
- Rate limiting or throttling

### CLI Issues
- Command parsing errors
- Configuration problems
- API communication failures
- Installation/deployment issues

## Investigation Report Template

```markdown
# Technical Investigation: [Issue Title]

## Issue Summary
- **Issue Number**: #XXX
- **Component**: [Source/Query/Reaction/CLI/Infrastructure]
- **Severity**: [Critical/High/Medium/Low]
- **Reporter**: [Username]

## 1. Problem Localization

**Primary Location**: `[file:line]` - [explanation]

**Secondary Locations**:
- `[file:line]` - [explanation]
- `[file:line]` - [explanation]

**Data Flow Path**:
1. [Entry point]
2. [Processing step]
3. [Output/error point]

## 2. Root Cause Hypothesis

Based on code inspection:
[Technical explanation of potential root cause]

**Evidence**:
- [Code snippet or log excerpt]
- [Related error messages]

## 3. Expected vs Actual Behavior

**Expected**:
[What should happen]

**Actual**:
[What currently happens]

**Trigger Conditions**:
[When/how this occurs]

## 4. Relevant References

**Code**:
- [Link to primary function/class]
- [Link to related tests]
- [Link to configuration]

**Documentation**:
- [Link to relevant docs]
- [Link to API reference]

**Related Issues/PRs**:
- [Links to similar problems]
- [Links to related features]

## 5. Impact Analysis

**Severity**: [Critical/High/Medium/Low]

**Justification**:
[Why this severity level]

**Scope**:
- Affected users: [estimate]
- Affected features: [list]
- Blocking issues: [list]

**Risk Areas**:
- [What could break with a fix]
- [Backward compatibility concerns]
- [Performance implications]

## 6. Similar Patterns Found

**Other Components with Similar Code**:
- `[file:line]` - [similarity description]

**Potential for Same Issue Elsewhere**: [Yes/No]
[Explanation]

## 7. Technical Context for Developers

**Key Functions to Review**:
1. `[function_name]` in `[file]` - [purpose]
2. `[function_name]` in `[file]` - [purpose]

**Relevant Design Patterns**:
[Explain patterns used in this area]

**Potential Gotchas**:
- [Warning about tricky aspects]
- [Common pitfalls]

**Suggested Investigation Steps**:
1. [First step - what to check/test]
2. [Second step]
3. [Third step]

**Testing Strategy**:
- Unit tests to add: [description]
- Integration tests needed: [description]
- Manual testing approach: [description]

## 8. Broader Implications

**Architectural Considerations**:
[How this relates to overall architecture]

**Technical Debt**:
[Any related technical debt that should be addressed]

**Opportunities for Improvement**:
[Beyond just fixing the bug, what could be improved]
```

## Tools and Commands

### Building Components
```bash
# Build all
make build

# Build specific component
cd [component-dir]
make build
```

### Running Tests
```bash
# Run all tests
make test

# Component-specific tests
cd [component-dir]
make test
```

### Linting
```bash
# Go components
go fmt ./...
go vet ./...

# Rust components
cargo fmt
cargo clippy
```

## Key Files for Investigation

- **Makefiles**: Build and test commands
- **go.mod/Cargo.toml**: Dependencies
- **README.md files**: Component documentation
- **Test files**: Understanding expected behavior
- **.github/workflows/**: CI/CD pipelines
- **config/ directories**: Configuration schemas

## Getting Help

- [Discord Server](https://aka.ms/drasidiscord)
- [GitHub Issues](https://github.com/drasi-project/drasi-platform/issues)
- [Documentation](https://drasi.io)

## Contributing Investigation Results

When submitting investigation findings:
1. Use the investigation report template
2. Include code references with line numbers
3. Provide reproduction steps if applicable
4. Link to related issues and PRs
5. Suggest next steps for developers

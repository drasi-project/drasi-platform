# Research Folder Documentation

**Purpose:** This file should be moved to `/research/README.md` once the directory is created.

---

# Drasi Platform - Issue Investigations

This folder contains technical investigations of issues reported in the drasi-project/drasi-platform repository.

## Structure

Each issue investigation should include:

1. **Investigation Report** - Main technical analysis
   - File: `issue-[number]-investigation.md`
   - Contents: Complete technical investigation following the framework
   
2. **Supporting Documents** (as needed)
   - `issue-[number]-reproduction.md` - Steps to reproduce
   - `issue-[number]-code-analysis.md` - Detailed code analysis
   - `issue-[number]-test-plan.md` - Testing strategy
   - `issue-[number]-fix-recommendations.md` - Proposed solutions

## Investigation Framework

All investigations should follow the standard framework which includes:

1. **Problem Localization** - Where the issue originates
2. **Root Cause Hypothesis** - Technical explanation of what's wrong
3. **Expected vs Actual Behavior** - Behavior delta analysis
4. **Relevant References** - Code, docs, and related issues
5. **Impact Analysis** - Severity, scope, and risk assessment
6. **Similar Patterns Found** - Cross-cutting concerns
7. **Technical Context** - Key information for developers
8. **Investigation Steps** - Recommended next steps

## Current Investigations

### Issue #345
- **Status:** Framework prepared, awaiting issue details
- **Files:**
  - Framework: `/ISSUE-345-INVESTIGATION-FRAMEWORK.md` (pending move to this folder)
  - Initial notes: `/INVESTIGATION_NOTE.md` (pending move to this folder)

## How to Use This Folder

### For Investigators

When assigned to investigate an issue:

1. Read the issue thoroughly
2. Create `issue-[number]-investigation.md` using the framework template
3. Follow the investigation workflow in the framework
4. Document all findings
5. Update this README with the investigation status

### For Developers

When implementing a fix:

1. Review the investigation report for the issue
2. Follow the recommended investigation steps
3. Use the identified code locations as starting points
4. Refer to the impact analysis for testing scope
5. Check similar patterns to ensure comprehensive fix

### For Reviewers

When reviewing a fix:

1. Verify root cause was correctly identified
2. Check that similar patterns were addressed
3. Ensure test plan was followed
4. Validate impact assessment was correct
5. Confirm no regressions introduced

## Templates

### Investigation Report Template

See `/ISSUE-345-INVESTIGATION-FRAMEWORK.md` section "Investigation Framework" for complete templates.

### Quick Start Template

```markdown
# Issue #[NUMBER] Investigation

**Issue URL:** https://github.com/drasi-project/drasi-platform/issues/[NUMBER]
**Date:** YYYY-MM-DD
**Investigator:** [Name]
**Status:** [In Progress/Complete]

## Summary
[Brief description of the issue]

## Problem Localization
**Primary Location:** [file:line] - [description]
**Affected Components:** [list]

## Root Cause
[Technical explanation]

## Expected vs Actual Behavior
**Expected:** [what should happen]
**Actual:** [what happens]
**Trigger:** [conditions]

## Impact
**Severity:** [Critical/High/Medium/Low]
**Scope:** [who is affected]
**Risks:** [what could break]

## Similar Patterns
[Other code with same issue]

## Recommendations
[Next steps for fix]

## References
- Code: [links]
- Tests: [links]
- Docs: [links]
- Related: [issues/PRs]
```

## Build and Test Commands

### Building Drasi
```sh
# Build all components
make docker-build

# Build with specific version
make docker-build DOCKER_TAG_VERSION="v1"

# Build debug images
make docker-build BUILD_CONFIG=debug

# Build specific component
cd control-planes && make docker-build
cd query-container && make docker-build
cd sources && make docker-build
cd reactions && make docker-build
```

### Running Tests
```sh
# Unit tests
make test

# E2E tests (requires Kind cluster)
cd e2e-tests && npm test

# Lint check
make lint-check
```

### Local Development
```sh
# Load images to Kind cluster
make kind-load

# Load images to K3d cluster
make k3d-load CLUSTER_NAME="my-cluster"

# Initialize Drasi locally
drasi init --local --version latest

# Check status
kubectl get pods --namespace drasi-system

# Uninstall
drasi uninstall
```

## Useful Resources

### Documentation
- **Main Site:** https://drasi.io
- **Docs Repo:** https://github.com/drasi-project/docs
- **Contributing:** `/CONTRIBUTING.md`
- **Build Guide:** `/docs/contributing/contributing-code/contributing-code-building/`
- **Test Guide:** `/docs/contributing/contributing-code/contributing-code-tests/`

### Community
- **Discord:** https://aka.ms/drasidiscord
- **Community Repo:** https://github.com/drasi-project/community
- **Email:** info@drasi.io

### Codebase Structure
```
drasi-platform/
├── control-planes/   # Management API & Resource Provider
├── query-container/  # Query processing (Rust)
├── sources/          # Data source connectors
├── reactions/        # Reaction handlers
├── cli/              # Command-line tools
├── e2e-tests/        # End-to-end tests
└── docs/             # Contributing documentation
```

## Common Issue Types by Component

### Sources (`/sources/`)
- Connection failures
- Authentication issues
- Change detection problems
- Data format mismatches
- Performance issues

### Query Container (`/query-container/`)
- Cypher parsing errors
- Query evaluation issues
- Performance degradation
- Memory leaks
- State management bugs

### Reactions (`/reactions/`)
- Trigger failures
- Data transformation errors
- External service issues
- Rate limiting
- Error handling gaps

### Control Plane (`/control-planes/`)
- Resource provisioning failures
- API errors
- Kubernetes integration issues
- Configuration validation

### CLI (`/cli/`)
- Command parsing errors
- Config file handling
- API communication issues
- UX problems

## Investigation Workflow

1. **Understand** (30 min) - Read issue, comments, labels
2. **Reproduce** (1-2 hrs) - Set up environment, verify issue
3. **Localize** (2-4 hrs) - Find code paths, add logging
4. **Analyze** (2-4 hrs) - Trace execution, identify root cause
5. **Assess** (1 hr) - Determine severity, scope, impact
6. **Document** (1 hr) - Complete investigation report

## Contributing to Investigations

To add or update an investigation:

1. Create or update the investigation file
2. Follow the standard framework
3. Update this README with status
4. Commit with clear message: `Add/Update investigation for issue #[NUMBER]`
5. Reference the issue in commit: `Relates to #[NUMBER]`

## Questions?

- Join our Discord: https://aka.ms/drasidiscord
- Check the Community repo: https://github.com/drasi-project/community
- Email: info@drasi.io

---

**Note:** This README is currently at the repository root. It should be moved to `/research/README.md` once that directory is created.

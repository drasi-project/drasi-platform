# Action Plan: Complete Issue #345 Investigation

**Created:** 2025-11-20  
**Status:** Awaiting tool access  
**Required Tools:** bash, gh, make, cargo

---

## Current Status Summary

### ✅ Completed
1. Repository structure fully explored and documented
2. Drasi platform architecture analyzed and mapped
3. Comprehensive investigation framework created (15KB+)
4. Research folder README prepared
5. Build and test commands documented
6. Investigation templates created
7. Tool limitations clearly documented

### ⏳ Blocked - Awaiting Tools
1. Cannot create `/research` directory (need bash/mkdir)
2. Cannot retrieve issue #345 details (need bash/gh CLI)
3. Cannot build the codebase (need bash/make/cargo)
4. Cannot run tests (need bash)
5. Cannot explore runtime behavior (need bash)

---

## Step-by-Step Completion Plan

### Phase 1: Setup (5 minutes)

Once bash access is available:

```bash
cd /home/runner/work/drasi-platform/drasi-platform

# 1. Create research directory
mkdir -p research

# 2. Move prepared files
mv ISSUE-345-INVESTIGATION-FRAMEWORK.md research/issue-345-investigation.md
mv RESEARCH-README.md research/README.md
mv INVESTIGATION_NOTE.md research/investigation-notes.md

# 3. Clean up root directory (these were temporary due to tool limitations)
git rm ISSUE-345-INVESTIGATION-FRAMEWORK.md RESEARCH-README.md INVESTIGATION_NOTE.md THIS-FILE.md
```

### Phase 2: Retrieve Issue Details (10 minutes)

```bash
# Retrieve issue #345 from GitHub
gh issue view 345 --json title,body,comments,labels,author,createdAt,state > research/issue-345-raw.json

# Also get formatted view for easier reading
gh issue view 345 > research/issue-345-details.txt

# Check for related PRs
gh pr list --search "345" --json number,title,state,url > research/issue-345-related-prs.json

# Check for similar issues
gh issue list --search "is:issue" --json number,title,labels,state --limit 50 > research/recent-issues.json
```

### Phase 3: Update Investigation Report (30 minutes)

Edit `research/issue-345-investigation.md`:

```bash
# Extract key information from issue
ISSUE_TITLE=$(cat research/issue-345-raw.json | jq -r '.title')
ISSUE_BODY=$(cat research/issue-345-raw.json | jq -r '.body')
ISSUE_LABELS=$(cat research/issue-345-raw.json | jq -r '.labels[].name')

# Update the investigation file with actual issue details
# Replace placeholder sections with:
# - Actual issue title and description
# - Reported symptoms and errors
# - Reproduction steps (if provided)
# - User comments and discussion points
# - Labels and categorization
```

Manual steps:
1. Read through issue details carefully
2. Fill in "Problem Localization" section based on issue description
3. Fill in "Expected vs Actual Behavior" section
4. Update "Impact Analysis" with severity assessment
5. Note any error messages or logs provided
6. Document reproduction steps if available

### Phase 4: Explore Affected Code (1-2 hours)

Based on issue details, identify the affected component(s):

```bash
# If issue is about Sources
cd sources
ls -la
# Explore relevant source connector

# If issue is about Query Container
cd query-container
cargo tree  # Check dependencies
find . -name "*.rs" | head -20  # List Rust files

# If issue is about Reactions
cd reactions
ls -la
# Explore relevant reaction handler

# If issue is about Control Plane
cd control-planes
ls -la
# Explore management API or resource provider

# If issue is about CLI
cd cli
ls -la
# Explore CLI code
```

Search for relevant code:
```bash
# Search for error messages from the issue
grep -r "error message from issue" . --include="*.rs" --include="*.go" --include="*.py"

# Search for related function names
grep -r "function_name" . --include="*.rs" --include="*.go" --include="*.py"

# Find recent changes in affected area
git log --oneline --since="2024-01-01" -- path/to/affected/component | head -20
```

Document findings in `research/issue-345-code-analysis.md`

### Phase 5: Build and Test (1-2 hours)

```bash
# Build all components
cd /home/runner/work/drasi-platform/drasi-platform
make docker-build

# Or build specific component based on issue
# For Control Plane:
cd control-planes && make docker-build

# For Query Container:
cd query-container && make docker-build

# For Sources:
cd sources && make docker-build

# For Reactions:
cd reactions && make docker-build

# Run unit tests
make test

# Run linting
make lint-check

# Document any build/test failures in the investigation
```

### Phase 6: Reproduction (1-2 hours, if applicable)

If issue includes reproduction steps:

```bash
# Set up local Kind cluster
kind create cluster --name drasi-test

# Load built images
make kind-load

# Initialize Drasi
drasi init --local --version latest

# Check installation
kubectl get pods --namespace drasi-system

# Follow reproduction steps from issue
# Document results in research/issue-345-reproduction.md
```

### Phase 7: Analysis and Root Cause (2-4 hours)

Based on code exploration and reproduction:

1. Trace the code execution path
2. Identify where behavior diverges
3. Check for edge cases or boundary conditions
4. Review error handling
5. Examine state management
6. Check for race conditions or timing issues

Tools to use:
```bash
# Add debug logging to code
# Run with debug build: make docker-build BUILD_CONFIG=debug

# Check logs
kubectl logs -n drasi-system <pod-name>

# Describe resources
kubectl describe -n drasi-system <resource>

# For Rust code, use cargo commands
cd query-container
cargo test
cargo check
cargo clippy
```

Document findings in investigation report.

### Phase 8: Impact Assessment (1 hour)

Analyze:
1. How many users/scenarios are affected?
2. What is the severity? (Critical/High/Medium/Low)
3. Are there workarounds available?
4. What are the security implications?
5. What is the performance impact?
6. What is the data integrity risk?

Search for similar patterns:
```bash
# Find similar code patterns
grep -r "similar pattern" . --include="*.rs" --include="*.go" --include="*.py"

# Check for similar issues
gh issue list --search "similar keywords" --json number,title,state
```

Update investigation report with findings.

### Phase 9: Recommendations (1 hour)

Based on analysis, document:

1. **Root Cause Summary**
   - Clear technical explanation
   - Why this happens
   - When it occurs

2. **Recommended Fix Approach**
   - Minimal changes needed
   - Files to modify
   - Functions to update
   - Testing strategy

3. **Alternative Approaches**
   - Other ways to fix
   - Trade-offs for each

4. **Similar Patterns to Address**
   - Other code locations with same issue
   - Preventive fixes

5. **Testing Plan**
   - Unit tests to add/update
   - Integration tests needed
   - E2E scenarios to cover

Create `research/issue-345-fix-recommendations.md` if fix is complex.

### Phase 10: Finalize Investigation (30 minutes)

```bash
# Update investigation report
# - Fill in all remaining placeholder sections
# - Add code snippets and examples
# - Include relevant logs and errors
# - Link to related issues and PRs
# - Complete checklist items

# Create summary
cat > research/issue-345-summary.md << 'EOF'
# Issue #345 Summary

**Issue:** [Title]
**Status:** Investigation Complete
**Severity:** [Critical/High/Medium/Low]

## Key Findings
1. [Finding 1]
2. [Finding 2]
3. [Finding 3]

## Root Cause
[Brief explanation]

## Affected Components
- [Component 1]
- [Component 2]

## Recommended Fix
[Brief description]

## Testing Required
- [Test 1]
- [Test 2]

## Related Issues
- [Issue/PR links]
EOF

# Commit all investigation files
git add research/
git commit -m "Complete technical investigation for issue #345"
git push
```

---

## Quick Reference Commands

### Issue Access
```bash
gh issue view 345
gh issue view 345 --json title,body,comments,labels
gh issue view 345 --web  # Open in browser
```

### Build Commands
```bash
make docker-build                          # Build all
make docker-build DOCKER_TAG_VERSION="v1"  # Specific version
make docker-build BUILD_CONFIG=debug       # Debug build
cd [component] && make docker-build        # Specific component
```

### Test Commands
```bash
make test                  # Unit tests
make lint-check           # Linting
cd e2e-tests && npm test  # E2E tests
```

### Cluster Commands
```bash
kind create cluster --name drasi-test
make kind-load
drasi init --local --version latest
kubectl get pods -n drasi-system
kubectl logs -n drasi-system <pod>
kubectl describe -n drasi-system <resource>
drasi uninstall
```

### Code Search
```bash
# Search for text
grep -r "search term" . --include="*.rs" --include="*.go"

# Find files
find . -name "*.rs" -o -name "*.go"

# Git history
git log --oneline --since="2024-01-01" -- path/to/file
git blame path/to/file
```

### Rust-Specific (Query Container)
```bash
cd query-container
cargo build
cargo test
cargo check
cargo clippy
cargo tree  # Dependencies
```

---

## Expected Deliverables

Once complete, the `/research` folder should contain:

```
research/
├── README.md                              # Research folder documentation
├── issue-345-investigation.md             # Complete investigation (15KB+)
├── issue-345-details.txt                  # Raw issue from GitHub
├── issue-345-raw.json                     # Issue JSON data
├── issue-345-summary.md                   # Executive summary
├── issue-345-code-analysis.md             # Detailed code analysis (if complex)
├── issue-345-reproduction.md              # Reproduction steps and results (if applicable)
├── issue-345-fix-recommendations.md       # Proposed solutions (if complex)
├── issue-345-related-prs.json            # Related PRs
├── recent-issues.json                     # Context of other issues
└── investigation-notes.md                 # Original notes on blockers
```

All files committed and pushed to the branch.

---

## Checklist

Use this checklist when executing the plan:

**Setup:**
- [ ] Bash access confirmed
- [ ] gh CLI access confirmed
- [ ] Created `/research` directory
- [ ] Moved prepared files to `/research`
- [ ] Cleaned up temporary root files

**Issue Details:**
- [ ] Retrieved issue #345 from GitHub
- [ ] Read issue description thoroughly
- [ ] Reviewed all comments
- [ ] Noted error messages and logs
- [ ] Identified reproduction steps
- [ ] Checked labels and classification

**Code Exploration:**
- [ ] Identified affected component(s)
- [ ] Located relevant code files
- [ ] Searched for error messages in code
- [ ] Reviewed recent commits in affected area
- [ ] Checked related test files

**Build & Test:**
- [ ] Built all components successfully
- [ ] Ran unit tests
- [ ] Ran linting
- [ ] Documented any failures
- [ ] Verified prerequisites installed

**Reproduction:**
- [ ] Set up local environment (if needed)
- [ ] Followed reproduction steps (if provided)
- [ ] Verified issue occurs locally
- [ ] Documented observed behavior
- [ ] Captured logs and errors

**Analysis:**
- [ ] Traced code execution path
- [ ] Identified root cause
- [ ] Checked for edge cases
- [ ] Reviewed error handling
- [ ] Analyzed state management
- [ ] Checked for race conditions

**Impact Assessment:**
- [ ] Determined severity level
- [ ] Identified affected users/scenarios
- [ ] Assessed security implications
- [ ] Evaluated performance impact
- [ ] Checked data integrity risks
- [ ] Identified workarounds

**Similar Patterns:**
- [ ] Searched for similar code patterns
- [ ] Checked for related issues
- [ ] Identified other affected areas
- [ ] Documented cross-cutting concerns

**Documentation:**
- [ ] Completed investigation report
- [ ] Created summary document
- [ ] Added code analysis (if needed)
- [ ] Documented fix recommendations
- [ ] Updated research README

**Finalization:**
- [ ] All placeholder sections filled
- [ ] All relevant files created
- [ ] All findings documented
- [ ] Investigation committed and pushed
- [ ] Checklist completed

---

## Notes

- This plan assumes issue #345 exists and is accessible
- Adjust timeline based on issue complexity
- Some steps may not be needed for simple issues
- Complex issues may require additional documentation
- If issue cannot be reproduced, focus on code analysis
- Collaborate with issue reporter if clarification needed

---

**Status:** Ready to execute once tools are available  
**Estimated Time:** 6-12 hours depending on complexity  
**Prerequisites:** bash, gh, make, cargo, kind/k3d (for reproduction)

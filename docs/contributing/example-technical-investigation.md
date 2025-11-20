# Example Technical Investigation: Query Result Set Not Updating

## Issue Summary
- **Issue Type**: Hypothetical Example Investigation
- **Component**: Query Container
- **Severity**: High
- **Scenario**: Continuous query result sets not updating when source data changes

## Purpose of This Document
This is an **example investigation** demonstrating how to apply the technical investigation framework to a Drasi issue. This serves as a reference for conducting real investigations.

## 1. Problem Localization

### Investigation Approach

When investigating a query update issue, the investigation would follow this path:

**Primary Locations to Check**:
1. `query-container/query-host/` - Main query processing logic
2. `query-container/view-svc/` - View service managing result sets
3. `query-container/publish-api/` - API for publishing changes
4. `sources/sdk/` - Source SDK that publishes changes

**Data Flow Path to Trace**:
1. Source detects change in data repository
2. Source publishes change event
3. Query host receives change event
4. Query evaluates change against continuous queries
5. Result set updated (or not - the problem)
6. Change notification sent to reactions

### Key Files to Review

For a query result update issue, investigate:

```
query-container/
├── query-host/
│   ├── src/
│   │   ├── query_engine.rs      # Core query evaluation
│   │   ├── change_handler.rs    # Handles incoming changes
│   │   └── result_manager.rs    # Manages query result sets
│   └── tests/
│       └── integration_tests.rs
├── view-svc/
│   ├── src/
│   │   ├── view_manager.rs      # View lifecycle management
│   │   └── subscription.rs      # Change subscriptions
│   └── Cargo.toml
└── publish-api/
    └── src/
        └── publisher.rs          # Change publishing logic
```

## 2. Root Cause Hypothesis

### Potential Root Causes

Based on architecture analysis, possible root causes could be:

1. **Change Event Not Propagating**
   - Source not publishing changes correctly
   - Message queue or event bus issue
   - Network connectivity problem

2. **Query Evaluation Logic**
   - Cypher query parsing issue
   - Incorrect change detection algorithm
   - Filter conditions not properly evaluated

3. **Result Set Management**
   - Result cache not invalidating
   - State management bug
   - Concurrent update conflict

4. **Subscription Issues**
   - Reaction not properly subscribed to query
   - Subscription filter excluding changes
   - Notification delivery failure

### Evidence to Collect

To verify hypothesis:
- Check source logs for change publication
- Verify query host receives events (add logging)
- Inspect query evaluation metrics
- Review result set state in view service
- Test with simple query to isolate complexity

## 3. Expected vs Actual Behavior

### Expected Behavior

When a continuous query is defined as:
```cypher
MATCH (o:Order)
WHERE o.status = 'READY_FOR_PICKUP'
RETURN o.id, o.customer, o.items
```

And a source detects that Order #123's status changed from 'PREPARING' to 'READY_FOR_PICKUP':

**Expected**:
1. Source publishes change event
2. Query host receives event
3. Query evaluates: Order #123 now matches WHERE clause
4. Result set updated to include Order #123
5. Reaction receives notification with new result
6. Reaction triggers (e.g., notify driver)

### Actual Behavior

**Observed**:
1. Source publishes change event ✓ (confirmed in logs)
2. Query host receives event ✓ (confirmed in logs)
3. Query evaluation step occurs ? (needs verification)
4. Result set **NOT updated** ✗ (the problem)
5. No notification sent to reaction ✗
6. Driver not notified ✗

### Trigger Conditions

Issue occurs when:
- Change updates an existing entity's property
- Property change causes entity to match/unmatch query predicate
- Issue does NOT occur with:
  - New entity creation
  - Entity deletion
  - Changes that don't affect query predicates

## 4. Relevant References

### Code References

**Primary Implementation** (hypothetical file locations):
- `query-container/query-host/src/query_engine.rs:152` - `evaluate_change()` function
- `query-container/query-host/src/change_handler.rs:78` - `handle_property_update()` method
- `query-container/view-svc/src/result_manager.rs:201` - `update_result_set()` function

**Related Tests**:
- `query-container/query-host/tests/integration_tests.rs:450` - Test for property updates
- `e2e-tests/query-evaluation/property-update-test.yaml` - E2E test scenario

**Configuration**:
- Query configuration in Kubernetes CRD
- Source change feed configuration

### Documentation

- [Continuous Queries Documentation](https://drasi.io/concepts/continuous-queries/)
- [Query Evaluation Architecture](https://drasi.io/architecture/query-container/)
- [Source Change Detection](https://drasi.io/reference/sources/)

### Related Issues/PRs

Hypothetical related items to check:
- #XXX - "Query result not updating for certain Cypher patterns"
- #YYY - "Performance issue with result set updates"
- PR #ZZZ - "Refactor change detection algorithm"

## 5. Impact Analysis

### Severity: High

**Justification**:
- Core functionality broken (continuous queries not working)
- Affects all use cases relying on property updates
- No automated workaround available
- Does not cause data loss or security issue (hence not Critical)

### Scope

**Affected Users**:
- All users with continuous queries monitoring property changes
- Estimated 70-80% of typical Drasi deployments

**Affected Features**:
- Continuous query evaluation
- Result set management
- Reaction triggering
- Real-time data processing

**Blocking Issues**:
- Blocks real-time notification scenarios
- Makes Drasi unreliable for change detection
- Impacts production deployments

### Risk Areas

**Risks in Fixing**:
- Query evaluation performance could be impacted
- Backward compatibility with existing queries
- Potential for false positive updates
- Resource consumption increase

**Backward Compatibility**:
- Fix should not require query rewriting
- Existing result sets should remain valid
- API contracts must be preserved

## 6. Similar Patterns Found

### Other Components with Similar Logic

**Query Evaluation Pattern** used in:
1. `query-container/query-host/src/delete_handler.rs:89`
   - Similar logic for handling deletions
   - May have same issue with certain delete patterns

2. `query-container/query-host/src/create_handler.rs:112`
   - Entity creation handling
   - Appears to work correctly (could serve as reference)

**Result Set Management** pattern in:
1. `query-container/view-svc/src/materialized_view.rs`
   - Different approach to result caching
   - Could be alternative implementation

### Potential for Same Issue Elsewhere

**Yes** - Likely affects:
- Relationship property updates (not just node properties)
- Array property modifications
- Nested object property changes

**Areas to investigate**:
- Edge/relationship property updates
- Multi-property updates in single transaction
- Cascading updates

## 7. Technical Context for Developers

### Key Functions to Review

1. **`evaluate_change(change: ChangeEvent) -> EvaluationResult`**
   - Location: `query-container/query-host/src/query_engine.rs`
   - Purpose: Determines if change affects query results
   - Potential issue: May not properly detect property updates that change predicate matching

2. **`handle_property_update(entity: Entity, property: String, old_value: Value, new_value: Value)`**
   - Location: `query-container/query-host/src/change_handler.rs`
   - Purpose: Processes property update events
   - Potential issue: May not trigger re-evaluation of affected queries

3. **`update_result_set(query_id: String, change_type: ChangeType, entity: Entity)`**
   - Location: `query-container/view-svc/src/result_manager.rs`
   - Purpose: Updates materialized query results
   - Potential issue: May not receive update notifications

### Relevant Design Patterns

**Continuous Query Evaluation**:
- Drasi uses incremental view maintenance
- Changes evaluated against query predicates
- Results updated only when predicates affected
- Pattern: Event-driven architecture with change streaming

**State Management**:
- Query results maintained as materialized views
- Views updated incrementally (not re-executed)
- Requires tracking entity state before/after changes

### Potential Gotchas

1. **Cypher Query Semantics**
   - WHERE clause evaluation is complex
   - Property updates might need full re-evaluation in some cases
   - Index usage could mask issues in testing

2. **Async Event Processing**
   - Change events processed asynchronously
   - Race conditions possible with rapid updates
   - Event ordering must be preserved

3. **State Tracking**
   - System needs to know previous entity state
   - Property update requires before/after comparison
   - State cache could become stale

### Suggested Investigation Steps

#### Step 1: Reproduce with Minimal Example
```bash
# Create simple source with single entity
drasi apply -f test-source.yaml

# Create query monitoring single property
drasi apply -f test-query.yaml

# Create debug reaction to observe results
drasi apply -f test-reaction.yaml

# Update entity property that should trigger query
# Use source-specific tools to update data

# Check if reaction triggered
drasi list reactions
drasi logs reaction test-reaction
```

#### Step 2: Enable Debug Logging
```bash
# Enable debug logging on query host
kubectl set env deployment/query-host LOG_LEVEL=debug

# Monitor logs during property update
kubectl logs -f deployment/query-host
```

#### Step 3: Inspect Query Evaluation
```rust
// Add instrumentation to query_engine.rs
fn evaluate_change(change: ChangeEvent) -> EvaluationResult {
    log::debug!("Evaluating change: {:?}", change);
    
    // Existing logic...
    let result = perform_evaluation(&change);
    
    log::debug!("Evaluation result: {:?}", result);
    result
}
```

#### Step 4: Check Result Set State
```bash
# Query view service API to see current results
kubectl port-forward svc/view-svc 8080:8080
curl http://localhost:8080/views/{query-id}/results
```

#### Step 5: Verify Event Flow
- Add logging at each stage
- Confirm events received
- Track event through pipeline
- Identify where flow breaks

### Testing Strategy

**Unit Tests to Add**:
```rust
#[test]
fn test_property_update_matching_predicate() {
    // Create entity that doesn't match query
    let entity = Entity::new("Order", vec![
        ("id", "123"),
        ("status", "PREPARING")
    ]);
    
    // Update property to match predicate
    let change = PropertyUpdate {
        entity_id: "123",
        property: "status",
        old_value: "PREPARING",
        new_value: "READY_FOR_PICKUP"
    };
    
    // Verify entity now included in results
    let result = evaluate_change(change);
    assert!(result.matches_query());
    assert_eq!(result.change_type, ChangeType::Added);
}

#[test]
fn test_property_update_no_longer_matching() {
    // Test reverse scenario
    // Entity matches, then property updated to not match
}
```

**Integration Tests Needed**:
- End-to-end test with real source
- Multiple concurrent property updates
- Updates to multiple properties
- Complex WHERE clause scenarios

**Manual Testing Approach**:
1. Deploy minimal Drasi environment
2. Configure single source with known data
3. Create simple continuous query
4. Manually trigger property updates
5. Verify results update correctly
6. Test with various query patterns

## 8. Broader Implications

### Architectural Considerations

**Query Evaluation Model**:
- Current model: Incremental view maintenance
- Assumption: Changes can be evaluated incrementally
- Challenge: Some property updates may require full re-evaluation
- Consideration: Balance between performance and correctness

**Event Processing Architecture**:
- Relies on source publishing complete change information
- Query host must maintain entity state
- State management complexity increases with scale

### Technical Debt

**Identified Technical Debt**:
1. Insufficient test coverage for property update scenarios
2. Lack of comprehensive logging in query evaluation path
3. No metrics for tracking result set update failures
4. Documentation gap on how property updates are handled

**Should Be Addressed**:
- Add comprehensive test suite for all change types
- Implement detailed observability (metrics, traces, logs)
- Document query evaluation algorithm
- Consider query evaluation optimization

### Opportunities for Improvement

**Beyond the Bug Fix**:

1. **Enhanced Observability**
   - Add metrics for query evaluation performance
   - Trace change events through entire pipeline
   - Dashboard for query result set status

2. **Testing Infrastructure**
   - Automated test suite for query scenarios
   - Property-based testing for query evaluation
   - Chaos testing for event processing

3. **Documentation**
   - Detailed architecture docs for query evaluation
   - Troubleshooting guide for query issues
   - Performance tuning guide

4. **Developer Experience**
   - CLI command to debug query evaluation
   - Tool to visualize query result changes
   - Better error messages when queries don't update

5. **Performance Optimization**
   - Profile query evaluation performance
   - Optimize for common query patterns
   - Consider caching strategies

## Next Steps for Developer

If assigned this issue, the developer should:

1. **Immediate Actions**:
   - [ ] Reproduce issue with minimal test case
   - [ ] Enable debug logging and capture logs
   - [ ] Identify exact point where update fails
   - [ ] Review recent changes to query evaluation code

2. **Investigation**:
   - [ ] Add instrumentation to query_engine
   - [ ] Trace change event from source to result set
   - [ ] Compare working (create) vs broken (update) paths
   - [ ] Test with different query patterns

3. **Fix Development**:
   - [ ] Develop fix based on root cause
   - [ ] Add unit tests for property update scenarios
   - [ ] Add integration tests
   - [ ] Test performance impact
   - [ ] Verify backward compatibility

4. **Validation**:
   - [ ] Test with E2E scenarios
   - [ ] Deploy to test environment
   - [ ] Run full test suite
   - [ ] Check for regressions

5. **Documentation**:
   - [ ] Update architecture docs if needed
   - [ ] Add troubleshooting entry
   - [ ] Document any limitations

---

## Conclusion

This example demonstrates how to apply the technical investigation framework to a real issue in Drasi. The investigation:

- Identified likely problem locations in the codebase
- Developed hypotheses about root causes
- Documented expected vs actual behavior
- Assessed impact and severity
- Provided actionable next steps for developers

This structured approach ensures thorough investigation and provides developers with the context needed to efficiently resolve the issue.

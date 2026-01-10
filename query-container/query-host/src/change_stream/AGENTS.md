# AGENTS.md: `query-container/query-host/src/change_stream`

Implements a **reliable, sequential** message stream abstraction on top of Redis Streams.

## Critical Behavioral Semantics

1.  **At-Least-Once / Re-serve Guarantee**:
    The consumer holds a lock on the current message. If `recv()` is called without acknowledging the previous message, it **returns the same message again**. This enforces sequential processing and prevents data loss.

2.  **Startup Recovery (Pending First)**:
    On initialization, `RedisChangeStream` checks the Consumer Group's **Pending entries list (PEL)**. It processes *all* unacknowledged messages from previous sessions (crashes/restarts) before consuming any new data.

3.  **Strict Acknowledgement**:
    `ack(id)` must be called with the *exact* ID of the current message. Acking a different ID (or out of order) returns an `AckOutOfSequence` error.

# AGENTS.md: `query-container/query-host/src/change_stream`

Implements a sequential change stream consumer on top of Redis Streams ensuring that messages are processed in order and acknowledges them only after successful processing. Goal is to provide a reliable, ordered message consumption mechanism from a Redis stream, abstracting away the complexities of Redis Streams consumer groups, pending messages, and acknowledgements.

# Copyright 2026 The Drasi Authors.
# Licensed under the Apache License, Version 2.0.

from collections.abc import Awaitable, Callable
from dataclasses import dataclass

from dapr.clients.exceptions import DaprInternalError
from dapr.clients.grpc._state import Concurrency, Consistency, StateOptions


@dataclass(frozen=True)
class StoredState:
    data: bytes
    etag: str


@dataclass(frozen=True)
class StateWrite:
    key: tuple[str, str]
    data: bytes
    etag: str | None


class FakeStateStore:
    def __init__(self) -> None:
        self.records: dict[tuple[str, str], StoredState] = {}
        self.reads: list[tuple[str, str]] = []
        self.writes: list[StateWrite] = []
        self.clients: list[FakeDaprClient] = []
        self.read_error: Exception | None = None
        self.write_error: Exception | None = None
        self.after_write_error: Exception | None = None
        self.before_read: Callable[[], Awaitable[None]] | None = None
        self.before_write: Callable[[], Awaitable[None]] | None = None
        self._revision = 0

    def client(self) -> "FakeDaprClient":
        client = FakeDaprClient(self)
        self.clients.append(client)
        return client

    def put(self, key: tuple[str, str], data: bytes) -> None:
        self._revision += 1
        self.records[key] = StoredState(data, str(self._revision))


class FakeDaprClient:
    def __init__(self, store: FakeStateStore) -> None:
        self.store = store
        self.closed = False

    async def get_state(self, *, store_name: str, key: str) -> StoredState:
        assert not self.closed
        identity = store_name, key
        self.store.reads.append(identity)
        if self.store.before_read is not None:
            await self.store.before_read()
        if self.store.read_error is not None:
            raise self.store.read_error
        return self.store.records.get(identity, StoredState(b"", ""))

    async def save_state(
        self,
        *,
        store_name: str,
        key: str,
        value: str,
        etag: str | None,
        options: StateOptions,
    ) -> None:
        assert not self.closed
        assert options.concurrency == Concurrency.first_write
        assert options.consistency == Consistency.strong
        identity = store_name, key
        data = value.encode("utf-8")
        self.store.writes.append(StateWrite(identity, data, etag))
        if self.store.before_write is not None:
            await self.store.before_write()
        if self.store.write_error is not None:
            raise self.store.write_error
        current = self.store.records.get(identity)
        if etag is not None and (current is None or etag != current.etag):
            raise DaprInternalError("ETag conflict")
        self.store.put(identity, data)
        if self.store.after_write_error is not None:
            raise self.store.after_write_error

    async def close(self) -> None:
        self.closed = True


@dataclass(frozen=True)
class Publication:
    pubsub_name: str
    topic_name: str
    data: str
    data_content_type: str


class FakePubSub:
    def __init__(self) -> None:
        self.attempts: list[Publication] = []
        self.published: list[Publication] = []
        self.clients: list[FakePublishClient] = []
        self.error: Exception | None = None
        self.before_publish: Callable[[Publication], Awaitable[None]] | None = None

    def client(self) -> "FakePublishClient":
        client = FakePublishClient(self)
        self.clients.append(client)
        return client


class FakePublishClient:
    def __init__(self, pubsub: FakePubSub) -> None:
        self.pubsub = pubsub
        self.closed = False

    async def publish_event(
        self,
        *,
        pubsub_name: str,
        topic_name: str,
        data: str,
        data_content_type: str,
    ) -> None:
        assert not self.closed
        publication = Publication(pubsub_name, topic_name, data, data_content_type)
        self.pubsub.attempts.append(publication)
        if self.pubsub.before_publish is not None:
            await self.pubsub.before_publish(publication)
        if self.pubsub.error is not None:
            raise self.pubsub.error
        self.pubsub.published.append(publication)

    async def close(self) -> None:
        self.closed = True

// Copyright 2026 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Module mocks (hoisted by Jest before imports)

jest.mock('@dapr/dapr', () => ({
  DaprServer: jest.fn().mockReturnValue({
    pubsub: { subscribe: jest.fn().mockResolvedValue(undefined) },
    start: jest.fn().mockResolvedValue(undefined),
    stop: jest.fn().mockResolvedValue(undefined),
  }),
}));

jest.mock('fs', () => ({
  readdirSync: jest.fn().mockReturnValue([]),
  readFileSync: jest.fn().mockReturnValue(''),
  writeFileSync: jest.fn(),
}));

jest.mock('./management-client', () => ({
  ManagementClient: jest.fn().mockReturnValue({ getQueryContainerId: jest.fn() }),
}));

jest.mock('./result-view-client', () => ({
  ResultViewClient: jest.fn().mockReturnValue({ getCurrentResult: jest.fn() }),
}));

// Imports (resolved against mocked modules above)

import { DaprServer } from '@dapr/dapr';
import { readdirSync, readFileSync } from 'fs';
import { DrasiReaction } from './index';
import { ChangeEvent } from './types/ChangeEvent';
import { ControlEvent } from './types/ControlEvent';

// Typed helpers to access the mock DaprServer instance created during construction
const MockedDaprServer = DaprServer as jest.Mock;
const getDaprInstance = () => MockedDaprServer.mock.results[MockedDaprServer.mock.results.length - 1].value;

describe('DrasiReaction', () => {
  beforeEach(() => {
    // Reset call counts between tests
    MockedDaprServer.mockClear();
    (readdirSync as jest.Mock).mockReturnValue([]);
    (readFileSync as jest.Mock).mockReturnValue('');
  });

  // Initial state

  it('returns an empty query ID list before start() is called', () => {
    const reaction = new DrasiReaction(jest.fn());
    expect(reaction.getQueryIds()).toEqual([]);
  });

  it('returns undefined for an unknown query config', () => {
    const reaction = new DrasiReaction(jest.fn());
    expect(reaction.getQueryConfig('nonexistent')).toBeUndefined();
  });

  it('exposes a resultViewClient', () => {
    const reaction = new DrasiReaction(jest.fn());
    expect(reaction.resultViewClient).toBeDefined();
  });

  // onMessage routing

  describe('onMessage', () => {
    it('calls onChangeEvent when kind is "change"', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      const reaction = new DrasiReaction(handler);

      const event: Partial<ChangeEvent> = {
        kind: 'change',
        queryId: 'query1',
        sequence: 1,
        addedResults: [],
        updatedResults: [],
        deletedResults: [],
      };

      await reaction.onMessage(event);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(event, undefined);
    });

    it('calls onControlEvent when kind is "control" and a handler is registered', async () => {
      const changeHandler = jest.fn().mockResolvedValue(undefined);
      const controlHandler = jest.fn().mockResolvedValue(undefined);
      const reaction = new DrasiReaction(changeHandler, { onControlEvent: controlHandler });

      const event: Partial<ControlEvent> = {
        kind: 'control',
        queryId: 'query1',
        sequence: 2,
      };

      await reaction.onMessage(event);

      expect(controlHandler).toHaveBeenCalledTimes(1);
      expect(controlHandler).toHaveBeenCalledWith(event, undefined);
      expect(changeHandler).not.toHaveBeenCalled();
    });

    it('does not throw when a control event arrives with no handler registered', async () => {
      const reaction = new DrasiReaction(jest.fn());
      const event = { kind: 'control', queryId: 'query1', sequence: 2 };


      await expect(reaction.onMessage(event)).resolves.toBeUndefined();
    });

    it('does not throw for an unknown message kind', async () => {
      const reaction = new DrasiReaction(jest.fn());
      await expect(reaction.onMessage({ kind: 'unknown', queryId: 'q1' })).resolves.toBeUndefined();
    });

    it('passes the cached query config to the event handler', async () => {
      const parseConfig = jest.fn().mockReturnValue({ threshold: 10 });
      const changeHandler = jest.fn().mockResolvedValue(undefined);
      const reaction = new DrasiReaction(changeHandler, { parseQueryConfig: parseConfig });

      // Simulate start() having loaded and parsed a config for 'query1'
      (readdirSync as jest.Mock).mockReturnValue(['query1']);
      (readFileSync as jest.Mock).mockReturnValue('threshold: 10');
      await reaction.start();

      await reaction.onMessage({ kind: 'change', queryId: 'query1', sequence: 1 });

      expect(changeHandler).toHaveBeenCalledWith(
        expect.objectContaining({ queryId: 'query1' }),
        { threshold: 10 }
      );
    });
  });

  // start()

  describe('start', () => {
    it('reads query IDs from the config directory and subscribes to each', async () => {
      (readdirSync as jest.Mock).mockReturnValue(['query1', 'query2', '.hidden']);
      const reaction = new DrasiReaction(jest.fn());

      await reaction.start();

      // .hidden files should be filtered out
      expect(reaction.getQueryIds()).toEqual(['query1', 'query2']);

      const dapr = getDaprInstance();
      expect(dapr.pubsub.subscribe).toHaveBeenCalledWith(
        'drasi-pubsub', 'query1-results', expect.any(Function)
      );
      expect(dapr.pubsub.subscribe).toHaveBeenCalledWith(
        'drasi-pubsub', 'query2-results', expect.any(Function)
      );
      expect(dapr.start).toHaveBeenCalled();
    });

    it('parses and stores query config when parseQueryConfig is provided', async () => {
      const parseConfig = jest.fn().mockReturnValue({ env: 'prod' });
      (readdirSync as jest.Mock).mockReturnValue(['query1']);
      (readFileSync as jest.Mock).mockReturnValue('env: prod');

      const reaction = new DrasiReaction(jest.fn(), { parseQueryConfig: parseConfig });
      await reaction.start();

      expect(parseConfig).toHaveBeenCalledWith('query1', 'env: prod');
      expect(reaction.getQueryConfig('query1')).toEqual({ env: 'prod' });
    });

    it('respects a custom PubsubName from the environment', async () => {
      process.env['PubsubName'] = 'custom-pubsub';
      (readdirSync as jest.Mock).mockReturnValue(['query1']);
      const reaction = new DrasiReaction(jest.fn());

      await reaction.start();

      const dapr = getDaprInstance();
      expect(dapr.pubsub.subscribe).toHaveBeenCalledWith(
        'custom-pubsub', 'query1-results', expect.any(Function)
      );

      delete process.env['PubsubName'];
    });
  });

  // stop()

  describe('stop', () => {
    it('delegates to daprServer.stop()', async () => {
      const reaction = new DrasiReaction(jest.fn());
      await reaction.stop();

      expect(getDaprInstance().stop).toHaveBeenCalled();
    });
  });
});

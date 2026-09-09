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

// parseChunked is mocked so tests don't depend on actual streaming JSON parsing
jest.mock('@discoveryjs/json-ext', () => ({ parseChunked: jest.fn() }));

import { parseChunked } from '@discoveryjs/json-ext';
import { IManagementClient } from './management-client';
import { ResultViewClient } from './result-view-client';
import { ViewItem } from './types/ViewItem';

const mockParseChunked = parseChunked as unknown as jest.Mock;
const mockFetch = jest.fn();
global.fetch = mockFetch;

/** Convenience: collect all items from an AsyncIterable into an array. */
async function collect(gen: AsyncIterable<ViewItem>): Promise<ViewItem[]> {
  const items: ViewItem[] = [];
  for await (const item of gen) {
    items.push(item);
  }
  return items;
}

/** Returns a fetch response with a readable-stream body mock. */
function makeFetchResponse(ok: boolean, statusText = 'OK') {
  const reader = { read: jest.fn(), releaseLock: jest.fn() };
  return { ok, statusText, body: { getReader: jest.fn().mockReturnValue(reader) } };
}

describe('ResultViewClient', () => {
  let managementClient: jest.Mocked<IManagementClient>;
  let client: ResultViewClient;

  beforeEach(() => {
    managementClient = { getQueryContainerId: jest.fn() };
    client = new ResultViewClient(managementClient);
    mockFetch.mockReset();
    mockParseChunked.mockReset();
  });

  describe('getCurrentResult (explicit container ID)', () => {
    it('yields each item in the parsed array', async () => {
      const expected: ViewItem[] = [
        { header: { sequence: 1, timestamp: 1000 }, data: { id: '1' } },
        { header: { sequence: 2, timestamp: 2000 }, data: { id: '2' } },
      ];
      mockFetch.mockResolvedValue(makeFetchResponse(true));
      mockParseChunked.mockResolvedValue(expected);

      const results = await collect(client.getCurrentResult('my-container', 'query1'));

      expect(results).toEqual(expected);

      expect(mockFetch).toHaveBeenCalledWith(
        'http://my-container-view-svc/query1',
        { signal: undefined }
      );
    });

    it('yields a single item when the parsed result is not an array', async () => {
      const single: ViewItem = { header: { sequence: 1, timestamp: 1000 }, data: { id: '1' } };
      mockFetch.mockResolvedValue(makeFetchResponse(true));
      mockParseChunked.mockResolvedValue(single);

      const results = await collect(client.getCurrentResult('my-container', 'query1'));

      expect(results).toEqual([single]);
    });

    it('yields nothing when the HTTP response is not OK', async () => {
      mockFetch.mockResolvedValue(makeFetchResponse(false, 'Internal Server Error'));

      const results = await collect(client.getCurrentResult('my-container', 'query1'));

      expect(results).toHaveLength(0);
      expect(mockParseChunked).not.toHaveBeenCalled();
    });

    it('yields nothing when the response body is null', async () => {
      mockFetch.mockResolvedValue({ ok: true, statusText: 'OK', body: null });

      const results = await collect(client.getCurrentResult('my-container', 'query1'));

      expect(results).toHaveLength(0);
      expect(mockParseChunked).not.toHaveBeenCalled();
    });

    it('yields nothing when fetch throws a network error', async () => {
      mockFetch.mockRejectedValue(new Error('Network failure'));

      const results = await collect(client.getCurrentResult('my-container', 'query1'));

      expect(results).toHaveLength(0);
    });

    it('yields nothing and swallows an AbortError', async () => {
      const err = new Error('The user aborted a request.');
      err.name = 'AbortError';
      mockFetch.mockRejectedValue(err);

      const results = await collect(client.getCurrentResult('my-container', 'query1'));

      expect(results).toHaveLength(0);
    });
  });

  describe('getCurrentResult (auto-resolve container ID)', () => {
    it('resolves the container ID via the management client then fetches results', async () => {
      const expected: ViewItem[] = [{ data: { id: 'x' } }];
      managementClient.getQueryContainerId.mockResolvedValue('resolved-container');
      mockFetch.mockResolvedValue(makeFetchResponse(true));
      mockParseChunked.mockResolvedValue(expected);

      const results = await collect(client.getCurrentResult('query1'));

      expect(managementClient.getQueryContainerId).toHaveBeenCalledWith('query1');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://resolved-container-view-svc/query1',
        { signal: undefined }
      );
      expect(results).toEqual(expected);
    });

    it('yields nothing when the management client fails to resolve the container ID', async () => {
      managementClient.getQueryContainerId.mockRejectedValue(new Error('query not found'));

      const results = await collect(client.getCurrentResult('query1'));

      expect(results).toHaveLength(0);
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe('abort signal', () => {
    it('stops yielding items mid-iteration when the signal is aborted', async () => {
      const controller = new AbortController();
      const items: ViewItem[] = [
        { data: { id: '1' } },
        { data: { id: '2' } },
        { data: { id: '3' } },
      ];
      mockFetch.mockResolvedValue(makeFetchResponse(true));
      // Abort before the loop starts — no items should be yielded
      mockParseChunked.mockImplementation(async () => {
        controller.abort();
        return items;
      });

      const results = await collect(
        client.getCurrentResult('my-container', 'query1', controller.signal)
      );

      // All items are skipped because the signal was aborted before iteration
      expect(results).toHaveLength(0);
    });
  });
});

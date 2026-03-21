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

import { ManagementClient } from './management-client';

// Replace global fetch with a Jest mock for all tests in this file
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ManagementClient', () => {
  let client: ManagementClient;

  beforeEach(() => {
    client = new ManagementClient();
    mockFetch.mockReset();
  });

  describe('getQueryContainerId', () => {
    it('returns the container ID on a successful response', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ spec: { container: 'my-container' } }),
      });

      const result = await client.getQueryContainerId('query1');

      expect(result).toBe('my-container');
      expect(mockFetch).toHaveBeenCalledWith(
        'http://drasi-api:8080/v1/continuousQueries/query1'
      );
    });

    it('throws when the HTTP response is not OK', async () => {
      mockFetch.mockResolvedValue({ ok: false, statusText: 'Not Found' });

      await expect(client.getQueryContainerId('query1')).rejects.toThrow(
        'Failed to get query container ID: Not Found'
      );
    });

    it('throws when the container ID is absent from the response body', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ spec: {} }),
      });

      await expect(client.getQueryContainerId('query1')).rejects.toThrow(
        'Failed to parse response body - container ID not found'
      );
    });

    it('throws when the response body is null', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(null),
      });

      await expect(client.getQueryContainerId('query1')).rejects.toThrow(
        'Failed to parse response body - container ID not found'
      );
    });

    it('propagates network-level errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      await expect(client.getQueryContainerId('query1')).rejects.toThrow('Network error');
    });
  });
});

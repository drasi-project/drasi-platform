// Copyright 2024 The Drasi Authors.
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

import { ViewItem } from "./types/ViewItem";
import { IManagementClient } from "./management-client";
import { parseChunked } from "@discoveryjs/json-ext";

/**
 * Interface for retrieving current query results
 */
export interface IResultViewClient {
  /**
   * Gets the current result for a query (resolves container ID automatically)
   */
  getCurrentResult(queryId: string, signal?: AbortSignal): AsyncIterable<ViewItem>;

  /**
   * Gets the current result for a query from a specific container
   */
  getCurrentResult(queryContainerId: string, queryId: string, signal?: AbortSignal): AsyncIterable<ViewItem>;
}

/**
 * Client for retrieving current query results from the view service
 */
export class ResultViewClient implements IResultViewClient {
  private readonly managementClient: IManagementClient;

  constructor(managementClient: IManagementClient) {
    this.managementClient = managementClient;
  }

  /**
   * Gets the current result for a query (resolves container ID automatically)
   */
  getCurrentResult(queryId: string, signal?: AbortSignal): AsyncIterable<ViewItem>;

  /**
   * Gets the current result for a query from a specific container
   */
  getCurrentResult(queryContainerId: string, queryId: string, signal?: AbortSignal): AsyncIterable<ViewItem>;

  async* getCurrentResult(
    queryIdOrContainerId: string,
    queryIdOrSignal?: string | AbortSignal,
    signal?: AbortSignal
  ): AsyncIterable<ViewItem> {
    // Handle overloads
    let queryContainerId: string;
    let queryId: string;
    let abortSignal: AbortSignal | undefined;

    if (typeof queryIdOrSignal === 'string') {
      // Two-parameter version: (queryContainerId, queryId, signal?)
      queryContainerId = queryIdOrContainerId;
      queryId = queryIdOrSignal;
      abortSignal = signal;
    } else {
      // One-parameter version: (queryId, signal?)
      queryId = queryIdOrContainerId;
      abortSignal = queryIdOrSignal;
      try {
        queryContainerId = await this.managementClient.getQueryContainerId(queryId);
      } catch (error) {
        console.error(`Error resolving container ID for query ${queryId}:`, error);
        return;
      }
    }

    const url = `http://${queryContainerId}-view-svc/${queryId}`;

    try {
      const response = await fetch(url, {
        signal: abortSignal
      });

      if (!response.ok) {
        console.error(`Error getting current result: ${response.statusText}`);
        return;
      }

      if (!response.body) {
        return;
      }

      // Use parseChunked to stream and parse large JSON arrays
      const reader = response.body.getReader();

      async function* chunks() {
        try {
          while (true) {
            if (abortSignal?.aborted) {
              break;
            }

            const { done, value } = await reader.read();
            if (done) break;

            yield value;
          }
        } finally {
          reader.releaseLock();
        }
      }

      try {
        const result = await parseChunked(chunks());

        // If result is an array, yield each item
        if (Array.isArray(result)) {
          for (const item of result) {
            if (abortSignal?.aborted) break;
            yield item as ViewItem;
          }
        } else {
          // Single object
          yield result as ViewItem;
        }
      } catch (error) {
        if (abortSignal?.aborted) {
          return;
        }
        console.error(`Error parsing streaming JSON:`, error);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error(`Error getting current result:`, error);
      }
    }
  }
}
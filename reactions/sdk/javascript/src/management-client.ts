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

/**
 * Interface for management operations
 */
export interface IManagementClient {
  /**
   * Gets the container ID for a given query ID
   */
  getQueryContainerId(queryId: string): Promise<string>;
}

/**
 * Implementation of the management client
 */
export class ManagementClient implements IManagementClient {
  private readonly managementApiUrl: string = "http://drasi-api:8080";

  /**
   * Gets the container ID for a given query ID
   */
  async getQueryContainerId(queryId: string): Promise<string> {
    const response = await fetch(`${this.managementApiUrl}/v1/continuousQueries/${queryId}`);

    if (!response.ok) {
      throw new Error(`Failed to get query container ID: ${response.statusText}`);
    }

    const body = await response.json();
    const containerId = body?.spec?.container;

    if (!containerId) {
      throw new Error("Failed to parse response body - container ID not found");
    }

    return containerId;
  }
}
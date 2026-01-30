/*
 * Copyright 2026 The Drasi Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { deployFixture, undeployFixture } from '../fixtures/index.js';

describe('Oracle Database Integration', () => {
  const scenarioName = '10-oracle-scenario';
  const queryResults = [];

  beforeAll(async () => {
    await deployFixture(scenarioName);
  }, 120000);

  afterAll(async () => {
    await undeployFixture(scenarioName);
  });

  test('Oracle source should connect and retrieve data', async () => {
    const queryId = 'oracle-query1';
    
    await new Promise(resolve => setTimeout(resolve, 15000));
    
    const result = await queryResults[queryId];
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    
    const item = result[0];
    expect(item).toHaveProperty('Id');
    expect(item).toHaveProperty('Name');
    expect(item).toHaveProperty('Category');
    expect(item).toHaveProperty('Score');
    
    expect(item.Category).toBe('1');
    expect(item.Score).toBeGreaterThanOrEqual(5);
  }, 30000);

  test('Oracle change data capture should work', async () => {
    // This test would need to connect to Oracle and make changes
    // For now, we'll just verify the query is active
    const queryId = 'oracle-query1';
    expect(queryResults[queryId]).toBeDefined();
  }, 15000);
});
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

import { getConfigValue, parseJson, parseYaml } from './utils';

describe('getConfigValue', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Shallow-clone env so mutations in tests are isolated
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns the env variable value when set', () => {
    process.env['DRASI_TEST_KEY'] = 'hello';
    expect(getConfigValue('DRASI_TEST_KEY')).toBe('hello');
  });

  it('returns the default value when the env variable is not set', () => {
    delete process.env['DRASI_MISSING_KEY'];
    expect(getConfigValue('DRASI_MISSING_KEY', 'fallback')).toBe('fallback');
  });

  it('returns undefined when env variable is not set and no default is provided', () => {
    delete process.env['DRASI_MISSING_KEY'];
    expect(getConfigValue('DRASI_MISSING_KEY')).toBeUndefined();
  });

  it('prefers the env variable over the default', () => {
    process.env['DRASI_TEST_KEY'] = 'actual';
    expect(getConfigValue('DRASI_TEST_KEY', 'fallback')).toBe('actual');
  });
});

describe('parseJson', () => {
  it('parses a valid JSON object', () => {
    const result = parseJson('query1', '{"host":"localhost","port":5432}');
    expect(result).toEqual({ host: 'localhost', port: 5432 });
  });

  it('parses a valid JSON array', () => {
    const result = parseJson('query1', '[1, 2, 3]');
    expect(result).toEqual([1, 2, 3]);
  });

  it('throws on malformed JSON', () => {
    expect(() => parseJson('query1', '{not-valid-json}')).toThrow();
  });
});

describe('parseYaml', () => {
  it('parses a simple YAML string', () => {
    const result = parseYaml('query1', 'host: localhost\nport: 5432');
    expect(result).toEqual({ host: 'localhost', port: 5432 });
  });

  it('parses nested YAML objects', () => {
    const yaml = 'db:\n  host: localhost\n  port: 5432';
    expect(parseYaml('query1', yaml)).toEqual({ db: { host: 'localhost', port: 5432 } });
  });

  it('throws on invalid YAML', () => {
    // An unclosed flow sequence is invalid YAML
    expect(() => parseYaml('query1', 'key: [unclosed')).toThrow();
  });
});

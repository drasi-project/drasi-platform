/**
 * Copyright 2024 The Drasi Authors.
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

export type ConfigValue = 
  | { kind: 'Inline'; value: InlineValue }
  | { kind: 'Secret'; name: string; key: string };

export type InlineValue =
  | { String: { value: string } }
  | { Integer: { value: number } }
  | { Boolean: { value: boolean } }
  | { List: { value: ConfigValue[] } };

export type ServiceIdentity =
  | { kind: 'MicrosoftEntraWorkloadID'; clientId: string }
  | { kind: 'MicrosoftEntraApplication'; tenantId: ConfigValue; clientId: ConfigValue; secret?: ConfigValue; certificate?: ConfigValue }
  | { kind: 'ConnectionString'; connectionString: ConfigValue }
  | { kind: 'AccessKey'; accessKey: ConfigValue }
  | { kind: 'AwsIamRole'; roleArn: ConfigValue }
  | { kind: 'AwsIamAccessKey'; accessKeyId: ConfigValue; secretAccessKey: ConfigValue; region: ConfigValue };

export interface ServiceConfig {
  properties?: Record<string, any>;
  endpoints?: Record<string, EndpointConfig>;
  dapr?: Record<string, ConfigValue>;
}

export interface EndpointConfig {
  setting: 'internal' | 'external';
  target: string;
}

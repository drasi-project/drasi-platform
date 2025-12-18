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

import { Resource } from "./resource";

export interface ContinuousQuery extends Resource<ContinuousQuerySpec> {  
}

export interface ContinuousQuerySpec {
  mode: string;
  container?: string;
  query: string;
  queryLanguage?: 'Cypher' | 'GQL';
  sources: ContinuousQuerySources;
  storageProfile?: string;
  view?: ViewSpec;
}

export interface ContinuousQuerySources {
  subscriptions: QuerySubscription[];
  joins?: QueryJoin[];
  middleware?: SourceMiddlewareConfig[];
}

export interface QuerySubscription {
  id: string;
  pipeline?: string[];
  nodes?: QuerySourceLabel[];
  relations?: QuerySourceLabel[];
}

export interface QuerySourceLabel {
  sourceLabel: string;
}

export interface QueryJoin {
  id: string;
  keys: QueryJoinKey[];
}

export interface QueryJoinKey {
  label: string;
  property: string;
}

export interface SourceMiddlewareConfig {
  kind: string;
  name: string;
  [key: string]: any;
}

export interface ViewSpec {
  enabled: boolean;
  retentionPolicy: RetentionPolicy;
}

export type RetentionPolicy = 
  | 'latest' 
  | 'all' 
  | { expire: { afterSeconds: number } };

export interface ContinuousQueryStatus {
  hostName: string;
  status: string;
  container: string;
  errorMessage?: string;
}
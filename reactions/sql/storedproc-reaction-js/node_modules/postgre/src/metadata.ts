export interface StringMap {
  [key: string]: string;
}
export interface Statement {
  query: string;
  params?: any[];
}

export interface Manager {
  exec(sql: string, args?: any[]): Promise<number>;
  execBatch(statements: Statement[], firstSuccess?: boolean): Promise<number>;
  query<T>(sql: string, args?: any[], m?: StringMap, bools?: Attribute[]): Promise<T[]>;
  queryOne<T>(sql: string, args?: any[], m?: StringMap, bools?: Attribute[]): Promise<T>;
  execScalar<T>(sql: string, args?: any[]): Promise<T>;
  count(sql: string, args?: any[]): Promise<number>;
}

export type DataType = 'ObjectId' | 'date' | 'datetime' | 'time'
    | 'boolean' | 'number' | 'integer' | 'string' | 'text'
    | 'object' | 'array' | 'primitives' | 'binary';
export type FormatType = 'currency' | 'percentage' | 'email' | 'url' | 'phone' | 'fax' | 'ipv4' | 'ipv6';
export type MatchType = 'equal' | 'prefix' | 'contain' | 'max' | 'min'; // contain: default for string, min: default for Date, number

export interface Model {
  name?: string;
  attributes: Attributes;
  source?: string;
}
export interface Attribute {
  name?: string;
  field?: string;
  type?: DataType;
  match?: MatchType;
  default?: string|number|Date;
  key?: boolean;
  noinsert?: boolean;
  noupdate?: boolean;
  version?: boolean;
  ignored?: boolean;
  length?: number;
  min?: number;
  max?: number;
  gt?: number;
  lt?: number;
  exp?: RegExp|string;
  code?: string;
  typeof?: Attributes;
  true?: string|number;
  false?: string|number;
}
export interface Attributes {
  [key: string]: Attribute;
}

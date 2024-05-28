import { Resource } from "./resource";


export interface ContinuousQuery extends Resource {
  spec: ContinuousQuerySpec;
}

interface ContinuousQuerySpec {

}
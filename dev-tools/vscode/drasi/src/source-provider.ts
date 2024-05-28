import { Resource } from "./resource";


export interface SourceProvider extends Resource {
  spec: SourceProviderSpec;
}

interface SourceProviderSpec {

}
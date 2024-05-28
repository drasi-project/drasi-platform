import { Resource } from "./resource";


export interface ReactionProvider extends Resource {
  spec: ReactionProviderSpec;
}

interface ReactionProviderSpec {

}
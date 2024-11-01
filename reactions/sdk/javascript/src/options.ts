import { OnControlEvent } from ".";


export type ReactionOptions<TQueryConfig = any> = {

    /**
     * The function that is called when a control event (query started, stopped, etc.) is received.
     *
     * @param event The control event
     * @param queryConfig The configuration object for the query
     */
    onControlEvent?: OnControlEvent;

    /**
     * The function to parse the per query configuration.
     *
     * @param queryId The ID of the query
     * @param config The configuration string from the query specific configuration.
     *
     * @example
     * ```yaml
     * kind: Reaction
     * apiVersion: v1
     * name: my-reaction
     * spec:
     *   kind: MyReaction
     *   queries:
     *     query1: |
     *       greeting: "Hello, World!"  # This YAML configuration will be parsed into a MyQueryConfig object
     *     query2: |
     *       greeting: "Howdy!"
     *    ```
     * @returns The parsed configuration object
     *
     * @example
     * ```json
     * {
     *   "greeting": "Hello, World!"
     * }
     * ```
     *
     * If your configuration is in JSON format, you can use the built-in JSON parser:
     * @example
     * ```typescript
     * let myReaction = new DrasiReaction(onChangeEvent, {
     *   parseQueryConfig: parseJson,
     * });
       ```

    * If your configuration is in YAML format, you can use the built-in YAML parser:
    *  @example
    *  ```typescript
    *  let myReaction = new DrasiReaction(onChangeEvent, {
    *    parseQueryConfig: parseYaml,
    *  });
    *  ```
    */
    parseQueryConfig?: (queryId: string, config: string) => TQueryConfig;
};

import YAML from 'yaml'

/**
 * Retrieves a configuration value for the Reaction.
 * 
 * @param key The configuration key to retrieve
 * @param defaultValue The default value to return if the key is not found
 * @returns The configuration value or the default value if the key is not found
 * 
 * @example
 * ```typescript
 * const connectionString = getConfigValue("MyConnectionString");
 * ```
 * The above code will retrieve the value of the MyConnectionString configuration key, as defined in the reaction manifest:
 * ```yaml
 * kind: Reaction
 * apiVersion: v1
 * name: test
 * spec:
 *  kind: MyReaction
 *  properties:
 *    MyConnectionString: "some connection string"
 *  queries:
 *    query1:
 * ```
 * 
 */
export function getConfigValue(key: string, defaultValue?: string): string | undefined {
    return process.env[key] ?? defaultValue;
}


/** 
 * Parses a JSON configuration string into an object.
 * 
 * @example
 * ```typescript
 * let myReaction = new DrasiReaction(onChangeEvent, {
 *   parseQueryConfig: parseJson,
 * });
 * ```
 */
export function parseJson(queryId: string, config: string): any {
    return JSON.parse(config);
}

/** 
 * Parses a YAML configuration string into an object.
 * 
 * @example
 * ```typescript
 * let myReaction = new DrasiReaction(onChangeEvent, {
 *   parseQueryConfig: parseYaml,
 * });
 * ```
 */
export function parseYaml(queryId: string, config: string): any {
    return YAML.parse(config);
}
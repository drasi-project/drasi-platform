/*
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

package io.drasi.source.sdk;

/**
 * Interface for storing state, such as a cursor position.
 */
public interface StateStore {

    /**
     * Store a byte array value for a given key.
     *
     * @param key   The key to store the value under.
     * @param value The value to store.
     */
    void put(String key, byte[] value);

    /**
     * Retrieve a byte array value for a given key.
     *
     * @param key The key to retrieve the value for.
     * @return The value stored under the key, or null if no value is stored.
     */
    byte[] get(String key);

    /**
     * Delete the value stored under a given key.
     * @param key
     */
    void delete(String key);

}

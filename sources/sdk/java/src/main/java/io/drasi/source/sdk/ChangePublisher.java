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

import com.fasterxml.jackson.core.JsonProcessingException;
import io.drasi.source.sdk.models.SourceChange;

/**
 * Interface for publishing changes to the Drasi platform.
 */
public interface ChangePublisher extends AutoCloseable {

    /**
     * Publish a change to the Drasi platform.
     *
     * @param change The change to publish.
     * @throws JsonProcessingException If the change could not be serialized to JSON.
     */
    void Publish(SourceChange change) throws JsonProcessingException;
}
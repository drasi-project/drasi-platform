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

package com.drasi;

import io.dapr.client.DaprClient;
import io.dapr.client.DaprClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
public class DeprovisionController {

    private static final Logger log = LoggerFactory.getLogger(DeprovisionController.class);

    private DaprClient client;
    private String stateStore;
    private ChangeMonitor changeMonitor;

    @Autowired
    public DeprovisionController(@Qualifier("changeMonitor") ChangeMonitor changeMonitor) {
        this.client = new DaprClientBuilder().build();
        this.stateStore = "drasi-state";
        this.changeMonitor = changeMonitor;
    }

    /**
     * Handles a dapr service invocation endpoint on this app.
     * @param body The body of the http message.
     * @param headers The headers of the http message.
     * @return A message containing the time.
     */
    @PostMapping(path = "/deprovision")
    public Mono<ResponseEntity<Void>> handleMethod(@RequestBody(required = false) byte[] body,
                                                   @RequestHeader Map<String, String> headers) {
        return Mono.fromSupplier(() -> {
            try {
                log.info("Deprovisioning...");
                changeMonitor.close();
                client.deleteState(stateStore, "offset").block();
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });
    }

}
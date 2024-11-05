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

import io.debezium.spi.converter.CustomConverter;
import io.debezium.spi.converter.RelationalColumn;
import org.apache.kafka.connect.data.SchemaBuilder;

import java.sql.Types;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.Properties;

public class TemporalConverter implements CustomConverter<SchemaBuilder, RelationalColumn> {

    @Override
    public void configure(Properties props) {
    }

    @Override
    public void converterFor(RelationalColumn column,
                             CustomConverter.ConverterRegistration<SchemaBuilder> registration) {

        switch (column.jdbcType()) {
            case Types.TIMESTAMP:
                registration.register(SchemaBuilder.string().name(column.name()), x -> {
                    switch (x) {
                        case null:
                            return null;
                        case Instant instant:
                            return DateTimeFormatter.ISO_INSTANT.format(instant);
                        case LocalDateTime localDateTime:
                            return DateTimeFormatter.ISO_LOCAL_DATE_TIME.format(localDateTime);
                        default:
                            return x.toString();
                    }
                });
                break;
            case Types.DATE:
                registration.register(SchemaBuilder.string().name(column.name()), x -> {
                    switch (x) {
                        case null:
                            return null;
                        case LocalDate localDate:
                            return DateTimeFormatter.ISO_LOCAL_DATE.format(localDate);
                        default:
                            return x.toString();
                    }
                });
                break;
            case Types.TIME:
                registration.register(SchemaBuilder.string().name(column.name()), x -> {
                    switch (x) {
                        case null:
                            return null;
                        case LocalTime localTime:
                            return DateTimeFormatter.ISO_LOCAL_TIME.format(localTime);
                        default:
                            return x.toString();
                    }
                });
                break;

        }
    }
}
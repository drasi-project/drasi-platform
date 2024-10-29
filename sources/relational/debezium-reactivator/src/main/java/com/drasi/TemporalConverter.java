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
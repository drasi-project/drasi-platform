package io.drasi;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import io.drasi.source.sdk.models.SourceElement;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Set;

public class ResultStream implements AutoCloseable {

    private final String tableName;
    private final Connection connection;

    private ResultSet resultSet;
    private ResultSetMetaData metaData;
    private NodeMapping mapping;
    private int columnCount;

    public ResultStream(Connection connection, String tableName) throws SQLException {
        this.tableName = tableName;
        this.connection = connection;
    }

    public SourceElement next() throws SQLException {

        if (resultSet == null) {
            mapping = ReadMappingFromSchema(tableName);
            var statement = connection.createStatement();
            resultSet = statement.executeQuery("SELECT * FROM \"" + tableName + "\"");
            metaData = resultSet.getMetaData();
            columnCount = metaData.getColumnCount();
        }

        if (resultSet.next()) {
            var properties = JsonNodeFactory.instance.objectNode();
            for (int i = 1; i <= columnCount; i++) {
                String columnName = metaData.getColumnName(i);
                int columnType = metaData.getColumnType(i);
                PutField(columnName, columnType, resultSet, i, properties);
            }

            if (!properties.has(mapping.keyField)) {
                return null;
            }

            var nodeId = SanitizeNodeId(mapping.tableName + ":" + properties.path(mapping.keyField).asText());

            return new SourceElement(nodeId, properties, mapping.labels);
        }

        return null;
    }

    private String SanitizeNodeId(String nodeId) {
        return nodeId.replace('.', ':');
    }

    private NodeMapping ReadMappingFromSchema(String table) throws SQLException {
        var metadata = connection.getMetaData();
        table = table.trim();
        String schemaName = null;
        String tableName = table;

        if (table.contains(".")) {
            var tableComps = table.split("\\.");
            schemaName = tableComps[0];
            tableName = tableComps[1];
        }

        var rs = metadata.getPrimaryKeys(null, schemaName, tableName);
        if (!rs.next())
            throw new SQLException("No primary key found for " + table);
        var mapping = new NodeMapping();
        mapping.tableName = rs.getString("TABLE_SCHEM") + "." + tableName;
        mapping.keyField = rs.getString("COLUMN_NAME");
        mapping.labels = Collections.singleton(tableName);

        return mapping;
    }

    private void PutField(String columnName, int columnType, ResultSet rs, int columnIndex, ObjectNode output) throws SQLException {
        switch (columnType) {
            case Types.TIMESTAMP:
                Timestamp sqlTimestamp = rs.getTimestamp(columnIndex);
                if (sqlTimestamp != null) {
                    LocalDateTime localDateTime = sqlTimestamp.toLocalDateTime();
                    output.put(columnName, localDateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
                } else {
                    output.putNull(columnName);
                }
                break;
            case Types.INTEGER:
                int intValue = rs.getInt(columnIndex);
                if (rs.wasNull()) {
                    output.putNull(columnName);
                } else {
                    output.put(columnName, intValue);
                }
                break;
            case Types.BIGINT:
                long longValue = rs.getLong(columnIndex);
                if (rs.wasNull()) {
                    output.putNull(columnName);
                } else {
                    output.put(columnName, longValue);
                }
                break;
            case Types.DOUBLE:
                double doubleValue = rs.getDouble(columnIndex);
                if (rs.wasNull()) {
                    output.putNull(columnName);
                } else {
                    output.put(columnName, doubleValue);
                }
                break;
            case Types.FLOAT:
                float floatValue = rs.getFloat(columnIndex);
                if (rs.wasNull()) {
                    output.putNull(columnName);
                } else {
                    output.put(columnName, floatValue);
                }
                break;
            case Types.BOOLEAN:
                boolean booleanValue = rs.getBoolean(columnIndex);
                if (rs.wasNull()) {
                    output.putNull(columnName);
                } else {
                    output.put(columnName, booleanValue);
                }
                break;
            case Types.SMALLINT:
                short shortValue = rs.getShort(columnIndex);
                if (rs.wasNull()) {
                    output.putNull(columnName);
                } else {
                    output.put(columnName, shortValue);
                }
                break;
            case Types.NUMERIC:
                BigDecimal bigDecimalValue = rs.getBigDecimal(columnIndex);
                if (rs.wasNull()) {
                    output.putNull(columnName);
                } else {
                    output.put(columnName, bigDecimalValue);
                }
                break;
            case Types.NULL:
                output.putNull(columnName);
                break;
            default: // Handle other types as strings
                String value = rs.getString(columnIndex);
                if (rs.wasNull()) {
                    output.putNull(columnName);
                } else {
                    output.put(columnName, value);
                }
        }
    }

    @Override
    public void close() throws Exception {
        connection.close();
    }

    class NodeMapping {
        public String tableName;
        public String keyField;
        public Set<String> labels;
    }
}

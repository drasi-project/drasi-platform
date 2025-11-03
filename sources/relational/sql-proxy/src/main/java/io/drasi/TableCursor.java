package io.drasi;

import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;

import io.drasi.source.sdk.SourceProxy;
import io.drasi.source.sdk.models.SourceElement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;

class TableCursor {
    private static final Logger log = LoggerFactory.getLogger(TableCursor.class);
    public final String schemaName;
    public final String tableName;    
    public NodeMapping mapping;
    public ResultSet resultSet;
    public ResultSetMetaData metaData;
    public int columnCount;

    public TableCursor(String schemaName, String tableName) {
        this.schemaName = schemaName;
        this.tableName = tableName;
    }

    private void Init(Connection connection) throws SQLException {
        if (resultSet == null) {
            mapping = ReadMappingFromSchema(schemaName, tableName, connection);
            connection.setAutoCommit(false);
            var statement = connection.createStatement(ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
            statement.setFetchSize(1000);
            String quote = SourceProxy.GetConfigValue("connector").equalsIgnoreCase("MySQL") ? "`" : "\"";
            var sanitizedTableName = tableName.replace(quote, "").replace(";", "");
            var fullyQualifiedTableName = schemaName != null ? quote + schemaName + quote + "." + quote + sanitizedTableName + quote : quote + sanitizedTableName + quote;
            resultSet = statement.executeQuery("SELECT * FROM " + fullyQualifiedTableName);
            metaData = resultSet.getMetaData();
            columnCount = metaData.getColumnCount();
        }
    }

    public SourceElement next(Connection connection) {
        try {
            Init(connection);

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
        }
        catch (SQLException e) {
            log.error("Error reading from database", e);
            throw new RuntimeException(e);
        }

        return null;
    }

    public void close() {
        try {
            if (resultSet != null)
                resultSet.close();
        } catch (SQLException e) {
            log.error("Error closing result set", e);
        }
    }

    private String SanitizeNodeId(String nodeId) {
        return nodeId.replace('.', ':');
    }

    private NodeMapping ReadMappingFromSchema(String schemaName, String tableName, Connection connection) throws SQLException {
        var metadata = connection.getMetaData();

        var rs = metadata.getPrimaryKeys(null, schemaName, tableName);
        if (!rs.next())
            throw new SQLException("No primary key found for " + (schemaName != null ? schemaName + "." + tableName : tableName));
        var mapping = new NodeMapping();
        String actualSchema = rs.getString("TABLE_SCHEM");
        mapping.tableName = actualSchema != null ? actualSchema + "." + tableName : tableName;
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
}

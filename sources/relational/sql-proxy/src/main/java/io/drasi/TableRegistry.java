package io.drasi;

import java.util.HashMap;
import java.util.Map;

import io.drasi.source.sdk.SourceProxy;

public class TableRegistry {
    private final Map<String, String> tableSchemaMap;

    public TableRegistry() {
        this.tableSchemaMap = new HashMap<>();
        parseTablesConfig();
    }

    private void parseTablesConfig() {
        String tablesEnv = SourceProxy.GetConfigValue("tables");
        if (tablesEnv == null || tablesEnv.trim().isEmpty()) {
            return;
        }

        String[] tables = tablesEnv.split(",");
        for (String table : tables) {
            String trimmedTable = table.trim();
            if (trimmedTable.contains(".")) {
                String[] parts = trimmedTable.split("\\.", 2);
                String schema = parts[0].trim();
                String tableName = parts[1].trim();
                tableSchemaMap.put(tableName, schema);
            } else {
                tableSchemaMap.put(trimmedTable, null);
            }
        }
    }

    public boolean tableExists(String tableName) {
        return tableSchemaMap.containsKey(tableName);
    }

    public String getSchemaName(String tableName) {
        return tableSchemaMap.get(tableName);
    }
}
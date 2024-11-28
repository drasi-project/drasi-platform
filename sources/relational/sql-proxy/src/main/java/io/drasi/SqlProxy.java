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

package io.drasi;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.util.RawValue;
import io.drasi.source.sdk.ChangeMonitor;
import io.drasi.source.sdk.Reactivator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Date;

public class SqlProxy {

    private static final Logger log = LoggerFactory.getLogger(SqlProxy.class);

    public static void main(String[] args) throws IOException, SQLException {

        try (var connection = getConnection()) {
            var rs = new ResultStream(connection, "Freezer");

            var row = rs.next();
            while (row != null) {
                log.info("Row: {}", row.toJson());
                row = rs.next();
            }
        }

    }


    private static Connection getConnection() throws SQLException {
        switch (Reactivator.GetConfigValue("connector")) {
            case "PostgreSQL":
                var propsPG = new Properties();
                propsPG.setProperty("user", Reactivator.GetConfigValue("user"));
                propsPG.setProperty("password", Reactivator.GetConfigValue("password"));
                propsPG.setProperty("sslmode", Reactivator.GetConfigValue("sslMode", "prefer"));

                return DriverManager.getConnection("jdbc:postgresql://" + Reactivator.GetConfigValue("host") + ":" + Reactivator.GetConfigValue("port") + "/" + Reactivator.GetConfigValue("database"), propsPG);
            case "SQLServer":
                var propsSQL = new Properties();
                propsSQL.setProperty("user", Reactivator.GetConfigValue("user"));
                propsSQL.setProperty("password", Reactivator.GetConfigValue("password"));
                propsSQL.setProperty("encrypt", Reactivator.GetConfigValue("encrypt"));
                propsSQL.setProperty("trustServerCertificate", Reactivator.GetConfigValue("trustServerCertificate", "false"));
                propsSQL.setProperty("authentication", Reactivator.GetConfigValue("authentication", "NotSpecified"));

                return DriverManager.getConnection("jdbc:sqlserver://"  + Reactivator.GetConfigValue("host") + ":" + Reactivator.GetConfigValue("port") + ";databaseName=" + Reactivator.GetConfigValue("database"), propsSQL);
            default:
                throw new IllegalArgumentException("Unknown connector");
        }
    }

}

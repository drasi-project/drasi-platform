package io.drasi;

import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.core.credential.AccessToken;
import io.drasi.source.sdk.SourceProxy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class AzureIdentityPostgreSQLConnection {

    private static final Logger log = LoggerFactory.getLogger(AzureIdentityPostgreSQLConnection.class);
    private static final String POSTGRES_SCOPE = "https://ossrdbms-aad.database.windows.net/.default";

    public static Connection getConnection() throws SQLException {
        try {
            log.info("Using Azure Identity for PostgreSQL authentication");

            // Get access token using DefaultAzureCredential
            var credential = new DefaultAzureCredentialBuilder().build();
            AccessToken token = credential.getTokenSync(
                new com.azure.core.credential.TokenRequestContext()
                    .addScopes(POSTGRES_SCOPE)
            );

            // Set up connection properties
            var props = new Properties();
            props.setProperty("user", SourceProxy.GetConfigValue("user"));
            props.setProperty("password", token.getToken());

            // For Azure PostgreSQL with managed identity, we need to set these additional properties
            props.setProperty("ssl", "true");
            props.setProperty("sslmode", "require");

            String connectionUrl = "jdbc:postgresql://"
                + SourceProxy.GetConfigValue("host") + ":"
                + SourceProxy.GetConfigValue("port") + "/"
                + SourceProxy.GetConfigValue("database");

            log.debug("Connecting to PostgreSQL using Azure Identity token");
            return DriverManager.getConnection(connectionUrl, props);

        } catch (Exception e) {
            log.error("Failed to authenticate using Azure Identity", e);
            throw new SQLException("Azure Identity authentication failed", e);
        }
    }
}
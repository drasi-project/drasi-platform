package io.drasi.databases;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.azure.identity.DefaultAzureCredentialBuilder;
import com.azure.core.credential.TokenRequestContext;

public class AzureIdentityTokenFetcher {
    private static final Logger log = LoggerFactory.getLogger(AzureIdentityTokenFetcher.class);

    private static final String SCOPE = "https://ossrdbms-aad.database.windows.net/.default";
    
    public String getToken() {

        log.info("Fetching Azure AD token");
        
        // Fetch Azure AD token
        var credential = new DefaultAzureCredentialBuilder().build();
        var tokenContext = new TokenRequestContext().addScopes(SCOPE);
        String accessToken = credential.getToken(tokenContext).block().getToken();

        return accessToken;
    }
}
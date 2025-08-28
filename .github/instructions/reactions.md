---
applyTo: "reactions/**/*"
---

# Reactions - GitHub Copilot Instructions

## Project Overview

Reactions are components that respond to changes in continuous query results. They take action when query result sets are updated, such as sending notifications, updating external systems, or triggering workflows. This directory contains multiple reaction implementations across different technology stacks.

## Technology Stack

- **C#/.NET**: SignalR, Azure integrations
- **Go**: HTTP reactions, cloud integrations  
- **TypeScript/Node.js**: Web-based reactions, APIs
- **Python**: Data processing and ML reactions
- **Mixed**: Various other reactions depending on target system

## Project Structure

```
reactions/
├── signalr/                  # Real-time web notifications
│   └── signalr-reaction/     # C#/.NET SignalR implementation
├── http/                     # HTTP webhook reactions
├── azure/                    # Azure-specific reactions
├── aws/                      # AWS-specific reactions
├── power-platform/           # Microsoft Power Platform
├── platform/                 # Platform-specific reactions
├── sql/                      # Database update reactions
├── debezium/                 # Database integration
├── gremlin/                  # Graph database reactions
├── dapr/                     # Dapr-based reactions
├── sdk/                      # Shared SDK components
└── Makefile                  # Root build configuration
```

## Key Reaction Types

### Real-time Notifications
- **SignalR**: WebSocket-based real-time updates
- **HTTP**: REST API webhooks and notifications
- **Platform**: Mobile and desktop notifications

### Cloud Integrations
- **Azure**: Service Bus, Functions, Logic Apps
- **AWS**: Lambda, SQS, SNS integrations
- **Power Platform**: Flow, PowerApps integration

### Database Updates
- **SQL**: Direct database modifications
- **Gremlin**: Graph database updates
- **Debezium**: Change data capture integration

## Build and Development

### Building All Reactions
```bash
# Build all reaction containers
make docker-build

# Build debug versions
make docker-build-debug

# Build specific reaction
make -C signalr docker-build
```

### Testing
```bash
# Run all reaction tests
make test

# Test specific reaction
make -C http test

# Integration tests
make test-integration
```

### Linting
```bash
# Lint all reactions
make lint-check

# Language-specific linting
make -C signalr lint-check  # C# (dotnet format)
```

## Development Guidelines

### C#/.NET Reactions (SignalR)

#### Project Structure
```
signalr-reaction/
├── signalr-reaction.sln      # Solution file
├── Drasi.Reactions.SignalR/  # Main project
│   ├── Program.cs           # Entry point
│   ├── Services/           # Business logic
│   ├── Models/             # Data models
│   └── *.csproj           # Project file
└── Drasi.Reactions.SignalR.Tests/  # Unit tests
```

#### .NET Patterns
```csharp
// Dependency injection setup
builder.Services.AddSignalR();
builder.Services.AddScoped<IReactionService, ReactionService>();
builder.Services.AddSingleton<IQueryResultProcessor, QueryResultProcessor>();

// SignalR Hub implementation
public class QueryResultHub : Hub
{
    public async Task JoinQueryGroup(string queryId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"query-{queryId}");
    }
}

// Reaction service pattern
public class SignalRReactionService : IReactionService
{
    private readonly IHubContext<QueryResultHub> _hubContext;
    
    public async Task ProcessQueryUpdate(QueryResult result)
    {
        await _hubContext.Clients.Group($"query-{result.QueryId}")
            .SendAsync("QueryResultUpdate", result);
    }
}
```

#### NuGet Dependencies
```xml
<PackageReference Include="Microsoft.Azure.SignalR" Version="1.28.0" />
<PackageReference Include="Drasi.Reaction.SDK" Version="0.1.5-alpha" />
<PackageReference Include="Azure.Identity" Version="1.13.1" />
```

### Go Reactions (HTTP, Cloud)

#### Project Structure
```
http-reaction/
├── main.go                  # Entry point
├── go.mod                   # Go modules
├── internal/
│   ├── handler/            # HTTP handlers
│   ├── client/             # External API clients
│   └── config/             # Configuration
├── pkg/                    # Public packages
└── Dockerfile.default     # Container build
```

#### HTTP Client Patterns
```go
// HTTP reaction implementation
type HTTPReaction struct {
    client     *http.Client
    endpoint   string
    headers    map[string]string
}

func (r *HTTPReaction) ProcessQueryResult(ctx context.Context, result *QueryResult) error {
    payload, err := json.Marshal(result)
    if err != nil {
        return fmt.Errorf("failed to marshal result: %w", err)
    }
    
    req, err := http.NewRequestWithContext(ctx, "POST", r.endpoint, bytes.NewReader(payload))
    if err != nil {
        return fmt.Errorf("failed to create request: %w", err)
    }
    
    // Add headers
    for k, v := range r.headers {
        req.Header.Set(k, v)
    }
    
    resp, err := r.client.Do(req)
    if err != nil {
        return fmt.Errorf("failed to send request: %w", err)
    }
    defer resp.Body.Close()
    
    if resp.StatusCode >= 400 {
        return fmt.Errorf("HTTP error %d", resp.StatusCode)
    }
    
    return nil
}
```

### TypeScript/Node.js Reactions

#### Project Structure
```
web-reaction/
├── package.json            # NPM configuration
├── tsconfig.json          # TypeScript config
├── src/
│   ├── index.ts           # Entry point
│   ├── handlers/          # Event handlers
│   ├── services/          # Business logic
│   └── types/             # Type definitions
└── Dockerfile.default    # Container build
```

#### Node.js Patterns
```typescript
// Reaction interface
interface QueryReaction {
    processQueryResult(result: QueryResult): Promise<void>;
}

// HTTP webhook reaction
export class WebhookReaction implements QueryReaction {
    constructor(
        private endpoint: string,
        private headers: Record<string, string> = {}
    ) {}
    
    async processQueryResult(result: QueryResult): Promise<void> {
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.headers
            },
            body: JSON.stringify(result)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    }
}
```

## Configuration Patterns

### Environment Variables
```bash
# Common reaction configuration
REACTION_NAME=my-reaction
REACTION_TYPE=signalr
QUERY_SUBSCRIPTION=query-123

# SignalR-specific
SIGNALR_CONNECTION_STRING=Endpoint=https://...
HUB_NAME=QueryResultHub

# HTTP-specific
WEBHOOK_URL=https://api.example.com/webhook
WEBHOOK_HEADERS=Authorization:Bearer token,Content-Type:application/json

# Azure-specific
AZURE_CLIENT_ID=your-client-id
AZURE_TENANT_ID=your-tenant-id
```

### Docker Configuration
```dockerfile
# .NET multi-stage build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "Drasi.Reactions.SignalR.dll"]
```

## Testing Approach

### Unit Tests

#### C# Testing
```csharp
[Test]
public async Task ProcessQueryUpdate_ShouldNotifyClients()
{
    // Arrange
    var mockHubContext = new Mock<IHubContext<QueryResultHub>>();
    var service = new SignalRReactionService(mockHubContext.Object);
    var result = new QueryResult { QueryId = "test-query" };
    
    // Act
    await service.ProcessQueryUpdate(result);
    
    // Assert
    mockHubContext.Verify(x => x.Clients.Group("query-test-query")
        .SendAsync("QueryResultUpdate", result, default), Times.Once);
}
```

#### Go Testing
```go
func TestHTTPReaction_ProcessQueryResult(t *testing.T) {
    // Create test server
    server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        assert.Equal(t, "POST", r.Method)
        w.WriteHeader(http.StatusOK)
    }))
    defer server.Close()
    
    // Test reaction
    reaction := NewHTTPReaction(server.URL, nil)
    result := &QueryResult{QueryID: "test"}
    
    err := reaction.ProcessQueryResult(context.Background(), result)
    assert.NoError(t, err)
}
```

### Integration Tests
- Test with real external services (sandboxed)
- Validate end-to-end query result flow
- Test authentication and authorization
- Verify error handling and retry logic

## Common Tasks

### Adding a New Reaction Type
1. Choose appropriate technology stack
2. Create project structure following existing patterns
3. Implement QueryReaction interface
4. Add configuration and environment handling
5. Implement error handling and retry logic
6. Add comprehensive tests
7. Update build configuration
8. Document setup and usage

### Integrating with External Systems
1. Research target system API and authentication
2. Implement client libraries or use existing SDKs
3. Handle rate limiting and throttling
4. Implement proper error handling
5. Add configuration for connection details
6. Test with real target system

### Debugging Reaction Issues
1. Check reaction logs for processing errors
2. Validate configuration and credentials
3. Test external system connectivity
4. Verify query result format compliance
5. Check authentication and permissions

## Common Patterns

### Error Handling
```csharp
// C# error handling with retry
public async Task<bool> TryProcessWithRetry(QueryResult result, int maxRetries = 3)
{
    for (int attempt = 1; attempt <= maxRetries; attempt++)
    {
        try
        {
            await ProcessQueryResult(result);
            return true;
        }
        catch (Exception ex) when (IsRetriableError(ex) && attempt < maxRetries)
        {
            var delay = TimeSpan.FromSeconds(Math.Pow(2, attempt));
            await Task.Delay(delay);
        }
    }
    return false;
}
```

### Authentication
```go
// OAuth2 authentication example
func (r *CloudReaction) authenticate(ctx context.Context) error {
    config := &oauth2.Config{
        ClientID:     r.clientID,
        ClientSecret: r.clientSecret,
        TokenURL:     r.tokenURL,
        Scopes:       r.scopes,
    }
    
    token, err := config.Exchange(ctx, r.authCode)
    if err != nil {
        return fmt.Errorf("failed to exchange token: %w", err)
    }
    
    r.client = config.Client(ctx, token)
    return nil
}
```

### Reaction SDK Usage
```csharp
// Using the Drasi Reaction SDK
public class MyReaction : ReactionBase
{
    protected override async Task ProcessQueryResult(QueryResult result)
    {
        // Custom reaction logic here
        await SendNotification(result);
    }
    
    protected override Task HandleError(Exception error, QueryResult result)
    {
        // Custom error handling
        Logger.LogError(error, "Failed to process result for query {QueryId}", result.QueryId);
        return Task.CompletedTask;
    }
}
```

## External Dependencies

- **Target Systems**: APIs, databases, message queues being updated
- **Authentication**: OAuth2, API keys, service principals
- **Drasi Platform**: Query containers and result streaming
- **Cloud Services**: Azure, AWS, GCP service integrations
- **Monitoring**: Application insights, metrics, logging systems

## Reaction-Specific Notes

### Real-time Reactions
- Consider connection limits and scaling
- Implement proper connection management
- Handle network disconnections gracefully

### Cloud Reactions
- Implement proper authentication and token refresh
- Handle rate limiting and throttling
- Consider regional availability and data residency

### Database Reactions
- Use transactions where appropriate
- Handle connection pooling and timeouts
- Consider data consistency and conflict resolution
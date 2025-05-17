# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution and project files
COPY sync-statestore.sln ./
COPY Drasi.Reactions.SyncDaprStateStore/Drasi.Reactions.SyncDaprStateStore.csproj ./Drasi.Reactions.SyncDaprStateStore/

# Restore dependencies
RUN dotnet restore "./Drasi.Reactions.SyncDaprStateStore/Drasi.Reactions.SyncDaprStateStore.csproj"

# Copy only the source code
COPY Drasi.Reactions.SyncDaprStateStore/ ./Drasi.Reactions.SyncDaprStateStore/

# Build the reaction project
WORKDIR /src/Drasi.Reactions.SyncDaprStateStore
RUN dotnet publish "./Drasi.Reactions.SyncDaprStateStore.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set log levels for reaction in production
ENV Logging__LogLevel__Default="Information"
ENV Logging__LogLevel__Microsoft="Warning"
ENV Logging__LogLevel__Microsoft_Hosting_Lifetime="Information"
ENV Logging__LogLevel__Drasi_Reactions_SyncDaprStateStore="Information"

USER app
ENTRYPOINT ["dotnet", "Drasi.Reactions.SyncDaprStateStore.dll"]
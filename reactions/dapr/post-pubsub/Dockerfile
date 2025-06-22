# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy solution and project files
COPY post-dapr-pubsub.sln ./
COPY Drasi.Reactions.PostDaprPubSub/Drasi.Reactions.PostDaprPubSub.csproj ./Drasi.Reactions.PostDaprPubSub/

# Restore dependencies
RUN dotnet restore "./Drasi.Reactions.PostDaprPubSub/Drasi.Reactions.PostDaprPubSub.csproj"

# Copy only the source code
COPY Drasi.Reactions.PostDaprPubSub/ ./Drasi.Reactions.PostDaprPubSub/

# Build the reaction project
WORKDIR /src/Drasi.Reactions.PostDaprPubSub
RUN dotnet publish "./Drasi.Reactions.PostDaprPubSub.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set log levels for reaction in production
<<<<<<< HEAD
ENV Logging__LogLevel__Default="Debug"
=======
ENV Logging__LogLevel__Default="Information"
>>>>>>> origin/main
ENV Logging__LogLevel__Microsoft="Warning"
ENV Logging__LogLevel__Microsoft_Hosting_Lifetime="Information"
ENV Logging__LogLevel__Drasi_Reactions_PostDaprPubSub="Debug"

<<<<<<< HEAD
USER app
=======
>>>>>>> origin/main
ENTRYPOINT ["dotnet", "Drasi.Reactions.PostDaprPubSub.dll"]
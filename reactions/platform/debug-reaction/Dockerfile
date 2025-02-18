# Use the official .NET SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set working directory inside container
WORKDIR /src

# Copy the project file and restore the dependencies
COPY ["debug-reaction.Server/debug-reaction.Server.csproj", "debug-reaction.Server/"]
COPY ["debug-reaction.client/package.json", "debug-reaction.client/"]

RUN apt-get update && apt-get install -y \
    curl && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs

# Restore dependencies (using the restore command)
RUN dotnet restore "debug-reaction.Server/debug-reaction.Server.csproj"

# Copy the rest of the Server and client files
COPY . .

# Build the app (both the Server and client)
RUN dotnet build "debug-reaction.Server/debug-reaction.Server.csproj" -c Release -o /app/build
RUN cd debug-reaction.client && npm install && npm run build

# Publish the Server
FROM build AS publish
RUN dotnet publish "debug-reaction.Server/debug-reaction.Server.csproj" -c Release -o /app/publish

# Final stage: Create a smaller runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

# Copy the published files from the build container
COPY --from=publish /app/publish .

# Copy the React build files to the correct location for serving
COPY --from=build /src/debug-reaction.client/dist ./wwwroot

# Expose the port that the app will run on
EXPOSE 8080

# Set entry point to run the app
ENTRYPOINT ["dotnet", "debug-reaction.Server.dll"]

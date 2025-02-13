# Use the official .NET SDK image for building the app
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set working directory inside container
WORKDIR /src

# Copy the project file and restore the dependencies for the Server
COPY ["debug-reaction.Server.csproj", "."]

# Restore the dependencies
RUN dotnet restore "debug-reaction.Server.csproj"

# Copy the rest of the Server files
COPY . .

# Build the app
RUN dotnet build "debug-reaction.Server.csproj" -c Release -o /app/build

# Publish the app for a smaller image
FROM build AS publish
RUN dotnet publish "debug-reaction.Server.csproj" -c Release -o /app/publish

# Final stage: Create a smaller runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

# Copy the published files from the build container
COPY --from=publish /app/publish .

# Expose the port that the app will run on (make sure this is the correct port)
EXPOSE 5195

# Set entry point to run the app
ENTRYPOINT ["dotnet", "debug-reaction.Server.dll"]

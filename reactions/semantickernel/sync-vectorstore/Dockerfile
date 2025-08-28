FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["Drasi.Reactions.SyncSemanticKernelVectorStore/Drasi.Reactions.SyncSemanticKernelVectorStore.csproj", "Drasi.Reactions.SyncSemanticKernelVectorStore/"]
RUN dotnet restore "./Drasi.Reactions.SyncSemanticKernelVectorStore/Drasi.Reactions.SyncSemanticKernelVectorStore.csproj"
COPY . .
WORKDIR "/src/Drasi.Reactions.SyncSemanticKernelVectorStore"
RUN dotnet build "./Drasi.Reactions.SyncSemanticKernelVectorStore.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Drasi.Reactions.SyncSemanticKernelVectorStore.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Drasi.Reactions.SyncSemanticKernelVectorStore.dll"]
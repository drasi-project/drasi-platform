FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["dataverse-proxy.csproj", "."]
RUN dotnet restore "./dataverse-proxy.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "dataverse-proxy.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "dataverse-proxy.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "dataverse-proxy.dll"]
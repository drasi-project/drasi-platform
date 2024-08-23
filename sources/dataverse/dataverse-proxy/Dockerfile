FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet@sha256:38178966094e8ac38ac3377fa4195cbf63e9aef4030f5e62d2810f8a5df769e4 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk@sha256:8c6beed050a602970c3d275756ed3c19065e42ce6ca0809f5a6fcbf5d36fd305 AS build
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
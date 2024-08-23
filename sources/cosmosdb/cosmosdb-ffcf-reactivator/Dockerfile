FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk@sha256:6df1177e48b55272316d08f19cb383483af82aca5cdc67a76c414bc200847624 AS build-env

WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -o out


FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/runtime:6.0

WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "cosmosdb-reactivator.dll" ]
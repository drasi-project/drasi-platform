FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:6.0 AS build-env

WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -o out


FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/runtime:6.0

WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "cosmosdb-reactivator.dll" ]
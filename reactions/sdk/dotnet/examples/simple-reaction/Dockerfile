FROM mcr.microsoft.com/dotnet/sdk:8.0-cbl-mariner2.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY . .
RUN dotnet restore "./examples/simple-reaction/simple-reaction.csproj"
WORKDIR "/src/examples/simple-reaction"
RUN dotnet build "./simple-reaction.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM mcr.microsoft.com/dotnet/aspnet:8.0-cbl-mariner2.0 AS final
WORKDIR /app
COPY --from=build /app/build .
ENTRYPOINT ["/app/simple-reaction"]
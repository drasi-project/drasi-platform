FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["kubernetes-reactivator.csproj", "."]
RUN dotnet restore "./kubernetes-reactivator.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "kubernetes-reactivator.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "kubernetes-reactivator.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "kubernetes-reactivator.dll"]
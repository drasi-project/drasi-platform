FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["performance-reaction.csproj", "."]
RUN dotnet restore "./performance-reaction.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "performance-reaction.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "performance-reaction.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "performance-reaction.dll"]
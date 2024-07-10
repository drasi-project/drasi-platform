#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["eventgrid-reaction.csproj", "."]
RUN dotnet restore "./eventgrid-reaction.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "eventgrid-reaction.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "eventgrid-reaction.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "eventgrid-reaction.dll"]
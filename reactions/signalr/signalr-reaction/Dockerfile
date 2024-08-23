#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet@sha256:22414f335b79654fb42257326e7f17f18edf8f912578fc33a55c5dd609bd022e AS base
WORKDIR /app
EXPOSE 80

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk@sha256:6df1177e48b55272316d08f19cb383483af82aca5cdc67a76c414bc200847624 AS build
WORKDIR /src
COPY ["signalr-reaction.csproj", "."]
RUN dotnet restore "./signalr-reaction.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "signalr-reaction.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "signalr-reaction.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "signalr-reaction.dll"]
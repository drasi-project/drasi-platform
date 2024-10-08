# Copyright 2024 The Drasi Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet@sha256:22414f335b79654fb42257326e7f17f18edf8f912578fc33a55c5dd609bd022e AS base
# mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
EXPOSE 80

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk@sha256:6df1177e48b55272316d08f19cb383483af82aca5cdc67a76c414bc200847624 AS build
# mcr.microsoft.com/dotnet/sdk:6.0
WORKDIR /src
COPY ["debezium-reaction.csproj", "."]
RUN dotnet restore "./debezium-reaction.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "debezium-reaction.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "debezium-reaction.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "debezium-reaction.dll"]
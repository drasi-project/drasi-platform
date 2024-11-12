
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

FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/aspnet@sha256:d53ebf3481ea8ac8e4fa5c4213ae1f32a33e68e5b8181868edb11d0496a00432 AS base
# mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
EXPOSE 80

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk@sha256:f91f9181d68b5ed2c8dea199dbbd2f6d172e60bdc43f8a67878b1ad140cf8d6b AS build
# mcr.microsoft.com/dotnet/sdk:8.
WORKDIR /src
COPY ["gremlin-reaction.csproj", "."]
RUN dotnet restore "./gremlin-reaction.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "gremlin-reaction.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "gremlin-reaction.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "gremlin-reaction.dll"]
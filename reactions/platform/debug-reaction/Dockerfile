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

# Stage 1: Build React frontend
FROM node:18 AS frontend
WORKDIR /app/debug-reaction.client
COPY ./debug-reaction.client/package.json ./debug-reaction.client/package-lock.json ./
RUN npm install
COPY ./debug-reaction.client/ ./
RUN npm run build
# Debug: Verify dist contents
RUN ls -la /app/debug-reaction.client/dist/

# Stage 2: Build .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend
WORKDIR /app/debug-reaction.Server
COPY ./debug-reaction.Server.csproj ./
RUN dotnet restore
COPY . ./
COPY --from=frontend /app/debug-reaction.client/dist ./wwwroot/
# Debug: Verify wwwroot contents
RUN ls -la ./wwwroot/
RUN dotnet publish -c Release -o /app/publish

# Stage 3: Run the app
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend /app/publish .
EXPOSE 5195
ENTRYPOINT ["dotnet", "debug-reaction.Server.dll"]

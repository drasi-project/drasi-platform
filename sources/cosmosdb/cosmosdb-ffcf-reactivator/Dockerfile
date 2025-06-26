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

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk@sha256:6df1177e48b55272316d08f19cb383483af82aca5cdc67a76c414bc200847624 AS build-env

WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -o out


FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/runtime@sha256:9563e814250fef5dde24cd68916878ef5faa8f993bf99a06db1c947f23217996

WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "cosmosdb-reactivator.dll" ]
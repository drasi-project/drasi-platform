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

FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk@sha256:faa2daf2b72cbe787ee1882d9651fa4ef3e938ee56792b8324516f5a448f3abe AS build-env

WORKDIR /app

COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -o out


FROM --platform=$TARGETPLATFORM mcr.microsoft.com/dotnet/runtime@sha256:437cda84bdce26ce074d88b63abeec567c7226d73e8b911605077468e1d5c8d5

WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "cosmosdb-reactivator.dll" ]
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

FROM node@sha256:6239c8a63890ed145ae719574112bc2e37e839a56323bef8d292a579102cdfc2
#node:18-alpine3.16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm audit fix
RUN if [ "$RUNTIME_ENV" = "debug" ]; then apk add --no-cache bash curl ; fi
COPY . .

CMD ["node", "sourceProxy.js"]
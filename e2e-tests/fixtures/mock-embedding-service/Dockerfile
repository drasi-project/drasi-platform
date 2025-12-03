# Copyright 2025 The Drasi Authors.
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

FROM node:20-alpine

# Create app directory and set ownership to node user
WORKDIR /app
RUN chown node:node /app

# Switch to non-root user before copying files
USER node

# Copy package files (as node user, so files are owned by node)
COPY --chown=node:node package.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application code
COPY --chown=node:node server.js ./

# Expose port
EXPOSE 8080

# Set default environment variables
ENV PORT=8080
ENV EMBEDDING_DIMENSIONS=3072

# Health check
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Start the service
CMD ["node", "server.js"]

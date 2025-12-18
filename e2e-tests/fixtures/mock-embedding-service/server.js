/**
 * Copyright 2025 The Drasi Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Mock Azure OpenAI Embedding Service
 *
 * This service mimics the Azure OpenAI embeddings API for e2e testing.
 * It generates deterministic embeddings based on text content using SHA-256 hashing,
 * allowing fork contributors to test the vector store pipeline without Azure credentials.
 *
 * API Contract (Azure OpenAI Embeddings):
 *   POST /openai/deployments/{model}/embeddings?api-version={version}
 *   Headers: api-key: {key}
 *   Body: { "input": ["text1", "text2", ...] }
 *   Response: { "data": [{ "embedding": [...], "index": 0 }, ...], "model": "...", "usage": {...} }
 */

const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json({ limit: '10mb' }));

// Configuration
const PORT = parseInt(process.env.PORT || '8080');
const DIMENSIONS = parseInt(process.env.EMBEDDING_DIMENSIONS || '3072');

console.log(`Mock Embedding Service starting with ${DIMENSIONS} dimensions...`);

/**
 * Generate a deterministic embedding vector from text using SHA-256.
 * The same text will always produce the same embedding, enabling reproducible tests.
 *
 * @param {string} text - Input text to embed
 * @param {number} dimensions - Number of dimensions for the output vector
 * @returns {number[]} - Normalized embedding vector as array of floats
 */
function generateDeterministicEmbedding(text, dimensions) {
  // Create SHA-256 hash of the input text
  const hash = crypto.createHash('sha256').update(text).digest();

  const embedding = [];

  // Generate deterministic floats from hash bytes
  // We cycle through the 32-byte hash to generate all dimensions
  for (let i = 0; i < dimensions; i++) {
    // Use 4 bytes to create each float value for better distribution
    const byteIndex = (i * 4) % 32;
    const seed = (hash[byteIndex] << 24) |
                 (hash[(byteIndex + 1) % 32] << 16) |
                 (hash[(byteIndex + 2) % 32] << 8) |
                 (hash[(byteIndex + 3) % 32]);

    // Convert to float in range [-1, 1]
    // Use unsigned interpretation and map to [-1, 1]
    const unsignedSeed = seed >>> 0; // Convert to unsigned 32-bit
    const value = (unsignedSeed / 0xFFFFFFFF) * 2 - 1;
    embedding.push(value);
  }

  // Normalize to unit vector (important for cosine similarity)
  const magnitude = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
  if (magnitude > 0) {
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] = embedding[i] / magnitude;
    }
  }

  return embedding;
}

/**
 * Convert an array of floats to Base64-encoded binary format.
 * This matches the format expected by the OpenAI SDK when using base64 encoding.
 * Each float is encoded as IEEE 754 32-bit little-endian.
 *
 * @param {number[]} floatArray - Array of float values
 * @returns {string} - Base64-encoded string
 */
function floatArrayToBase64(floatArray) {
  // Create a buffer to hold all floats (4 bytes per float)
  const buffer = Buffer.alloc(floatArray.length * 4);

  // Write each float as a 32-bit IEEE 754 little-endian value
  for (let i = 0; i < floatArray.length; i++) {
    buffer.writeFloatLE(floatArray[i], i * 4);
  }

  return buffer.toString('base64');
}

/**
 * Azure OpenAI Embeddings API endpoint
 *
 * Matches the Azure OpenAI API contract:
 * POST /openai/deployments/{deployment-id}/embeddings?api-version=2023-05-15
 *
 * Supports both 'float' and 'base64' encoding formats.
 * The OpenAI SDK v2.x uses base64 by default for efficiency.
 */
app.post('/openai/deployments/:model/embeddings', (req, res) => {
  const startTime = Date.now();
  const model = req.params.model;
  const apiVersion = req.query['api-version'];

  // Validate API Key presence
  // We don't validate the value, but we ensure the header is present
  // to catch configuration issues in tests (Azure OpenAI requires this header)
  if (!req.headers['api-key']) {
    return res.status(401).json({
      error: {
        message: "Missing 'api-key' header",
        type: "invalid_request_error",
        code: "invalid_api_key"
      }
    });
  }

  // Validate request
  if (!req.body || !req.body.input) {
    return res.status(400).json({
      error: {
        message: "Missing 'input' field in request body",
        type: "invalid_request_error",
        code: "invalid_request"
      }
    });
  }

  // Normalize input to array
  const inputs = Array.isArray(req.body.input) ? req.body.input : [req.body.input];

  if (inputs.length === 0) {
    return res.status(400).json({
      error: {
        message: "Input array cannot be empty",
        type: "invalid_request_error",
        code: "invalid_request"
      }
    });
  }

  // Check encoding format (default to base64 as that's what OpenAI SDK v2.x expects)
  const encodingFormat = req.body.encoding_format || 'base64';

  // Generate embeddings for each input
  const data = inputs.map((text, index) => {
    const textStr = String(text);
    const embeddingFloats = generateDeterministicEmbedding(textStr, DIMENSIONS);

    // Return embedding in the requested format
    const embedding = encodingFormat === 'base64'
      ? floatArrayToBase64(embeddingFloats)
      : embeddingFloats;

    return {
      object: 'embedding',
      embedding: embedding,
      index: index
    };
  });

  // Calculate mock token usage (rough estimate: 1 token per 4 chars)
  const totalTokens = inputs.reduce((sum, text) => sum + Math.ceil(String(text).length / 4), 0);

  const response = {
    object: 'list',
    data: data,
    model: model,
    usage: {
      prompt_tokens: totalTokens,
      total_tokens: totalTokens
    }
  };

  const duration = Date.now() - startTime;
  console.log(`[${new Date().toISOString()}] Generated ${inputs.length} embeddings (${DIMENSIONS}D, ${encodingFormat}) in ${duration}ms for model: ${model} (api-version: ${apiVersion || 'none'})`);

  res.json(response);
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'mock-embedding-service',
    dimensions: DIMENSIONS,
    timestamp: new Date().toISOString()
  });
});

/**
 * Root endpoint - service info
 */
app.get('/', (req, res) => {
  res.json({
    service: 'Mock Azure OpenAI Embedding Service',
    description: 'Generates deterministic embeddings for e2e testing',
    dimensions: DIMENSIONS,
    endpoints: {
      embeddings: 'POST /openai/deployments/{model}/embeddings',
      health: 'GET /health'
    }
  });
});

// Error handling middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // 'next' is unused but required for Express error handling signature (4 args)
  console.error(`[${new Date().toISOString()}] Error:`, err.message);
  res.status(500).json({
    error: {
      message: 'Internal server error',
      type: 'server_error',
      code: 'internal_error'
    }
  });
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock Embedding Service running on port ${PORT}`);
  console.log(`Embedding dimensions: ${DIMENSIONS}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

// Export for testing
module.exports = {
  generateDeterministicEmbedding,
  server // Export server instance to allow clean shutdown in tests if needed
};

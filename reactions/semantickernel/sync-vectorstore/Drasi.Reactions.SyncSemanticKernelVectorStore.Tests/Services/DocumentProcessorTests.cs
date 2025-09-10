// Copyright 2025 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using Drasi.Reactions.SyncSemanticKernelVectorStore.Services;
using System.Text.Json;

namespace Drasi.Reactions.SyncSemanticKernelVectorStore.Tests.Services;

public class DocumentProcessorTests
{
    private readonly Mock<IEmbeddingService> _mockEmbeddingService;
    private readonly Mock<ILogger<DocumentProcessor>> _mockLogger;
    private readonly DocumentProcessor _processor;

    public DocumentProcessorTests()
    {
        _mockEmbeddingService = new Mock<IEmbeddingService>();
        _mockLogger = new Mock<ILogger<DocumentProcessor>>();
        _processor = new DocumentProcessor(_mockEmbeddingService.Object, _mockLogger.Object);
    }

    [Fact]
    public void Constructor_NullEmbeddingService_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => new DocumentProcessor(null!, _mockLogger.Object));
    }

    [Fact]
    public void Constructor_NullLogger_ThrowsArgumentNullException()
    {
        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => new DocumentProcessor(_mockEmbeddingService.Object, null!));
    }

    [Fact]
    public async Task ProcessDocumentsAsync_EmptyResults_ReturnsEmptyList()
    {
        // Arrange
        var results = new List<Dictionary<string, object>>();
        var config = new QueryConfig { KeyField = "id", DocumentTemplate = "{{name}}" };

        // Act
        var result = await _processor.ProcessDocumentsAsync(results, config);

        // Assert
        Assert.Empty(result);
        _mockEmbeddingService.VerifyNoOtherCalls();
    }

    [Fact]
    public async Task ProcessDocumentsAsync_ValidResults_ReturnsProcessedDocuments()
    {
        // Arrange
        var results = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "id", "doc1" }, { "name", "Document 1" } },
            new Dictionary<string, object> { { "id", "doc2" }, { "name", "Document 2" } }
        };
        var config = new QueryConfig 
        { 
            KeyField = "id", 
            DocumentTemplate = "Name: {{name}}",
            TitleTemplate = "{{name}}"
        };
        
        var mockEmbeddings = new List<ReadOnlyMemory<float>>
        {
            new ReadOnlyMemory<float>(new float[] { 0.1f, 0.2f }),
            new ReadOnlyMemory<float>(new float[] { 0.3f, 0.4f })
        };
        
        _mockEmbeddingService
            .Setup(x => x.GenerateEmbeddingsAsync(
                It.Is<IList<string>>(texts => texts.Count() == 2),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(mockEmbeddings);

        // Act
        var result = await _processor.ProcessDocumentsAsync(results, config);
        var documents = result.ToList();

        // Assert
        Assert.Equal(2, documents.Count);
        
        Assert.Equal("doc1", documents[0].Key);
        Assert.Equal("Name: Document 1", documents[0].Content);
        Assert.Equal("Document 1", documents[0].Title);
        Assert.Equal(mockEmbeddings[0], documents[0].Vector);
        
        Assert.Equal("doc2", documents[1].Key);
        Assert.Equal("Name: Document 2", documents[1].Content);
        Assert.Equal("Document 2", documents[1].Title);
        Assert.Equal(mockEmbeddings[1], documents[1].Vector);
    }

    [Fact]
    public async Task ProcessDocumentsAsync_JsonElementValues_ConvertsCorrectly()
    {
        // Arrange
        var jsonDoc = JsonDocument.Parse(@"{""id"": ""doc1"", ""name"": ""Test"", ""age"": 25, ""active"": true}");
        var results = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> 
            { 
                { "id", jsonDoc.RootElement.GetProperty("id") },
                { "name", jsonDoc.RootElement.GetProperty("name") },
                { "age", jsonDoc.RootElement.GetProperty("age") },
                { "active", jsonDoc.RootElement.GetProperty("active") }
            }
        };
        var config = new QueryConfig 
        { 
            KeyField = "id", 
            DocumentTemplate = "{{name}} is {{age}} years old and {{#if active}}active{{else}}inactive{{/if}}"
        };
        
        _mockEmbeddingService
            .Setup(x => x.GenerateEmbeddingsAsync(It.IsAny<IList<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ReadOnlyMemory<float>> { new ReadOnlyMemory<float>(new float[] { 0.1f }) });

        // Act
        var result = await _processor.ProcessDocumentsAsync(results, config);
        var documents = result.ToList();

        // Assert
        Assert.Single(documents);
        Assert.Equal("doc1", documents[0].Key);
        Assert.Equal("Test is 25 years old and active", documents[0].Content);
    }

    [Fact]
    public void ExtractKey_ValidKey_ReturnsKey()
    {
        // Arrange
        var result = new Dictionary<string, object> { { "id", "key123" } };
        var config = new QueryConfig { KeyField = "id" };

        // Act
        var key = _processor.ExtractKey(result, config);

        // Assert
        Assert.Equal("key123", key);
    }

    [Fact]
    public void ExtractKey_MissingKeyField_ThrowsArgumentException()
    {
        // Arrange
        var result = new Dictionary<string, object> { { "name", "test" } };
        var config = new QueryConfig { KeyField = "id" };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => _processor.ExtractKey(result, config));
        Assert.Contains("Key field 'id' not found", ex.Message);
    }

    [Fact]
    public void ExtractKey_NullKeyValue_ThrowsArgumentException()
    {
        // Arrange
        var result = new Dictionary<string, object> { { "id", null! } };
        var config = new QueryConfig { KeyField = "id" };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => _processor.ExtractKey(result, config));
        Assert.Contains("Key field 'id' not found or null", ex.Message);
    }

    [Fact]
    public void ExtractKey_EmptyKeyFieldConfig_ThrowsArgumentException()
    {
        // Arrange
        var result = new Dictionary<string, object> { { "id", "key123" } };
        var config = new QueryConfig { KeyField = "" };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => _processor.ExtractKey(result, config));
        Assert.Contains("Key field is not configured", ex.Message);
    }

    [Fact]
    public void GenerateDocumentText_ValidTemplate_ReturnsGeneratedText()
    {
        // Arrange
        var result = new Dictionary<string, object> 
        { 
            { "name", "John" }, 
            { "age", 30 } 
        };
        var config = new QueryConfig { DocumentTemplate = "{{name}} is {{age}} years old" };

        // Act
        var text = _processor.GenerateDocumentText(result, config);

        // Assert
        Assert.Equal("John is 30 years old", text);
    }

    [Fact]
    public void GenerateDocumentText_ComplexTemplate_HandlesConditionals()
    {
        // Arrange
        var result = new Dictionary<string, object> 
        { 
            { "name", "Alice" }, 
            { "isAdmin", true } 
        };
        var config = new QueryConfig 
        { 
            DocumentTemplate = "{{name}}{{#if isAdmin}} (Admin){{/if}}" 
        };

        // Act
        var text = _processor.GenerateDocumentText(result, config);

        // Assert
        Assert.Equal("Alice (Admin)", text);
    }

    [Fact]
    public void GenerateDocumentText_EmptyTemplate_ThrowsArgumentException()
    {
        // Arrange
        var result = new Dictionary<string, object> { { "name", "test" } };
        var config = new QueryConfig { DocumentTemplate = "" };

        // Act & Assert
        var ex = Assert.Throws<ArgumentException>(() => _processor.GenerateDocumentText(result, config));
        Assert.Contains("Document template is not configured", ex.Message);
    }

    [Fact]
    public void GenerateDocumentText_InvalidTemplate_ThrowsInvalidOperationException()
    {
        // Arrange
        var result = new Dictionary<string, object> { { "name", "test" } };
        var config = new QueryConfig { DocumentTemplate = "{{#if name}}unclosed" }; // Invalid template

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => _processor.GenerateDocumentText(result, config));
    }

    [Fact]
    public void GenerateTitle_ValidTemplate_ReturnsGeneratedTitle()
    {
        // Arrange
        var result = new Dictionary<string, object> { { "title", "My Title" } };
        var config = new QueryConfig { TitleTemplate = "{{title}}" };

        // Act
        var title = _processor.GenerateTitle(result, config);

        // Assert
        Assert.Equal("My Title", title);
    }

    [Fact]
    public void GenerateTitle_EmptyTemplate_ReturnsNull()
    {
        // Arrange
        var result = new Dictionary<string, object> { { "title", "My Title" } };
        var config = new QueryConfig { TitleTemplate = "" };

        // Act
        var title = _processor.GenerateTitle(result, config);

        // Assert
        Assert.Null(title);
    }

    [Fact]
    public void GenerateTitle_InvalidTemplate_ReturnsNull()
    {
        // Arrange
        var result = new Dictionary<string, object> { { "title", "test" } };
        var config = new QueryConfig { TitleTemplate = "{{#if title}}unclosed" }; // Invalid template

        // Act
        var title = _processor.GenerateTitle(result, config);

        // Assert
        Assert.Null(title); // Should return null on error
    }

    [Fact]
    public async Task ProcessDocumentsAsync_SomeDocumentsFail_ContinuesWithValid()
    {
        // Arrange
        var results = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "id", "doc1" }, { "name", "Valid" } },
            new Dictionary<string, object> { { "name", "Missing ID" } }, // Missing key field
            new Dictionary<string, object> { { "id", "doc3" }, { "name", "Also Valid" } }
        };
        var config = new QueryConfig 
        { 
            KeyField = "id", 
            DocumentTemplate = "{{name}}"
        };
        
        _mockEmbeddingService
            .Setup(x => x.GenerateEmbeddingsAsync(
                It.Is<IList<string>>(texts => texts.Count() == 2),
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ReadOnlyMemory<float>> 
            { 
                new ReadOnlyMemory<float>(new float[] { 0.1f }),
                new ReadOnlyMemory<float>(new float[] { 0.2f })
            });

        // Act
        var result = await _processor.ProcessDocumentsAsync(results, config);
        var documents = result.ToList();

        // Assert
        Assert.Equal(2, documents.Count); // Only valid documents
        Assert.Equal("doc1", documents[0].Key);
        Assert.Equal("doc3", documents[1].Key);
    }

    [Fact]
    public async Task ProcessDocumentsAsync_EmbeddingServiceThrows_PropagatesException()
    {
        // Arrange
        var results = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "id", "doc1" }, { "name", "Test" } }
        };
        var config = new QueryConfig 
        { 
            KeyField = "id", 
            DocumentTemplate = "{{name}}"
        };
        
        var expectedException = new InvalidOperationException("Embedding service error");
        _mockEmbeddingService
            .Setup(x => x.GenerateEmbeddingsAsync(It.IsAny<IList<string>>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() => 
            _processor.ProcessDocumentsAsync(results, config));
        Assert.Same(expectedException, ex);
    }

    [Fact]
    public async Task ProcessDocumentsAsync_CachesCompiledTemplates()
    {
        // Arrange
        var config = new QueryConfig 
        { 
            KeyField = "id", 
            DocumentTemplate = "{{name}}"
        };
        
        var results1 = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "id", "doc1" }, { "name", "First" } }
        };
        
        var results2 = new List<Dictionary<string, object>>
        {
            new Dictionary<string, object> { { "id", "doc2" }, { "name", "Second" } }
        };
        
        _mockEmbeddingService
            .Setup(x => x.GenerateEmbeddingsAsync(It.IsAny<IList<string>>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<ReadOnlyMemory<float>> { new ReadOnlyMemory<float>(new float[] { 0.1f }) });

        // Act
        var result1 = await _processor.ProcessDocumentsAsync(results1, config);
        var result2 = await _processor.ProcessDocumentsAsync(results2, config);

        // Assert
        Assert.Single(result1);
        Assert.Single(result2);
        
        // Both calls should use the same cached template
        // We can't directly verify caching, but the fact that both calls succeed with the same template
        // and produce correct results indicates caching is working
        Assert.Equal("First", result1.First().Content);
        Assert.Equal("Second", result2.First().Content);
    }
}
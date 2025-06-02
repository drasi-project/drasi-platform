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
using Microsoft.Extensions.Configuration;
using Drasi.Reaction.SDK.Services;
using System.Net;
using Moq.Protected;

namespace Drasi.Reactions.SyncDaprStateStore.Tests;
public class ExtendedManagementClientTests
{
    private readonly Mock<IHttpClientFactory> _mockHttpClientFactory;
    private readonly Mock<IManagementClient> _mockInnerManagementClient;
    private readonly Mock<ILogger<ExtendedManagementClient>> _mockLogger;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly ExtendedManagementClient _client;
    private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
    private readonly HttpClient _httpClient;

    public ExtendedManagementClientTests()
    {
        _mockHttpClientFactory = new Mock<IHttpClientFactory>();
        _mockInnerManagementClient = new Mock<IManagementClient>();
        _mockLogger = new Mock<ILogger<ExtendedManagementClient>>();
        _mockConfiguration = new Mock<IConfiguration>();

        _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_mockHttpMessageHandler.Object);

        _mockHttpClientFactory.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(_httpClient);
        _mockConfiguration.Setup(c => c[ExtendedManagementClient.DrasiManagementApiBaseUrlConfigKey])
            .Returns(ExtendedManagementClient.DefaultDrasiManagementApiBaseUrl);

        _client = new ExtendedManagementClient(
            _mockHttpClientFactory.Object,
            _mockInnerManagementClient.Object,
            _mockConfiguration.Object,
            _mockLogger.Object);
    }

    // Tests that WaitForQueryReadyAsync throws ArgumentNullException for null queryId.
    [Fact]
    public async Task WaitForQueryReadyAsync_NullQueryId_ThrowsArgumentNullException()
    {
        await Assert.ThrowsAsync<ArgumentNullException>(() => _client.WaitForQueryReadyAsync(null!));
    }

    // Tests that WaitForQueryReadyAsync throws ArgumentNullException for empty queryId.
    [Fact]
    public async Task WaitForQueryReadyAsync_EmptyQueryId_ThrowsArgumentNullException()
    {
        await Assert.ThrowsAsync<ArgumentNullException>(() => _client.WaitForQueryReadyAsync(" "));
    }

    // Tests that WaitForQueryReadyAsync returns true when HTTP response is successful.
    [Fact]
    public async Task WaitForQueryReadyAsync_SuccessfulResponse_ReturnsTrue()
    {
        var queryId = "testQuery";
        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.OK,
                Content = new StringContent("")
            });

        var result = await _client.WaitForQueryReadyAsync(queryId);
        Assert.True(result);
    }

    // Tests that WaitForQueryReadyAsync returns false for ServiceUnavailable status.
    [Fact]
    public async Task WaitForQueryReadyAsync_ServiceUnavailable_ReturnsFalse()
    {
        var queryId = "testQuery";
        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.ServiceUnavailable,
                Content = new StringContent("")
            });

        var result = await _client.WaitForQueryReadyAsync(queryId);
        Assert.False(result);
    }

    // Tests that WaitForQueryReadyAsync returns false for NotFound status.
    [Fact]
    public async Task WaitForQueryReadyAsync_NotFound_ReturnsFalse()
    {
        var queryId = "testQuery";
        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.NotFound,
                Content = new StringContent("")
            });

        var result = await _client.WaitForQueryReadyAsync(queryId);
        Assert.False(result);
    }

    // Tests that WaitForQueryReadyAsync returns false for other non-success status codes.
    [Fact]
    public async Task WaitForQueryReadyAsync_OtherErrorStatusCode_ReturnsFalse()
    {
        var queryId = "testQuery";
        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ReturnsAsync(new HttpResponseMessage
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Content = new StringContent("Error")
            });

        var result = await _client.WaitForQueryReadyAsync(queryId);
        Assert.False(result);
    }
    
    // Tests that WaitForQueryReadyAsync returns false when OperationCanceledException occurs.
    [Fact]
    public async Task WaitForQueryReadyAsync_OperationCanceled_ReturnsFalse()
    {
        var queryId = "testQuery";
        var cts = new CancellationTokenSource();
        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ThrowsAsync(new OperationCanceledException(cts.Token));
        
        cts.Cancel();
        var result = await _client.WaitForQueryReadyAsync(queryId, waitSeconds: 5, cancellationToken: cts.Token);
        Assert.False(result);
    }

    // Tests that WaitForQueryReadyAsync returns false when HttpRequestException occurs.
    [Fact]
    public async Task WaitForQueryReadyAsync_HttpRequestException_ReturnsFalse()
    {
        var queryId = "testQuery";
        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ThrowsAsync(new HttpRequestException("Request failed"));

        var result = await _client.WaitForQueryReadyAsync(queryId);
        Assert.False(result);
    }

    // Tests that WaitForQueryReadyAsync throws when a generic Exception occurs.
    [Fact]
    public async Task WaitForQueryReadyAsync_GenericException_Throws()
    {
        var queryId = "testQuery";
        _mockHttpMessageHandler.Protected()
            .Setup<Task<HttpResponseMessage>>(
                "SendAsync",
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            )
            .ThrowsAsync(new Exception("Unexpected error"));

        await Assert.ThrowsAsync<Exception>(() => _client.WaitForQueryReadyAsync(queryId));
    }

    // Tests that GetQueryContainerId calls the inner IManagementClient's method.
    [Fact]
    public async Task GetQueryContainerId_CallsInnerClient()
    {
        var queryId = "testQuery";
        var expectedContainerId = "container123";
        _mockInnerManagementClient.Setup(c => c.GetQueryContainerId(queryId)).ReturnsAsync(expectedContainerId);

        var result = await _client.GetQueryContainerId(queryId);

        Assert.Equal(expectedContainerId, result);
        _mockInnerManagementClient.Verify(c => c.GetQueryContainerId(queryId), Times.Once);
    }
}
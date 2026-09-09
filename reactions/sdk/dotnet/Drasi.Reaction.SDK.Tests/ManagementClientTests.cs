using System.Net;
using Drasi.Reaction.SDK.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Moq;
using Moq.Protected;

namespace Drasi.Reactions.SDK.Tests;
public class ManagementClientTests
{
    private readonly Mock<IHttpClientFactory> _mockHttpClientFactory;
    private readonly Mock<ILogger<ManagementClient>> _mockLogger;
    private readonly Mock<IConfiguration> _mockConfiguration;
    private readonly ManagementClient _client;
    private readonly Mock<HttpMessageHandler> _mockHttpMessageHandler;
    private readonly HttpClient _httpClient;

    public ManagementClientTests()
    {
        _mockHttpClientFactory = new Mock<IHttpClientFactory>();
        _mockLogger = new Mock<ILogger<ManagementClient>>();
        _mockConfiguration = new Mock<IConfiguration>();

        _mockHttpMessageHandler = new Mock<HttpMessageHandler>();
        _httpClient = new HttpClient(_mockHttpMessageHandler.Object);

        _mockHttpClientFactory.Setup(f => f.CreateClient(It.IsAny<string>())).Returns(_httpClient);
        _mockConfiguration.Setup(c => c[ManagementClient.DrasiManagementApiBaseUrlConfigKey])
            .Returns(ManagementClient.DefaultDrasiManagementApiBaseUrl);

        _client = new ManagementClient(
            _mockHttpClientFactory.Object,
            _mockConfiguration.Object,
            _mockLogger.Object);
    }

    // null queryId throws ArgumentNullException
    [Fact]
    public async Task WaitForQueryReadyAsync_NullQueryId_ThrowsArgumentNullException()
    {
        await Assert.ThrowsAsync<ArgumentNullException>(() => _client.WaitForQueryReadyAsync(null!));
    }

    // whitespace queryId throws ArgumentNullException
    [Fact]
    public async Task WaitForQueryReadyAsync_EmptyQueryId_ThrowsArgumentNullException()
    {
        await Assert.ThrowsAsync<ArgumentNullException>(() => _client.WaitForQueryReadyAsync(" "));
    }

    // HTTP 200 returns true
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

    // HTTP 503 returns false
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

    // HTTP 404 returns false
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

    // other error codes return false
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

    // OperationCanceledException returns false
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

    // HttpRequestException returns false
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

    // unexpected exception is re-thrown
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
}
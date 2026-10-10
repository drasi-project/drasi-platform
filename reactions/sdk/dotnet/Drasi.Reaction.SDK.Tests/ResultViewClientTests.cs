// Copyright 2024 The Drasi Authors.
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

using System.Net;
using Drasi.Reaction.SDK.Services;
using Moq;

namespace Drasi.Reaction.SDK.Tests;

public class ResultViewClientTests
{
    [Fact]
    public async Task GetCurrentResult_ReturnsEmptyStream_WhenNoResults()
    {
        var handler = new MockHttpMessageHandler();
        var queryContainerId = "container-123";
        var queryId = "test-query";

        handler.SetupResponse($"http://{queryContainerId}-view-svc/{queryId}", "[]");

        var mockManagementClient = new Mock<IManagementClient>();
        var httpClient = new HttpClient(handler);
        var client = new ResultViewClient(httpClient, mockManagementClient.Object);

        var results = new List<Models.ViewService.ViewItem>();
        await foreach (var item in client.GetCurrentResult(queryContainerId, queryId))
        {
            results.Add(item);
        }

        Assert.Empty(results);
    }

    [Fact]
    public async Task GetCurrentResult_ReturnsSingleItem_WhenOneResultExists()
    {
        var handler = new MockHttpMessageHandler();
        var queryContainerId = "container-123";
        var queryId = "test-query";
        var responseJson = """
            [
                {
                    "header": {
                        "sequence": 1,
                        "state": "active",
                        "timestamp": 1234567890
                    },
                    "data": {
                        "id": "item-1",
                        "name": "Test Item"
                    }
                }
            ]
            """;

        handler.SetupResponse($"http://{queryContainerId}-view-svc/{queryId}", responseJson);

        var mockManagementClient = new Mock<IManagementClient>();
        var httpClient = new HttpClient(handler);
        var client = new ResultViewClient(httpClient, mockManagementClient.Object);

        var results = new List<Models.ViewService.ViewItem>();
        await foreach (var item in client.GetCurrentResult(queryContainerId, queryId))
        {
            results.Add(item);
        }

        Assert.Single(results);
        Assert.Equal(1, results[0].Header.Sequence);
        Assert.Equal("active", results[0].Header.State);
        Assert.Equal(1234567890, results[0].Header.Timestamp);
    }

    [Fact]
    public async Task GetCurrentResult_StreamsMultipleItems_WhenMultipleResultsExist()
    {
        var handler = new MockHttpMessageHandler();
        var queryContainerId = "container-123";
        var queryId = "test-query";
        var responseJson = """
            [
                {
                    "header": { "sequence": 1, "timestamp": 1000 },
                    "data": { "id": "item-1" }
                },
                {
                    "header": { "sequence": 2, "timestamp": 2000 },
                    "data": { "id": "item-2" }
                },
                {
                    "header": { "sequence": 3, "timestamp": 3000 },
                    "data": { "id": "item-3" }
                }
            ]
            """;

        handler.SetupResponse($"http://{queryContainerId}-view-svc/{queryId}", responseJson);

        var mockManagementClient = new Mock<IManagementClient>();
        var httpClient = new HttpClient(handler);
        var client = new ResultViewClient(httpClient, mockManagementClient.Object);

        var results = new List<Models.ViewService.ViewItem>();
        await foreach (var item in client.GetCurrentResult(queryContainerId, queryId))
        {
            results.Add(item);
        }

        Assert.Equal(3, results.Count);
        Assert.Equal(1, results[0].Header.Sequence);
        Assert.Equal(2, results[1].Header.Sequence);
        Assert.Equal(3, results[2].Header.Sequence);
    }

    [Fact]
    public async Task GetCurrentResult_ReturnsEmptyStream_WhenHttpErrorOccurs()
    {
        var handler = new MockHttpMessageHandler();
        var queryContainerId = "container-123";
        var queryId = "test-query";

        handler.SetupErrorResponse($"http://{queryContainerId}-view-svc/{queryId}", HttpStatusCode.InternalServerError);

        var mockManagementClient = new Mock<IManagementClient>();
        var httpClient = new HttpClient(handler);
        var client = new ResultViewClient(httpClient, mockManagementClient.Object);

        var results = new List<Models.ViewService.ViewItem>();
        await foreach (var item in client.GetCurrentResult(queryContainerId, queryId))
        {
            results.Add(item);
        }

        Assert.Empty(results);
    }

    [Fact]
    public async Task GetCurrentResult_CallsManagementClient_WhenUsingQueryIdOverload()
    {
        var handler = new MockHttpMessageHandler();
        var queryContainerId = "resolved-container";
        var queryId = "test-query";

        handler.SetupResponse($"http://{queryContainerId}-view-svc/{queryId}", "[]");

        var mockManagementClient = new Mock<IManagementClient>();
        mockManagementClient
            .Setup(m => m.GetQueryContainerId(queryId))
            .ReturnsAsync(queryContainerId);

        var httpClient = new HttpClient(handler);
        var client = new ResultViewClient(httpClient, mockManagementClient.Object);

        var results = new List<Models.ViewService.ViewItem>();
        await foreach (var item in client.GetCurrentResult(queryId))
        {
            results.Add(item);
        }

        mockManagementClient.Verify(m => m.GetQueryContainerId(queryId), Times.Once);
    }

    [Fact]
    public async Task GetCurrentResult_MakesCorrectHttpRequest()
    {
        var handler = new MockHttpMessageHandler();
        var queryContainerId = "my-container";
        var queryId = "my-query";

        handler.SetupResponse($"http://{queryContainerId}-view-svc/{queryId}", "[]");

        var mockManagementClient = new Mock<IManagementClient>();
        var httpClient = new HttpClient(handler);
        var client = new ResultViewClient(httpClient, mockManagementClient.Object);

        await foreach (var _ in client.GetCurrentResult(queryContainerId, queryId)) { }

        Assert.Single(handler.Requests);
        Assert.Equal($"http://{queryContainerId}-view-svc/{queryId}", handler.Requests[0].RequestUri?.ToString());
    }

    [Fact]
    public async Task GetCurrentResult_PropagatesManagementClientException()
    {
        var handler = new MockHttpMessageHandler();
        var queryId = "test-query";

        var mockManagementClient = new Mock<IManagementClient>();
        mockManagementClient
            .Setup(m => m.GetQueryContainerId(queryId))
            .ThrowsAsync(new HttpRequestException("Management API unavailable"));

        var httpClient = new HttpClient(handler);
        var client = new ResultViewClient(httpClient, mockManagementClient.Object);

        await Assert.ThrowsAsync<HttpRequestException>(async () =>
        {
            await foreach (var _ in client.GetCurrentResult(queryId)) { }
        });
    }
}

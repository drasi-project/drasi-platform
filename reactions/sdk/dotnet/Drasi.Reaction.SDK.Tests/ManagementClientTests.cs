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

namespace Drasi.Reaction.SDK.Tests;

public class ManagementClientTests
{
    private const string BaseUrl = "http://drasi-api:8080";

    private static HttpClient CreateHttpClient(MockHttpMessageHandler handler)
    {
        return new HttpClient(handler)
        {
            BaseAddress = new Uri(BaseUrl)
        };
    }

    [Fact]
    public async Task GetQueryContainerId_ReturnsContainerId_WhenResponseIsValid()
    {
        var handler = new MockHttpMessageHandler();
        var queryId = "test-query";
        var expectedContainerId = "my-container-123";
        var responseJson = $$"""
            {
                "spec": {
                    "container": "{{expectedContainerId}}"
                }
            }
            """;

        handler.SetupResponse($"{BaseUrl}/v1/continuousQueries/{queryId}", responseJson);

        var client = new ManagementClient(CreateHttpClient(handler));
        var result = await client.GetQueryContainerId(queryId);

        Assert.Equal(expectedContainerId, result);
    }

    [Fact]
    public async Task GetQueryContainerId_ThrowsHttpRequestException_WhenQueryNotFound()
    {
        var handler = new MockHttpMessageHandler();
        var queryId = "nonexistent-query";

        handler.SetupErrorResponse($"{BaseUrl}/v1/continuousQueries/{queryId}", HttpStatusCode.NotFound);

        var client = new ManagementClient(CreateHttpClient(handler));

        await Assert.ThrowsAsync<HttpRequestException>(() => client.GetQueryContainerId(queryId));
    }

    [Fact]
    public async Task GetQueryContainerId_ThrowsHttpRequestException_WhenServerError()
    {
        var handler = new MockHttpMessageHandler();
        var queryId = "test-query";

        handler.SetupErrorResponse($"{BaseUrl}/v1/continuousQueries/{queryId}", HttpStatusCode.InternalServerError);

        var client = new ManagementClient(CreateHttpClient(handler));

        await Assert.ThrowsAsync<HttpRequestException>(() => client.GetQueryContainerId(queryId));
    }

    [Fact]
    public async Task GetQueryContainerId_ThrowsException_WhenResponseMissingSpec()
    {
        var handler = new MockHttpMessageHandler();
        var queryId = "test-query";
        var responseJson = """
            {
                "data": {}
            }
            """;

        handler.SetupResponse($"{BaseUrl}/v1/continuousQueries/{queryId}", responseJson);

        var client = new ManagementClient(CreateHttpClient(handler));

        await Assert.ThrowsAsync<KeyNotFoundException>(() => client.GetQueryContainerId(queryId));
    }

    [Fact]
    public async Task GetQueryContainerId_ThrowsException_WhenResponseMissingContainer()
    {
        var handler = new MockHttpMessageHandler();
        var queryId = "test-query";
        var responseJson = """
            {
                "spec": {
                    "otherField": "value"
                }
            }
            """;

        handler.SetupResponse($"{BaseUrl}/v1/continuousQueries/{queryId}", responseJson);

        var client = new ManagementClient(CreateHttpClient(handler));

        await Assert.ThrowsAsync<KeyNotFoundException>(() => client.GetQueryContainerId(queryId));
    }

    [Fact]
    public async Task GetQueryContainerId_ThrowsException_WhenContainerIsNull()
    {
        var handler = new MockHttpMessageHandler();
        var queryId = "test-query";
        var responseJson = """
            {
                "spec": {
                    "container": null
                }
            }
            """;

        handler.SetupResponse($"{BaseUrl}/v1/continuousQueries/{queryId}", responseJson);

        var client = new ManagementClient(CreateHttpClient(handler));

        await Assert.ThrowsAsync<Exception>(() => client.GetQueryContainerId(queryId));
    }

    [Fact]
    public async Task GetQueryContainerId_MakesCorrectRequest()
    {
        var handler = new MockHttpMessageHandler();
        var queryId = "my-special-query";
        var responseJson = """
            {
                "spec": {
                    "container": "container-id"
                }
            }
            """;

        handler.SetupResponse($"{BaseUrl}/v1/continuousQueries/{queryId}", responseJson);

        var client = new ManagementClient(CreateHttpClient(handler));
        await client.GetQueryContainerId(queryId);

        Assert.Single(handler.Requests);
        Assert.Equal(HttpMethod.Get, handler.Requests[0].Method);
        Assert.Equal($"{BaseUrl}/v1/continuousQueries/{queryId}", handler.Requests[0].RequestUri?.ToString());
    }
}

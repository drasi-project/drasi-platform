// Copyright 2025 The Drasi Authors
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

namespace Drasi.Reactions.Debug.Server.Controllers;
using Microsoft.AspNetCore.Mvc;
using Drasi.Reactions.Debug.Server.Services;

[ApiController]
[Route("queries")]
public class QueryController : ControllerBase
{
    private readonly IQueryDebugService _debugService;

    private readonly string _configDirectory;

    public QueryController(IQueryDebugService debugService, IConfiguration configuration)
    {
        _debugService = debugService;
        _configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
    }

    // GET queries
    // This endpoint returns a list of active queries.
    [HttpGet]
    public IEnumerable<string> GetQueries()
    {
        var queryList = new List<string>();
        foreach (var qpath in Directory.GetFiles(_configDirectory))
        {
            var queryId = Path.GetFileName(qpath);
            queryList.Add(queryId);
        }
        return queryList;
    }


    // GET queries/{queryId}
    // This endpoint returns the current result of a specific query.
    [HttpGet("{queryId}")]
    public async Task<IActionResult> GetQueryResult(string queryId)
    {
        var result = await _debugService.GetQueryResult(queryId);
        return Ok(result);
    }

    // GET queries/{queryId}/debug-information
    // This endpoint returns the debug information for a specific query.
    [HttpGet("{queryId}/debug-information")]
    public async Task<IActionResult> GetDebugInfo(string queryId)
    {
        var result = await _debugService.GetDebugInfo(queryId);
        return Ok(result);
    }
}
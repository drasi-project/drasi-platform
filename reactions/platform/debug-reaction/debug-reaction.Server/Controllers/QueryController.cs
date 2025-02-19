

// reaction.App().MapGet("/query/initialize/{queryId}", async (string queryId, IQueryDebugService debugService) =>
// {
// 	var result = await debugService.GetQueryResult(queryId);
// 	return Results.Json(result);
// });

// // Used for reinitializing a query
// reaction.App().MapGet("/query/reinitialize/{queryId}", async (string queryId, IQueryDebugService debugService) =>
// {
// 	var result = await debugService.ReinitializeQuery(queryId);
// 	return Results.Json(result);
// });


// // Debug info
// reaction.App().MapGet("/query/debug/{queryId}", async (string queryId, IQueryDebugService debugService) =>
// {
// 	var result = await debugService.GetDebugInfo(queryId);
// 	return Results.Json(result);
// });

namespace Drasi.Reactions.Debug.Server.Controllers;
using Microsoft.AspNetCore.Mvc;
using Drasi.Reactions.Debug.Server.Services;

[ApiController]
[Route("query")]
public class QueryController : ControllerBase
{
    private readonly IQueryDebugService _debugService;

    public QueryController(IQueryDebugService debugService)
    {
        _debugService = debugService;
    }

    [HttpGet("initialize/{queryId}")]
    public async Task<IActionResult> InitializeQuery(string queryId)
    {
        var result = await _debugService.GetQueryResult(queryId);
        return Ok(result);
    }

    [HttpGet("reinitialize/{queryId}")]
    public async Task<IActionResult> ReinitializeQuery(string queryId)
    {
        var result = await _debugService.ReinitializeQuery(queryId);
        return Ok(result);
    }

    [HttpGet("debug/{queryId}")]
    public async Task<IActionResult> GetDebugInfo(string queryId)
    {
        var result = await _debugService.GetDebugInfo(queryId);
        return Ok(result);
    }
}
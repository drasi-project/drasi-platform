using Drasi.Reaction.SDK;
using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Logging;
using Gremlin.Net.Driver;
using Gremlin.Net.Structure.IO.GraphSON;
using Gremlin.Net.Driver.Exceptions;
using System.Net.WebSockets;
using Newtonsoft.Json;

var reaction = new ReactionBuilder()
				.UseChangeEventHandler<GremlinChangeHandler>()
				.ConfigureServices((services) =>
				 {
					 services.AddSingleton<GremlinService>();
				 }).Build();

await reaction.StartAsync();


class GremlinService
{
	private GremlinServer _gremlinServer;

	private GremlinClient _gremlinClient;

	private string _addedResultCommand;

	private string _updatedResultCommand;

	private string _deletedResultCommand;

	private List<string> _addedResultCommandParamList;

	private List<string> _updatedResultCommandParamList;

	private List<string> _deletedResultCommandParamList;

	public GremlinService(IConfiguration configuration)
	{
		var databaseHost = configuration["databaseHost"];
		var databasePort = int.TryParse(configuration["databasePort"], out var port) ? port : 443;
		var databaseEnableSSL = !bool.TryParse(configuration["databaseEnableSSL"], out var enableSSL) || enableSSL;
		
		var useCosmos = bool.TryParse(configuration["useCosmos"], out var cosmos) && cosmos;

		var databasePrimaryKey = configuration["databasePrimaryKey"];

		if (useCosmos) {
			var databaseName = configuration["cosmosDatabaseName"];
		    var databaseContainerName = configuration["cosmosDatabaseContainerName"];

			var containerLink = $"/dbs/{databaseName}/colls/{databaseContainerName}";

			var connectionPoolSettings = new ConnectionPoolSettings()
			{
				MaxInProcessPerConnection = 10,
				PoolSize = 30,
				ReconnectionAttempts = 3,
				ReconnectionBaseDelay = TimeSpan.FromMilliseconds(500)
			};

			var webSocketConfiguration = new Action<ClientWebSocketOptions>(options =>
			{
				options.KeepAliveInterval = TimeSpan.FromSeconds(10);
			});
			_gremlinServer = new GremlinServer(databaseHost, databasePort, enableSsl: databaseEnableSSL, username: containerLink, password: databasePrimaryKey);
			_gremlinClient = new GremlinClient(
				_gremlinServer,
				new CustomGraphSON2Reader(),
				new GraphSON2Writer(),
				"application/vnd.gremlin-v2.0+json",
				connectionPoolSettings,
				webSocketConfiguration);
		} else {
			_gremlinServer = new GremlinServer(databaseHost, databasePort);
			_gremlinClient = new GremlinClient(
				_gremlinServer);
		}
		


		_addedResultCommand = configuration["addedResultCommand"];
		_updatedResultCommand = configuration["updatedResultCommand"];
		_deletedResultCommand = configuration["deletedResultCommand"];


		// Regex used to extract parameters from the Gremlin commands
		// Finds any string starting with @ and ending with a-zA-Z0-9-_. (e.g. @param_1-2.3)
		var paramMatcher = new Regex("@[a-zA-Z0-9-_.]*");


		// Extract the parameters from the Gremlin commands

		_addedResultCommandParamList = new List<string>();
		if (!string.IsNullOrEmpty(_addedResultCommand))
		{
			foreach (Match match in paramMatcher.Matches(_addedResultCommand))
			{
				var param = match.Value.Substring(1);

				Console.WriteLine($"Extracted AddedResultCommand Param: {param}");
				_addedResultCommandParamList.Add(param);
			}
		}

		_updatedResultCommandParamList = new List<string>();
		if (!string.IsNullOrEmpty(_updatedResultCommand))
		{
			foreach (Match match in paramMatcher.Matches(_updatedResultCommand))
			{
				var param = match.Value.Substring(1);

				Console.WriteLine($"Extracted UpdatedResultCommand Param: {param}");
				_updatedResultCommandParamList.Add(param);
			}
		}

		_deletedResultCommandParamList = new List<string>();
		if (!string.IsNullOrEmpty(_deletedResultCommand))
		{
			foreach (Match match in paramMatcher.Matches(_deletedResultCommand))
			{
				var param = match.Value.Substring(1);

				Console.WriteLine($"Extracted DeletedResultCommand Param: {param}");
				_deletedResultCommandParamList.Add(param);
			}
		}
	}

	public void ProcessAddedQueryResults(Dictionary<string, object> res)
	{
		string newCmd = _addedResultCommand;

		foreach (var param in _addedResultCommandParamList)
		{
			newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param, res));
		}
		Console.WriteLine($"Issuing added result command: {newCmd}");

		var resultSet = SubmitRequest(_gremlinClient, newCmd).Result;
		if (resultSet.Count > 0)
		{
			Console.WriteLine("Added Command Result:");
			foreach (var r in resultSet)
			{
				// The vertex results are formed as Dictionaries with a nested dictionary for their properties
				string output = JsonConvert.SerializeObject(r);
				Console.WriteLine($"\t{output}");
			}
		}
	}

	public void ProcessUpdatedQueryResults(UpdatedResultElement updatedResult)
	{
		Console.WriteLine($"Updated Result {updatedResult}");

		string newCmd = _updatedResultCommand;

		foreach (var param in _updatedResultCommandParamList)
		{
			if (param.StartsWith("before"))
			{
				newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param.Substring(7), updatedResult.Before));
			}
			else if (param.StartsWith("after"))
			{
				newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param.Substring(6), updatedResult.After));
			}
			else
			{
				newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param, updatedResult.After));
			}
		}
		Console.WriteLine($"Issuing updated result command: {newCmd}");

		var resultSet = SubmitRequest(_gremlinClient, newCmd).Result;
		if (resultSet.Count > 0)
		{
			Console.WriteLine("Updated Command Result:");
			foreach (var r in resultSet)
			{
				// The vertex results are formed as Dictionaries with a nested dictionary for their properties
				string output = JsonConvert.SerializeObject(r);
				Console.WriteLine($"\t{output}");
			}
		}
	}

	public void ProcessDeletedQueryResults(Dictionary<string, object> deletedResults)
	{
		Console.WriteLine($"Deleted Result {deletedResults}");

		string newCmd = _deletedResultCommand;

		foreach (var param in _deletedResultCommandParamList)
		{
			newCmd = newCmd.Replace($"@{param}", ExtractQueryResultValue(param, deletedResults));
		}
		Console.WriteLine($"Issuing deleted result command: {newCmd}");

		var resultSet = SubmitRequest(_gremlinClient, newCmd).Result;
		if (resultSet.Count > 0)
		{
			Console.WriteLine("Deleted Command Result:");
			foreach (var r in resultSet)
			{
				// The vertex results are formed as Dictionaries with a nested dictionary for their properties
				string output = JsonConvert.SerializeObject(r);
				Console.WriteLine($"\t{output}");
			}
		}
	}
	private static string ExtractQueryResultValue(string param, Dictionary<string, object> queryResult)
	{
		if (queryResult.TryGetValue(param, out var value))
		{
			Console.WriteLine($"Adding param: {param} = {value}");
			Console.WriteLine($"Type: {value.GetType()}");
			switch (value)
			{
				case string strValue:
					return strValue;
				case bool boolValue:
					return boolValue.ToString().ToLower();
				case int intValue:
					return intValue.ToString();
				case long longValue:
					return longValue.ToString();
				case double doubleValue:
					return doubleValue.ToString();
				case decimal decimalValue:
					return decimalValue.ToString();
				case JsonElement jsonElementValue:
					return jsonElementValue.ToString();
				default:
					throw new InvalidDataException($"Unsupported data type for param: {param}");
			}
		}
		else
		{
			Console.WriteLine($"Missing param: {param}");
			throw new InvalidDataException($"Missing param: {param}");
		}
	}

	private static Task<ResultSet<dynamic>> SubmitRequest(GremlinClient gremlinClient, string cmd)
	{
		try
		{
			return gremlinClient.SubmitAsync<dynamic>(cmd);
		}
		catch (ResponseException e)
		{
			Console.WriteLine("\tRequest Error!");

			// Print the Gremlin status code.
			Console.WriteLine($"\tStatusCode: {e.StatusCode}");

			// On error, ResponseException.StatusAttributes will include the common StatusAttributes for successful requests, as well as
			// additional attributes for retry handling and diagnostics.
			// These include:
			//  x-ms-retry-after-ms         : The number of milliseconds to wait to retry the operation after an initial operation was throttled. This will be populated when
			//                              : attribute 'x-ms-status-code' returns 429.
			//  x-ms-activity-id            : Represents a unique identifier for the operation. Commonly used for troubleshooting purposes.
			PrintStatusAttributes(e.StatusAttributes);
			Console.WriteLine($"\t[\"x-ms-retry-after-ms\"] : {GetValueAsString(e.StatusAttributes, "x-ms-retry-after-ms")}");
			Console.WriteLine($"\t[\"x-ms-activity-id\"] : {GetValueAsString(e.StatusAttributes, "x-ms-activity-id")}");

			throw;
		}
	}

	static string GetValueAsString(IReadOnlyDictionary<string, object> dictionary, string key)
	{
		return JsonConvert.SerializeObject(GetValueOrDefault(dictionary, key));
	}

	// Print the common StatusAttributes from a ResponseException
	static void PrintStatusAttributes(IReadOnlyDictionary<string, object> attributes)
	{
		Console.WriteLine($"\tStatusAttributes:");
		Console.WriteLine($"\t[\"x-ms-status-code\"] : {GetValueAsString(attributes, "x-ms-status-code")}");
		Console.WriteLine($"\t[\"x-ms-total-server-time-ms\"] : {GetValueAsString(attributes, "x-ms-total-server-time-ms")}");
		Console.WriteLine($"\t[\"x-ms-total-request-charge\"] : {GetValueAsString(attributes, "x-ms-total-request-charge")}");
	}
	static object GetValueOrDefault(IReadOnlyDictionary<string, object> dictionary, string key)
	{
		if (dictionary.ContainsKey(key))
		{
			return dictionary[key];
		}

		return null;
	}
}

class GremlinChangeHandler : IChangeEventHandler
{
	private readonly GremlinService _gremlinService;
	private readonly ILogger<GremlinChangeHandler> _logger;

	public GremlinChangeHandler(GremlinService gremlinService, ILogger<GremlinChangeHandler> logger)
	{
		_gremlinService = gremlinService;
		_logger = logger;
	}

	// TODO review query config param
	public async Task HandleChange(ChangeEvent evt, object? queryConfig)
	{
		_logger.LogInformation($"Received change event from query {evt.QueryId} sequence {evt.Sequence}");

		foreach (var addedResult in evt.AddedResults)
		{
			_gremlinService.ProcessAddedQueryResults(addedResult);
		}

		foreach (var updatedResult in evt.UpdatedResults)
		{
			_gremlinService.ProcessUpdatedQueryResults(updatedResult);
		}

		foreach (var deletedResult in evt.DeletedResults)
		{
			_gremlinService.ProcessDeletedQueryResults(deletedResult);
		}
	}
}


// This class is required to overcome the limitation that the standard GraphSON2Reader does not support
// deserializing the numeric data returned by Cosmos Gremlin API. 
// Explained here: https://stackoverflow.com/questions/68092798/gremlin-net-deserialize-number-property/72316108#72316108
public class CustomGraphSON2Reader : GraphSON2Reader
{
	public override dynamic ToObject(JsonElement graphSon) =>
	  graphSon.ValueKind switch
	  {
		  JsonValueKind.Number when graphSon.TryGetInt32(out var intValue) => intValue,
		  JsonValueKind.Number when graphSon.TryGetInt64(out var longValue) => longValue,
		  JsonValueKind.Number when graphSon.TryGetDecimal(out var decimalValue) => decimalValue,

		  _ => base.ToObject(graphSon)
	  };
}


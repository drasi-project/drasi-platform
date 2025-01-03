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

namespace Drasi.Reactions.Debezium.Services;

using Drasi.Reaction.SDK.Models.QueryOutput;
using Drasi.Reaction.SDK;
using System.Text.Json;
using System.Text;

public class DataChangeEventFormatter : IDataChangeEventFormatter {

    private readonly JsonSerializerOptions _jsonOptions = new JsonSerializerOptions
    {
        WriteIndented = false
    };

    public DataChangeEventFormatter() {}

    public List<string> ProcessChangeEvent(EventMetadata metadata, ChangeEvent evt) 
    {
        List<string> messages = new List<string>();
        // Process Addedresults
        foreach (var res in evt.AddedResults)
        {
            messages.Add(FormatMessage(metadata, res, "c"));
        }

        var updatedResults = new List<Dictionary<string, object>>();
		for (int i = 0; i < evt.UpdatedResults.Length; i++)
		{
			var currResultDict = new Dictionary<string, object>
			{
				["before"] = evt.UpdatedResults[i].Before,
				["after"] = evt.UpdatedResults[i].After
			};
			updatedResults.Add(currResultDict);
        }

        // Process Updatedresults
        foreach (var res in updatedResults)
        {
            messages.Add(FormatMessage(metadata, res, "u"));
        }

        // Process Deletedresults
        foreach (var res in evt.DeletedResults)
        {
            messages.Add(FormatMessage(metadata, res, "d"));
        }

        return messages;
    }

    public string FormatMessage(EventMetadata metadata, Dictionary<string, object> res, string op)
    {
			var dataChangeEvent = new DataChangeEvent();

			var resultJsonElement = ConvertDictionaryToJsonElement(res);
			var valuePayload = GetValuePayload(op, metadata, resultJsonElement);

			dataChangeEvent.ValuePayload = valuePayload;
			var eventString = JsonSerializer.Serialize(dataChangeEvent, _jsonOptions);
			
            return eventString;
    }

	
	static JsonElement ConvertDictionaryToJsonElement(Dictionary<string, object> dictionary)
    {
        string jsonString = JsonSerializer.Serialize(dictionary);

        using JsonDocument jsonDocument = JsonDocument.Parse(jsonString);

        return jsonDocument.RootElement.Clone();
    }

	static Payload GetValuePayload(string op, EventMetadata metadata, JsonElement res)
	{
		var valuePayload = new Payload
		{
			Source = new Source
			{
				Version = metadata.Version,
				Connector = metadata.Connector,
				TimestampMs = metadata.TsMs,
				Sequence = metadata.Seq
			},
			Operation = op,
			TimestampMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()
		};

		switch (op)
		{
			case "c":
				valuePayload.After = res;
				break;
			case "u":
				valuePayload.Before = res.GetProperty("before");
				valuePayload.After = res.GetProperty("after");
				break;
			case "d":
				valuePayload.Before = res;
				break;
			default:
				throw new Exception("Unknown op: " + op);
		}

		return valuePayload;
	}

	


	static List<Field> GetChangeDataFields(JsonElement changeData)
	{
		var changeDataFields = new List<Field>();
		foreach (var prop in changeData.EnumerateObject())
		{
			changeDataFields.Add(new Field
			{
				SchemaField = prop.Name,
				Type = prop.Value.ValueKind.ToString().ToLower(),
				Optional = false
			});
		}
		return changeDataFields;
	}
}
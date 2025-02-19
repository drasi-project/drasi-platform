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

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Drasi.Reactions.Debug.Server.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class QueriesController : ControllerBase
	{
		private readonly ILogger<QueriesController> _logger;

		private readonly string _configDirectory;

		public QueriesController(ILogger<QueriesController> logger, IConfiguration configuration)
		{
			_logger = logger;
			_configDirectory = configuration.GetValue<string>("QueryConfigPath", "/etc/queries");
		}

		[HttpGet(Name = "GetQueries")]
		public IEnumerable<string> Get()
		{
			var queryList = new List<string>();
			foreach (var qpath in Directory.GetFiles(_configDirectory))
			{
				var queryId = Path.GetFileName(qpath);
				queryList.Add(queryId);
			}
			return queryList;
		}
	}
}

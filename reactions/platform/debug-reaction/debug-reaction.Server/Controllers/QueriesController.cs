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
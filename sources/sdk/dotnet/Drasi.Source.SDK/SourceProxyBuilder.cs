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

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace Drasi.Source.SDK;

public class SourceProxyBuilder
{
    private readonly WebApplicationBuilder _webappBuilder;

        public IServiceCollection Services => _webappBuilder.Services;

        public IConfiguration Configuration => _webappBuilder.Configuration;

        public SourceProxyBuilder()
        {
            _webappBuilder = WebApplication.CreateBuilder();
            _webappBuilder.Services.AddDaprClient();
            _webappBuilder.Services.AddControllers();
            
            _webappBuilder.Configuration.AddEnvironmentVariables();
            _webappBuilder.Logging.AddConsole();
        }

        // public SourceProxyBuilder UseBootstrapHandler<TChangeEventHandler>() where TChangeEventHandler : class, IChangeEventHandler<TQueryConfig>
        // {
        //     _webappBuilder.Services.AddScoped<IChangeEventHandler<TQueryConfig>, TChangeEventHandler>();
        //     return this;
        // }

}

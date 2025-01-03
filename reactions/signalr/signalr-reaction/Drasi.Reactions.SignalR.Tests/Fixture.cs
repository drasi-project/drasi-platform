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

using Drasi.Reaction.SDK.Models.QueryOutput;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net;
using System.Net.Http.Json;
using System.Net.Sockets;

namespace Drasi.Reactions.SignalR.Tests
{
    public class Fixture<TQueryConfig> : IDisposable
        where TQueryConfig : class
    {
        private readonly string _queryDirectory;
        private readonly Task _process;
        private readonly int _reactionPort;
        private readonly int _hubPort;
        
        public HttpClient Client { get; private set; }

        public Fixture()
        {
            _queryDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
            Directory.CreateDirectory(_queryDirectory);

            (_reactionPort, _hubPort) = GetAvailablePorts();

            Environment.SetEnvironmentVariable("QueryConfigPath", _queryDirectory);
            Environment.SetEnvironmentVariable("APP_PORT", _reactionPort.ToString());
            Environment.SetEnvironmentVariable("HUB_PORT", _hubPort.ToString());

            Program.ShutdownToken.TryReset();
            _process = Program.Main([]);
            
            Program.StartupTask.Task.Wait();
            
            Client = new HttpClient();
            Client.BaseAddress = new Uri("http://localhost:" + _reactionPort);
        }

        public HubConnection GetHubConnection()
        {
            var connection = new HubConnectionBuilder()
                .WithUrl($"http://localhost:{_hubPort}/hub")
                .WithAutomaticReconnect()
                .AddJsonProtocol()
                .Build();

            return connection;
        }

        public async Task PublishChangeEvent(ChangeEvent changeEvent)
        {
            await Client.PostAsJsonAsync("event", changeEvent, ModelOptions.JsonOptions);
        }

        public async Task PublishControlSignal(ControlEvent controlEvent)
        {
            await Client.PostAsJsonAsync("event", controlEvent, ModelOptions.JsonOptions);
        }

        public void Dispose()
        {
            Directory.Delete(_queryDirectory, true);
            Program.ShutdownToken.Cancel();
        }

        public static (int, int) GetAvailablePorts()
        {
            TcpListener listener1 = new(IPAddress.Loopback, 0);            
            listener1.Start();            
            int port1 = ((IPEndPoint)listener1.LocalEndpoint).Port;

            TcpListener listener2 = new(IPAddress.Loopback, 0);
            listener2.Start();
            int port2 = ((IPEndPoint)listener2.LocalEndpoint).Port;

            listener1.Stop();
            listener2.Stop();
            
            return (port1, port2);
        }
    }    
}

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
using System;
using System.Net;
using System.Net.Sockets;
using System.Threading.Channels;

namespace Drasi.Reaction.SDK.Tests
{
    public class Fixture<TQueryConfig> : IDisposable
        where TQueryConfig : class
    {
        public string QueryDirectory { get; private set; }
        public Channel<ChangeEvent> ChangeEventChannel { get; private set; }

        public Reaction<TQueryConfig> Reaction { get; private set; }

        public HttpClient Client { get; private set; }

        public Fixture()
        {
            QueryDirectory = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());
            Directory.CreateDirectory(QueryDirectory);
            ChangeEventChannel = Channel.CreateUnbounded<ChangeEvent>();
            var port = GetAvailablePort();

            Reaction = new ReactionBuilder<TQueryConfig>()
                .UseChangeEventHandler(async (evt, config) =>
                {
                    await ChangeEventChannel.Writer.WriteAsync(evt);
                })
                .Configure(cfg => 
                {
                    cfg["QueryConfigPath"] = QueryDirectory;
                    cfg["APP_PORT"] = port.ToString();
                })
                .Build();

            _ = Reaction.StartAsync();

            Client = new HttpClient();
            Client.BaseAddress = new Uri("http://localhost:" + port);
        }

        public void ClearChannels()
        {
            while (ChangeEventChannel.Reader.Count > 0)
            {
                ChangeEventChannel.Reader.TryRead(out _);
            }
        }

        public void Dispose()
        {
            Directory.Delete(QueryDirectory, true);
            _ = Reaction.StopAsync();
        }

        public static int GetAvailablePort()
        {
            // Create a TcpListener on port 0 (let OS select an available port)
            TcpListener listener = new(IPAddress.Loopback, 0);
            listener.Start();
            
            // Retrieve the assigned port number
            int port = ((IPEndPoint)listener.LocalEndpoint).Port;
            
            // Stop the listener immediately to free up the port
            listener.Stop();
            
            return port;
        }
    }    
}

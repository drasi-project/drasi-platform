using Drasi.Reaction.SDK.Models;
using System;
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

            Reaction = new ReactionBuilder<TQueryConfig>()
                .UseChangeEventHandler(async (evt, config) =>
                {
                    await ChangeEventChannel.Writer.WriteAsync(evt);
                })
                .Configure(x => x["QueryConfigPath"] = QueryDirectory)
                .Build();

            _ = Reaction.StartAsync();

            Client = new HttpClient();
            Client.BaseAddress = new Uri("http://localhost:80");
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
    }
}

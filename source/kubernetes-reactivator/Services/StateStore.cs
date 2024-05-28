using Dapr.Client;
using k8s;
using k8s.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace kubernetes_reactivator.Services
{
    internal class StateStore : IStateStore
    {
        private readonly DaprClient _dapr;
        private readonly string _stateStore;

        public StateStore(DaprClient dapr, string stateStore)
        {
            _dapr = dapr;
            _stateStore = stateStore;
        }

        public async Task Delete<T>(T current) where T : IKubernetesObject<V1ObjectMeta>
        {
            await _dapr.DeleteStateAsync(_stateStore, GetId(current));
        }

        public Task<T> GetPrevious<T>(T current) where T : IKubernetesObject<V1ObjectMeta>
        {
            return _dapr.GetStateAsync<T>(_stateStore, GetId(current));
        }

        public async Task SetCurrent<T>(T current) where T : IKubernetesObject<V1ObjectMeta>
        {
            await _dapr.SaveStateAsync(_stateStore, GetId(current), current);
        }

        private string GetId(IKubernetesObject<V1ObjectMeta> obj) => $"{obj.Kind}:{obj.Namespace()}:{obj.Name()}";
    }
}

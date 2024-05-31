using k8s;
using k8s.Models;

namespace kubernetes_reactivator.Services
{
    internal interface IStateStore
    {
        Task<T> GetPrevious<T>(T current) where T : IKubernetesObject<V1ObjectMeta>;

        Task SetCurrent<T>(T current) where T : IKubernetesObject<V1ObjectMeta>;

        Task Delete<T>(T current) where T : IKubernetesObject<V1ObjectMeta>;
    }
}
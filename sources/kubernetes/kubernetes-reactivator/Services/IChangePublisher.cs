using kubernetes_reactivator.Models;

namespace kubernetes_reactivator.Services
{
    internal interface IChangePublisher
    {
        Task Publish(IEnumerable<ChangeNotification> changes);
    }
}
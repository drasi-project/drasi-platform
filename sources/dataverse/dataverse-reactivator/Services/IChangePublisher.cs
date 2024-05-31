using Reactivator.Models;

namespace Reactivator.Services
{
    internal interface IChangePublisher
    {
        Task Publish(IEnumerable<ChangeNotification> changes);
    }
}
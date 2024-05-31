using k8s.Models;
using kubernetes_reactivator.Models;

namespace kubernetes_reactivator.Services
{
    internal interface IGraphChangeMapper
    {
        IEnumerable<ChangeNotification> MapAddedToGraphChanges(V1Pod resource);
        IEnumerable<ChangeNotification> MapAddedToGraphChanges(V1Namespace resource);

        IEnumerable<ChangeNotification> MapModifiedToGraphChanges(V1Pod current, V1Pod prev);
        IEnumerable<ChangeNotification> MapModifiedToGraphChanges(V1Namespace current, V1Namespace prev);

        IEnumerable<ChangeNotification> MapDeletedToGraphChanges(V1Pod resource);
        IEnumerable<ChangeNotification> MapDeletedToGraphChanges(V1Namespace resource);
    }
}
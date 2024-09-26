using Microsoft.Xrm.Sdk;
using Reactivator.Models;

namespace Reactivator.Services
{
    interface IEventMapper
    {
        Task<ChangeNotification> MapEventAsync(IChangedItem rawEvent);
    }
}

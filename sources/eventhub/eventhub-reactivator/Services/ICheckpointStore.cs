namespace Reactivator.Services;
public interface ICheckpointStore
{
    Task<long?> GetSequenceNumber(string entityName, string partitionId);
    Task SetSequenceNumber(string entityName, string partitionId, long sequenceNumber);
}


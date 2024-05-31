namespace kubernetes_reactivator.Services
{
    internal interface ISequenceGenerator : IHostedService
    {
        long GetNext();
    }
}
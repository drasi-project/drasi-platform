using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace cosmosdb_reactivator.Services
{
    internal interface ISequenceGenerator : IHostedService
    {
        long GetNext();
    }
}

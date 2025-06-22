// Copyright 2024 The Drasi Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using Microsoft.Extensions.DependencyInjection;

namespace Drasi.Reactions.PostDaprPubSub.Services;

/// <summary>
/// Factory for creating appropriate change formatters based on the event format.
/// </summary>
public interface IChangeFormatterFactory
{
    /// <summary>
    /// Gets a formatter for the specified event format.
    /// </summary>
    /// <returns>An appropriate change formatter</returns>
    IChangeFormatter GetFormatter();
}

/// <summary>
/// Implementation of the change formatter factory.
/// </summary>
public class ChangeFormatterFactory : IChangeFormatterFactory
{
    private readonly IServiceProvider _serviceProvider;

    public ChangeFormatterFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    }

    public IChangeFormatter GetFormatter()
    {
        return _serviceProvider.GetRequiredService<DrasiChangeFormatter>();
    }
}
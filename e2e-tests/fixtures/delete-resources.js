/**
 * Copyright 2024 The Drasi Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const cp = require('child_process');
const yaml = require('js-yaml');
const { waitForChildProcess } = require('./infrastructure');


/**
 * @param {Array} resources
 */
async function deleteResources(resources) {

  let sources = [];
  let queries = [];
  let reactions = [];
  let containers = [];

  let reactionProviders = [];

  let promises = [];

  for (let resource of resources) {
    if (!resource)
      continue;
      
    switch (resource.kind) {
      case "Source":
        sources.push(resource);
        break;
      case "QueryContainer":
        containers.push(resource);
        break;
      case "ContinuousQuery":
        queries.push(resource);
        break;
      case "Reaction":
        reactions.push(resource);
        break;
      case "ReactionProvider":
        reactionProviders.push(resource);
        break;
      default:
        console.info(cp.execSync(`kubectl delete -f - `, { input: yaml.dump(resource), encoding: 'utf-8', stdio: 'pipe' }));
        break;
    }
  }

  await Promise.all(promises);

  for (let source of sources) {
    console.info(cp.execSync(`drasi delete`, { input: yaml.dump(source), encoding: 'utf-8', stdio: 'pipe'}));
  }

  for (let container of containers) {
    console.info(cp.execSync(`drasi delete`, { input: yaml.dump(container), encoding: 'utf-8', stdio: 'pipe' }));
  }

  for (let query of queries) {
    console.info(cp.execSync(`drasi delete`, { input: yaml.dump(query), encoding: 'utf-8', stdio: 'pipe' }));
  }

  for (let reaction of reactions) {
    console.info(cp.execSync(`drasi delete`, { input: yaml.dump(reaction), encoding: 'utf-8', stdio: 'pipe' }));
  }

  for (let provider of reactionProviders) {
    console.info(cp.execSync(`drasi delete`, { input: yaml.dump(provider), encoding: 'utf-8', stdio: 'pipe' }));
  }
}

module.exports = deleteResources;

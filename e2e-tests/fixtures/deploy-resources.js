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

const cp = require("child_process");
const yaml = require("js-yaml");
const { waitForChildProcess } = require("./infrastructure");

/**
 * @param {Array} resources
 */
async function deployResources(resources) {
  let sources = [];
  let queries = [];
  let reactions = [];
  let containers = [];

  let reactionProviders = [];

  let sourceProviders = [];

  let promises = [];

  for (let resource of resources) {
    if (!resource) continue;

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
      case "SourceProvider":
        sourceProviders.push(resource);
        break;
      default:
        console.info(
          cp.execSync(`kubectl apply -f - `, {
            input: yaml.dump(resource),
            encoding: "utf-8",
            stdio: "pipe",
          }),
        );
        switch (resource.kind) {
          case "Deployment":
          case "StatefulSet":
            promises.push(
              waitForChildProcess(
                cp.exec(
                  `kubectl rollout status --watch --timeout=300s ${resource.kind}/${resource.metadata.name}`,
                  { encoding: "utf-8" },
                ),
                resource.metadata.name,
              ),
            );
            break;
          case "Pod":
            promises.push(
              waitForChildProcess(
                cp.exec(
                  `kubectl wait --for=condition=Ready pod/${resource.metadata.name} --timeout=300s`,
                  { encoding: "utf-8" },
                ),
                resource.metadata.name,
              ),
            );
            break;
        }
        break;
    }
  }

  await Promise.all(promises);

  for (let source of sources) {
    console.info(
      cp.execSync(`drasi apply`, {
        input: yaml.dump(source),
        encoding: "utf-8",
        stdio: "pipe",
      }),
    );
    await waitForChildProcess(
      cp.exec(`drasi wait ${source.kind} ${source.name} -t 150`, {
        encoding: "utf-8",
      }),
      source.name,
    );
  }

  for (let container of containers) {
    console.info(
      cp.execSync(`drasi apply`, {
        input: yaml.dump(container),
        encoding: "utf-8",
        stdio: "pipe",
      }),
    );
    await waitForChildProcess(
      cp.exec(`drasi wait ${container.kind} ${container.name}`, {
        encoding: "utf-8",
      }),
      container.name,
    );
  }

  for (let query of queries) {
    let containerName = query.spec.container ?? "default";
    await waitForChildProcess(
      cp.exec(`drasi wait querycontainer ${containerName} -t 90`, {
        encoding: "utf-8",
      }),
      containerName,
    );
    console.info(
      cp.execSync(`drasi apply`, {
        input: yaml.dump(query),
        encoding: "utf-8",
        stdio: "pipe",
      }),
    );
  }

  for (let reaction of reactions) {
    console.info(
      cp.execSync(`drasi apply`, {
        input: yaml.dump(reaction),
        encoding: "utf-8",
        stdio: "pipe",
      }),
    );
    await waitForChildProcess(
      cp.exec(`drasi wait ${reaction.kind} ${reaction.name} -t 120`, {
        encoding: "utf-8",
      }),
      reaction.name,
    );
  }

  for (let provider of reactionProviders) {
    console.info(
      cp.execSync(`drasi apply`, {
        input: yaml.dump(provider),
        encoding: "utf-8",
        stdio: "pipe",
      }),
    );
  }

  for (let provider of sourceProviders) {
    console.info(cp.execSync(`drasi apply`, { input: yaml.dump(provider), encoding: 'utf-8', stdio: 'pipe' }));
  }
}

module.exports = deployResources;

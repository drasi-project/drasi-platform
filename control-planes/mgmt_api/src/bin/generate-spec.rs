// Copyright 2025 The Drasi Authors.
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

use mgmt_api::api::v1::ApiDoc;
use utoipa::OpenApi;

fn main() {
    // Generate the OpenAPI specification as YAML
    let openapi = ApiDoc::openapi();
    let yaml = openapi
        .to_yaml()
        .expect("Failed to serialize OpenAPI spec to YAML");

    // Print to stdout so it can be redirected to a file
    // This is a binary meant to output to stdout, so we allow println here
    #[allow(clippy::print_stdout)]
    {
        println!("{}", yaml);
    }
}

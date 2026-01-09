//go:build tools

package tools

// This file forces Go to track specific dependency versions for security compliance.
// These packages are not actually imported by the CLI but appear in the module graph
// as transitive dependencies. Pinning them here ensures security scanners see the
// patched versions.
//
// CVE-2024-44337: gomarkdown/markdown DoS vulnerability
// The package is a transitive dep of oapi-codegen/runtime but unused by CLI.
// See: https://github.com/advisories/GHSA-xhr3-wf7j-h255
import _ "github.com/gomarkdown/markdown"

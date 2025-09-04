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

package ingress

import (
	"fmt"

	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
)

// IngressInstaller defines the interface for installing and configuring ingress controllers
type IngressInstaller interface {
	// Install installs the ingress controller and configures it for Drasi usage
	Install(drasiNamespace string, output output.TaskOutput) error

	// GetIngressConfig returns the configuration details for this ingress controller
	GetIngressConfig() IngressConfig
}

// IngressConfig contains the configuration details for an ingress controller
type IngressConfig struct {
	ClassName   string // The IngressClass name to use in ingress resources
	ServiceName string // The LoadBalancer service name for IP discovery
	Namespace   string // The namespace where the ingress controller is installed
}

// NewIngressInstaller creates a new IngressInstaller based on the specified type
func NewIngressInstaller(installerType string, platformClient *sdk.KubernetesPlatformClient) (IngressInstaller, error) {
	switch installerType {
	case "contour":
		return MakeContourInstaller(platformClient)
	default:
		return nil, fmt.Errorf("unsupported ingress installer type: %s", installerType)
	}
}

// GetIngressConfig returns the Contour ingress controller configuration
func (ci *ContourInstaller) GetIngressConfig() IngressConfig {
	return IngressConfig{
		ClassName:   "contour",
		ServiceName: "contour-envoy",
		Namespace:   "projectcontour",
	}
}

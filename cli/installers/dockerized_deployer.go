package installers

import (
	"archive/tar"
	"bytes"
	"context"
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"drasi.io/cli/output"
	"drasi.io/cli/sdk/registry"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	"github.com/phayes/freeport"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
)

var (
	containerImage = "rancher/k3s:v1.32.2-k3s1"
)

type DockerizedDeployer struct {
	dockerClient *client.Client
}

func MakeDockerizedDeployer() (*DockerizedDeployer, error) {
	cli, err := client.NewClientWithOpts(client.FromEnv)
	if err != nil {
		panic(err)
	}

	result := DockerizedDeployer{
		dockerClient: cli,
	}

	return &result, nil
}

func (t *DockerizedDeployer) Build(name string, output output.TaskOutput) (registry.Registration, error) {
	ctx := context.Background()

	port, err := freeport.GetFreePort()
	if err != nil {
		return nil, err
	}

	portStr := strconv.Itoa(port)
	portBinding := nat.Port(portStr + "/tcp")

	homeDir, err := os.UserHomeDir()
	if err != nil {
		return nil, err
	}

	mountPath := filepath.Join(homeDir, ".drasi", "servers", name)
	err = os.MkdirAll(mountPath, 0755)
	if err != nil {
		return nil, err
	}

	if !imageExists(ctx, t.dockerClient, containerImage) {
		pullImage(ctx, t.dockerClient, containerImage, output)
	}

	output.AddTask("Create-Docker", "Creating container")

	resp, err := t.dockerClient.ContainerCreate(ctx, &container.Config{
		Image: containerImage,
		Cmd:   []string{"server", "--https-listen-port", portStr},
		ExposedPorts: nat.PortSet{
			portBinding: struct{}{},
		},
	}, &container.HostConfig{
		Privileged: true,

		PortBindings: nat.PortMap{
			portBinding: []nat.PortBinding{
				{
					HostIP:   "0.0.0.0",
					HostPort: portStr,
				},
			},
		},
	}, nil, nil, "drasi-"+name)
	if err != nil {
		output.FailTask("Create-Docker", fmt.Sprintf("Error creating container: %v", err))
		return nil, err
	}

	if err := t.dockerClient.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		output.FailTask("Create-Docker", fmt.Sprintf("Error starting container %s: %v", resp.ID, err))
		return nil, err
	}

	output.SucceedTask("Create-Docker", fmt.Sprintf("Container %s created", resp.ID))
	output.AddTask("Wait-Container", "Waiting for container to be start")

	// Wait for the container to be healthy
	if err := t.waitForReady(resp.ID); err != nil {
		output.FailTask("Wait-Container", fmt.Sprintf("Error waiting for container %s: %v", resp.ID, err))
		return nil, err
	}

	err = t.waitForApiServer(portStr)
	if err != nil {
		output.FailTask("Wait-Container", fmt.Sprintf("Error waiting for API server on port %s: %v", portStr, err))
		return nil, err
	}

	output.SucceedTask("Wait-Container", fmt.Sprintf("Container %s started", resp.ID))

	kubeConfig, err := t.readKubeconfig(resp.ID)
	if err != nil {
		log.Fatalf("Error reading kubeconfig: %v", err)
	}

	err = t.mergeDockerKubeConfig(name, kubeConfig)
	if err != nil {
		output.Error(fmt.Sprintf("Error merging kubeconfig: %v", err))
	}

	result := registry.DockerConfig{
		ContainerId: &resp.ID,
		InternalConfig: &registry.KubernetesConfig{
			Namespace:  "drasi-system",
			KubeConfig: kubeConfig,
			Config: registry.Config{
				Id:   name,
				Kind: registry.Kubernetes,
			},
		},
		Config: registry.Config{
			Id:   name,
			Kind: registry.Docker,
		},
	}

	return &result, nil
}

func (t *DockerizedDeployer) waitForReady(containerId string) error {
	ctx := context.Background()
	var state string = "created"
	for state == "created" {
		container, err := t.dockerClient.ContainerInspect(ctx, containerId)
		if err != nil {
			return err
		}
		state = container.State.Status
		time.Sleep(1 * time.Second)
	}

	return nil
}

func (t *DockerizedDeployer) Delete(config *registry.DockerConfig) error {
	ctx := context.Background()
	if config.ContainerId != nil {
		return t.dockerClient.ContainerRemove(ctx, *config.ContainerId, container.RemoveOptions{Force: true, RemoveVolumes: true})
	}

	return nil
}

func (t *DockerizedDeployer) waitForApiServer(port string) error {
	timeout := time.After(30 * time.Second)
	tick := time.Tick(1 * time.Second)

	for {
		select {
		case <-timeout:
			return fmt.Errorf("timeout waiting for HTTP connection on port %s", port)
		case <-tick:
			conn, err := net.DialTimeout("tcp", "localhost:"+port, 1*time.Second)
			if err == nil {
				conn.Close()
				return nil
			}
		}
	}
}

func (t *DockerizedDeployer) readKubeconfig(containerId string) ([]byte, error) {
	ctx := context.Background()
	cfgReader, _, err := t.dockerClient.CopyFromContainer(ctx, containerId, "/etc/rancher/k3s/k3s.yaml")
	if err != nil {
		return nil, err
	}
	defer cfgReader.Close()
	tarReader := tar.NewReader(cfgReader)

	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)
		}

		if header.Typeflag == tar.TypeReg {
			var buf bytes.Buffer
			if _, err := io.Copy(&buf, tarReader); err != nil {
				log.Fatal(err)
			}
			return buf.Bytes(), nil
		}
	}

	return nil, fmt.Errorf("kubeconfig not found in container")
}

func (t *DockerizedDeployer) mergeDockerKubeConfig(name string, kubeconfig []byte) error {
	// Parse the provided kubeconfig
	dockerConfig, err := clientcmd.Load(kubeconfig)
	if err != nil {
		return fmt.Errorf("error loading provided kubeconfig: %w", err)
	}

	// Get the kubeconfig file path
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return fmt.Errorf("could not get home directory: %w", err)
	}
	kubeconfigPath := filepath.Join(homeDir, ".kube", "config")

	// If kubeconfigPath doesn't exist, simply return without doing anything
	if _, err := os.Stat(kubeconfigPath); os.IsNotExist(err) {
		return nil
	}

	// Modify server URL to use localhost
	// for k, cluster := range dockerConfig.Clusters {
	// 	serverURL, err := url.Parse(cluster.Server)
	// 	if err != nil {
	// 		return fmt.Errorf("error parsing server URL: %w", err)
	// 	}

	// 	// Extract port and update to use localhost
	// 	hostParts := strings.Split(serverURL.Host, ":")
	// 	if len(hostParts) == 2 {
	// 		port := hostParts[1]
	// 		serverURL.Host = "localhost:" + port
	// 		cluster.Server = serverURL.String()
	// 		dockerConfig.Clusters[k] = cluster
	// 	}
	// }

	// Create unique name for the context, cluster, and user
	contextName := fmt.Sprintf("drasi-%s", name)
	clusterName := fmt.Sprintf("drasi-%s", name)
	userName := fmt.Sprintf("drasi-%s", name)

	// Load existing kubeconfig
	existingConfig, err := clientcmd.LoadFromFile(kubeconfigPath)
	if err != nil {
		return fmt.Errorf("error loading kubeconfig file: %w", err)
	}

	// Find first cluster and user in docker config
	var firstClusterName, firstUserName string
	for k := range dockerConfig.Clusters {
		firstClusterName = k
		break
	}
	for k := range dockerConfig.AuthInfos {
		firstUserName = k
		break
	}

	if firstClusterName == "" || firstUserName == "" {
		return fmt.Errorf("could not find cluster or user in provided kubeconfig")
	}

	// Copy cluster and user with new names
	existingConfig.Clusters[clusterName] = dockerConfig.Clusters[firstClusterName]
	existingConfig.AuthInfos[userName] = dockerConfig.AuthInfos[firstUserName]

	// Create new context
	existingConfig.Contexts[contextName] = &api.Context{
		Cluster:   clusterName,
		AuthInfo:  userName,
		Namespace: "default",
	}

	// Save the merged config
	err = clientcmd.WriteToFile(*existingConfig, kubeconfigPath)
	if err != nil {
		return fmt.Errorf("error writing merged kubeconfig: %w", err)
	}

	return nil
}

// imageExists checks if the specified image is cached locally
func imageExists(ctx context.Context, cli *client.Client, imageName string) bool {
	_, _, err := cli.ImageInspectWithRaw(ctx, imageName)
	return err == nil // If no error, the image exists locally
}

// pullImage pulls the image from the registry if it's not cached
func pullImage(ctx context.Context, cli *client.Client, imageName string, output output.TaskOutput) error {
	output.AddTask("Pull-Image", fmt.Sprintf("Pulling image %s", imageName))

	out, err := cli.ImagePull(ctx, imageName, image.PullOptions{})
	if err != nil {
		output.FailTask("Pull-Image", fmt.Sprintf("Error pulling image %s: %v", imageName, err))
		return err
	}
	defer out.Close()
	io.Copy(os.Stdout, out)

	output.SucceedTask("Pull-Image", fmt.Sprintf("Image %s pulled", imageName))

	return nil
}

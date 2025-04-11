package sdk

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

	"drasi.io/cli/sdk/registry"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	"github.com/phayes/freeport"
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

func (t *DockerizedDeployer) Build(name string) (registry.Registration, error) {
	ctx := context.Background()

	port, err := freeport.GetFreePort()
	if err != nil {
		return nil, err
	}

	portStr := strconv.Itoa(port)
	portBinding := nat.Port(portStr + "/tcp")

	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("Error getting home directory:", err)
		return nil, err
	}

	mountPath := filepath.Join(homeDir, ".drasi", "servers", name)
	err = os.MkdirAll(mountPath, 0755)
	if err != nil {
		return nil, err
	}

	if !imageExists(ctx, t.dockerClient, containerImage) {
		pullImage(ctx, t.dockerClient, containerImage)
	}

	fmt.Println("Creating container...")

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
		log.Fatalf("Error creating container: %v", err)
	}

	if err := t.dockerClient.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		log.Fatalf("Error starting container: %v", err)
	}

	// Wait for the container to be healthy
	if err := t.waitForReady(resp.ID); err != nil {
		return nil, err
	}

	err = t.waitForApiServer(portStr)
	if err != nil {
		return nil, err
	}

	kubeConfig, err := t.readKubeconfig(resp.ID)
	if err != nil {
		log.Fatalf("Error reading kubeconfig: %v", err)
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
		fmt.Println("Container state:", state)
		time.Sleep(1 * time.Second)
	}

	return nil
}

func (t *DockerizedDeployer) Delete(config *registry.DockerConfig) error {
	ctx := context.Background()
	if config.ContainerId != nil {
		return t.dockerClient.ContainerRemove(ctx, *config.ContainerId, container.RemoveOptions{Force: true})
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
				fmt.Println("HTTP connection established on port", port)
				return nil
			}
			fmt.Println("Waiting for HTTP connection on port", port)
		}
	}
}

func (t *DockerizedDeployer) readKubeconfig(containerId string) ([]byte, error) {
	ctx := context.Background()
	cfgReader, _, err := t.dockerClient.CopyFromContainer(ctx, containerId, "/etc/rancher/k3s/k3s.yaml")
	if err != nil {
		log.Printf("Error reading kubeconfig file: %v", err)
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

// imageExists checks if the specified image is cached locally
func imageExists(ctx context.Context, cli *client.Client, imageName string) bool {
	_, _, err := cli.ImageInspectWithRaw(ctx, imageName)
	return err == nil // If no error, the image exists locally
}

// pullImage pulls the image from the registry if it's not cached
func pullImage(ctx context.Context, cli *client.Client, imageName string) error {
	println("pulling image")
	out, err := cli.ImagePull(ctx, imageName, image.PullOptions{})
	if err != nil {
		println("pull failed")
		return err
	}
	defer out.Close()
	io.Copy(os.Stdout, out)

	return err
}

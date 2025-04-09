package sdk

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"drasi.io/cli/sdk/registry"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/api/types/mount"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/stdcopy"
	"github.com/docker/go-connections/nat"
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

	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("Error getting home directory:", err)
		return nil, err
	}

	mountPath := filepath.Join(homeDir, ".drasi", "servers", name, "k3s")
	err = os.MkdirAll(mountPath, 0755)
	if err != nil {
		return nil, err
	}

	if !imageExists(ctx, t.dockerClient, containerImage) {
		pullImage(ctx, t.dockerClient, containerImage)
	}

	resp, err := t.dockerClient.ContainerCreate(ctx, &container.Config{
		Image: containerImage,
		Cmd:   []string{"server"},
		ExposedPorts: nat.PortSet{
			"6443/tcp": struct{}{},
		},
	}, &container.HostConfig{
		Privileged: true,

		PortBindings: nat.PortMap{
			"6443/tcp": []nat.PortBinding{
				{
					HostIP:   "0.0.0.0",
					HostPort: "6443",
				},
			},
		},
		Mounts: []mount.Mount{
			{
				Type:   mount.TypeBind,
				Source: mountPath,
				Target: "/etc/rancher/k3s",
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
	//_, err = t.dockerClient.ContainerWait(ctx, resp.ID, container.WaitConditionHealthy)
	kubeConfigFile := filepath.Join(mountPath, "k3s.yaml")
	kubeConfig, err := os.ReadFile(kubeConfigFile)
	if err != nil {
		log.Fatalf("Error reading kubeconfig file: %v", err)
	}

	return &registry.KubernetesConfig{
		Namespace:  "drasi-system",
		KubeConfig: kubeConfig,
	}, nil
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

	// Drain the output to ensure the pull completes
	_, err = stdcopy.StdCopy(os.Stdout, os.Stderr, out)
	return err
}

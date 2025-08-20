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
	"strings"
	"time"

	"drasi.io/cli/output"
	"drasi.io/cli/sdk"
	"drasi.io/cli/sdk/registry"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/image"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
	"github.com/phayes/freeport"
	rbacv1 "k8s.io/api/rbac/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
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

func (t *DockerizedDeployer) Build(name string, loadImages bool, versionTag string, output output.TaskOutput) (registry.Registration, error) {
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

	if loadImages {
		err = t.loadDrasiImages(ctx, output, resp, versionTag)
		if err != nil {
			return nil, err
		}
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

func (t *DockerizedDeployer) loadDrasiImages(ctx context.Context, output output.TaskOutput, resp container.CreateResponse, versionTag string) error {
	output.AddTask("Load-Images", "Loading images into container")
	// Get all images with the prefix "drasi-project/"
	images, err := t.dockerClient.ImageList(ctx, image.ListOptions{})
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error listing images: %v", err))
		return err
	}

	// Filter images with the prefix "drasi-project/"
	var drasiImages []string
	for _, img := range images {
		for _, tag := range img.RepoTags {
			tagComponents := strings.Split(tag, ":")
			if strings.HasPrefix(tagComponents[0], "drasi-project/") {
				if len(tagComponents) > 1 {
					if tagComponents[1] != versionTag {
						break
					}
				}
				drasiImages = append(drasiImages, tag)
				break
			}
		}
	}

	if len(drasiImages) == 0 {
		output.SucceedTask("Load-Images", "No drasi-project images found to load")
		return nil
	}

	output.InfoMessage(fmt.Sprintf("Found %d drasi-project images to load", len(drasiImages)))

	// Create a temporary directory for the image tars
	tempDir, err := os.MkdirTemp("", "drasi-images")
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error creating temp directory: %v", err))
		return err
	}
	defer os.RemoveAll(tempDir)

	tarFile := filepath.Join(tempDir, "images.tar")
	saveReader, err := t.dockerClient.ImageSave(ctx, drasiImages)
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error saving images: %v", err))
		return err
	}

	tarWriter, err := os.Create(tarFile)
	if err != nil {
		saveReader.Close()
		output.FailTask("Load-Images", fmt.Sprintf("Error creating tar file: %v", err))
		return err
	}

	_, err = io.Copy(tarWriter, saveReader)
	saveReader.Close()
	tarWriter.Close()
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error writing tar file: %v", err))
		return err
	}

	// Create a new tar file that contains just the original images.tar
	nestedTarPath := filepath.Join(tempDir, "nested_images.tar")
	nestedTarFile, err := os.Create(nestedTarPath)
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error creating nested tar file: %v", err))
		return err
	}
	defer nestedTarFile.Close()

	nestedTarWriter := tar.NewWriter(nestedTarFile)
	defer nestedTarWriter.Close()

	// Get info about the original tar file
	tarFileInfo, err := os.Stat(tarFile)
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error getting tar file info: %v", err))
		return err
	}

	tarFileReader, err := os.Open(tarFile)
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error opening tar file for nesting: %v", err))
		return err
	}
	defer tarFileReader.Close()

	// Add the tar file to the nested tar
	header := &tar.Header{
		Name:     "images.tar",
		Mode:     0644,
		Size:     tarFileInfo.Size(),
		ModTime:  time.Now(),
		Typeflag: tar.TypeReg,
	}

	if err := nestedTarWriter.WriteHeader(header); err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error writing header to nested tar: %v", err))
		return err
	}

	if _, err := io.Copy(nestedTarWriter, tarFileReader); err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error copying tar to nested tar: %v", err))
		return err
	}

	tarFile = nestedTarPath
	containerPath := "/tmp/images.tar"

	tarReader, err := os.Open(tarFile)
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error opening tar file: %v", err))
		return err
	}
	defer tarReader.Close()

	err = t.dockerClient.CopyToContainer(ctx, resp.ID, "/tmp", tarReader, container.CopyToContainerOptions{
		AllowOverwriteDirWithFile: true,
	})
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error copying images to container: %v", err))
		return err
	}

	// Now import the image into k3s
	execConfig := container.ExecOptions{
		Cmd:          []string{"ctr", "image", "import", containerPath},
		AttachStdout: true,
		AttachStderr: true,
	}

	execCreateResp, err := t.dockerClient.ContainerExecCreate(ctx, resp.ID, execConfig)
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error creating exec for image import: %v", err))
		return err
	}

	execAttachResp, err := t.dockerClient.ContainerExecAttach(ctx, execCreateResp.ID, container.ExecAttachOptions{})
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error attaching to exec: %v", err))
		return err
	}

	var outBuf bytes.Buffer
	io.Copy(&outBuf, execAttachResp.Reader)
	execAttachResp.Close()

	// Check if import was successful
	execInspect, err := t.dockerClient.ContainerExecInspect(ctx, execCreateResp.ID)
	if err != nil {
		output.FailTask("Load-Images", fmt.Sprintf("Error inspecting exec: %v", err))
		return err
	}

	if execInspect.ExitCode != 0 {
		output.FailTask("Load-Images", fmt.Sprintf("Error importing images: %s", outBuf.String()))
		return fmt.Errorf("error importing image: %s", outBuf.String())
	}

	// Clean up the tar file in the container
	cleanupConfig := container.ExecOptions{
		Cmd: []string{"rm", containerPath},
	}
	cleanupExec, err := t.dockerClient.ContainerExecCreate(ctx, resp.ID, cleanupConfig)
	if err == nil {
		t.dockerClient.ContainerExecStart(ctx, cleanupExec.ID, container.ExecStartOptions{})
	}

	output.SucceedTask("Load-Images", fmt.Sprintf("Successfully loaded %d images into k3s", len(drasiImages)))

	return nil
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

	// Set the new context as the current context
	existingConfig.CurrentContext = contextName

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

// ConfigureTraefikForDocker configures Traefik ingress controller for k3s Docker environment
func (t *DockerizedDeployer) ConfigureTraefikForDocker(namespace string, output output.TaskOutput) error {
	output.InfoMessage("Auto-configuring Traefik ingress controller for k3s Docker environment...")

	// Get current registry configuration
	reg, err := registry.LoadCurrentRegistrationWithNamespace(namespace)
	if err != nil {
		return fmt.Errorf("failed to load registry configuration: %w", err)
	}

	// Create platform client
	platformClient, err := sdk.NewPlatformClient(reg)
	if err != nil {
		return fmt.Errorf("failed to create platform client: %w", err)
	}

	// Ensure we have a Kubernetes platform client
	k8sPlatformClient, ok := platformClient.(*sdk.KubernetesPlatformClient)
	if !ok {
		return fmt.Errorf("platform client is not a Kubernetes client")
	}

	if err := updateIngressConfig(k8sPlatformClient, namespace, "traefik", "traefik", "kube-system", output); err != nil {
		return fmt.Errorf("failed to update ingress configuration: %w", err)
	}

	if err := updateClusterRolePermissions(k8sPlatformClient, output); err != nil {
		return fmt.Errorf("failed to update cluster role permissions: %w", err)
	}

	output.InfoMessage("Successfully configured Traefik ingress for k3s Docker environment")
	output.InfoMessage("Drasi Sources and Reactions with External endpoints will now be accessible via Traefik")

	return nil
}

// updateIngressConfig updates the drasi-config ConfigMap with ingress controller configuration
func updateIngressConfig(platformClient *sdk.KubernetesPlatformClient, drasiNamespace string, ingressClassName, ingressService, ingressNamespace string, output output.TaskOutput) error {
	output.AddTask("Ingress-Config", "Updating ingress configuration")
	kubeConfig := platformClient.GetKubeConfig()
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		output.FailTask("Ingress-Config", fmt.Sprintf("Error creating Kubernetes client: %v", err))
		return err
	}

	currentConfigMap, err := kubeClient.CoreV1().ConfigMaps(drasiNamespace).Get(context.TODO(), "drasi-config", metav1.GetOptions{})
	if err != nil {
		output.FailTask("Ingress-Config", fmt.Sprintf("Error getting drasi-config ConfigMap: %v", err))
		return err
	}

	// Update the ConfigMap data with ingress configuration
	cfg := currentConfigMap.Data
	if cfg == nil {
		cfg = make(map[string]string)
	}
	cfg["INGRESS_CLASS_NAME"] = ingressClassName
	cfg["INGRESS_LOAD_BALANCER_SERVICE"] = ingressService
	cfg["INGRESS_LOAD_BALANCER_NAMESPACE"] = ingressNamespace

	currentConfigMap.Data = cfg

	_, err = kubeClient.CoreV1().ConfigMaps(drasiNamespace).Update(context.TODO(), currentConfigMap, metav1.UpdateOptions{})
	if err != nil {
		output.FailTask("Ingress-Config", fmt.Sprintf("Error updating drasi-config ConfigMap: %v", err))
		return err
	}

	output.SucceedTask("Ingress-Config", fmt.Sprintf("Successfully configured ingress: class=%s, service=%s/%s", ingressClassName, ingressNamespace, ingressService))
	return nil
}

func updateClusterRolePermissions(platformClient *sdk.KubernetesPlatformClient, output output.TaskOutput) error {
	output.AddTask("RBAC-Update", "Updating ClusterRole permissions for ingress namespace")

	kubeConfig := platformClient.GetKubeConfig()
	kubeClient, err := kubernetes.NewForConfig(kubeConfig)
	if err != nil {
		output.FailTask("RBAC-Update", fmt.Sprintf("Error creating Kubernetes client: %v", err))
		return err
	}

	clusterRoleName := "drasi-resource-provider-cluster-role"

	// Get current ClusterRole
	currentClusterRole, err := kubeClient.RbacV1().ClusterRoles().Get(context.TODO(), clusterRoleName, metav1.GetOptions{})
	if err != nil {
		output.FailTask("RBAC-Update", fmt.Sprintf("Error getting ClusterRole: %v", err))
		return err
	}

	// Check if we already have generic service permissions
	hasGenericServiceAccess := false
	for _, rule := range currentClusterRole.Rules {
		for _, apiGroup := range rule.APIGroups {
			if apiGroup == "" { // Core API group
				for _, resource := range rule.Resources {
					if resource == "services" {
						hasGet := false
						hasList := false
						for _, verb := range rule.Verbs {
							if verb == "get" {
								hasGet = true
							}
							if verb == "list" {
								hasList = true
							}
						}
						if hasGet && hasList && len(rule.ResourceNames) == 0 {
							hasGenericServiceAccess = true
							break
						}
					}
				}
			}
		}
		if hasGenericServiceAccess {
			break
		}
	}

	if hasGenericServiceAccess {
		output.InfoTask("RBAC-Update", "ClusterRole already has generic service access")
		output.SucceedTask("RBAC-Update", "No ClusterRole update needed")
		return nil
	}

	// Update the ClusterRole to have generic service access
	var updatedRules []rbacv1.PolicyRule
	for _, rule := range currentClusterRole.Rules {
		// Skip service rules with resourceNames (e.g., contour-envoy specific rule)
		isServiceRuleWithNames := false
		for _, apiGroup := range rule.APIGroups {
			if apiGroup == "" {
				for _, resource := range rule.Resources {
					if resource == "services" && len(rule.ResourceNames) > 0 {
						isServiceRuleWithNames = true
						break
					}
				}
			}
		}
		if !isServiceRuleWithNames {
			updatedRules = append(updatedRules, rule)
		}
	}

	updatedRules = append(updatedRules, rbacv1.PolicyRule{
		APIGroups: []string{""},
		Resources: []string{"services"},
		Verbs:     []string{"get", "list"},
	})

	// Update the ClusterRole
	currentClusterRole.Rules = updatedRules
	_, err = kubeClient.RbacV1().ClusterRoles().Update(context.TODO(), currentClusterRole, metav1.UpdateOptions{})
	if err != nil {
		output.FailTask("RBAC-Update", fmt.Sprintf("Error updating ClusterRole: %v", err))
		return err
	}

	output.SucceedTask("RBAC-Update", "ClusterRole updated")
	return nil
}

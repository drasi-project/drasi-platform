import Docker from 'dockerode';


const containerImage = "rancher/k3s:v1.32.2-k3s1";

export class DockerizedDeployer {

    private client: Docker;

    constructor() {
        this.client = new Docker();
    }

    async build(name: string) {
        this.client.createContainer({
            Image: containerImage,
            name: name,
        });
    }
    
}
import os from "os";
import fs from "fs";
import yaml from 'js-yaml';
import { KubeConfig } from "@kubernetes/client-node";
import EventEmitter from "events";
import { Disposable, FileSystemWatcher, workspace } from "vscode";

const serversPath: string = "servers";
const currentFile: string = "current";
const configFile: string = "config.json";
const defaultNamespace: string = "drasi-system";

export interface Registration {
    id: string;
    kind: string;
}

export interface KubernetesConfig extends Registration {
    namespace: string;
    kubeconfig: string;
}

export interface DockerConfig extends Registration {
    containerId: string;
    internalConfig: Registration;
}

function hydrateRegistration(data: any): Registration {    
    switch (data.kind) {
        case "kubernetes":
            return data as KubernetesConfig;
        case "docker":
            let dockerResult = data as DockerConfig;
            dockerResult.internalConfig = hydrateRegistration(data.internalConfig);
            return dockerResult;
        default:
            throw new Error(`Unknown registration kind: ${data.kind}`); 

    }    
}

export class ConfigurationRegistry implements Disposable {
    private basePath: string;
    private eventEmitter: EventEmitter;
    private watcher: fs.FSWatcher | undefined;

    constructor() {
        this.basePath = os.homedir() + "/.drasi";
        this.eventEmitter = new EventEmitter();
        this.watcher = fs.watch(this.basePath + "/" + currentFile, (eventType, filename) => {
            if (eventType === "change" && filename === currentFile) {
                this.eventEmitter.emit("currentRegistrationChanged");
            }
        });
    }
    
    dispose() {
        this.watcher?.close();        
        this.watcher = undefined;        
    }

    onCurrentRegistrationChanged(callback: () => void) {
        this.eventEmitter.on("currentRegistrationChanged", callback);
    }

    async saveRegistration(registration: Registration) {
        let regPath = this.basePath + "/" + serversPath + "/" + registration.id;
        let configPath = regPath + "/" + configFile;

        if (!fs.existsSync(regPath)) {
            fs.mkdirSync(regPath, { recursive: true });
        }

        await fs.promises.writeFile(configPath, JSON.stringify(registration));        
    }

    async loadRegistration(id: string): Promise<Registration | undefined> {
        let regPath = this.basePath + "/" + serversPath + "/" + id;
        let configPath = regPath + "/" + configFile;

        if (!fs.existsSync(configPath)) {
            return undefined;
        }

        let data = await fs.promises.readFile(configPath, "utf-8");
        return hydrateRegistration(JSON.parse(data));
    }

    async registrationExists(id: string): Promise<boolean> {
        let regPath = this.basePath + "/" + serversPath + "/" + id;
        let configPath = regPath + "/" + configFile;

        return fs.existsSync(configPath);
    }

    async getCurrentRegistrationId(): Promise<string | undefined> {
        let filePath = this.basePath + "/" + currentFile;        
        if (!fs.existsSync(filePath)) {
            return undefined;
        }
        let currentId = await fs.promises.readFile(filePath, "utf-8");
        return currentId;
    }

    async deleteRegistration(id: string) {
        let regPath = this.basePath + "/" + serversPath + "/" + id;
        if (fs.existsSync(regPath)) {
            await fs.promises.rm(regPath, { recursive: true, force: true });
        }
        let currentId = await this.getCurrentRegistrationId();
        
        if (currentId === id) {
            await fs.promises.rm(this.basePath + "/" + currentFile, { force: true });
        }        
    }

    async setCurrentRegistration(id: string) {
        let filePath = this.basePath + "/" + currentFile;
        await fs.promises.writeFile(filePath, id);
    }

    async unsetCurrentRegistration() {
        let filePath = this.basePath + "/" + currentFile;
        if (fs.existsSync(filePath)) {
            await fs.promises.rm(filePath, { force: true });
        }
    }

    async getAllRegistrations(): Promise<Registration[]> {
        let registrations: Registration[] = [];
        let regPath = this.basePath + "/" + serversPath;
        if (fs.existsSync(regPath)) {
            let dirs = await fs.promises.readdir(regPath);
            for (let dir of dirs) {
                let registration = await this.loadRegistration(dir);
                if (registration) {
                    registrations.push(registration);
                }
            }
        }
        return registrations;
    }

    async loadCurrentRegistration(): Promise<Registration | undefined> {
        let currentId = await this.getCurrentRegistrationId();
        if (!currentId) {
            return await this.saveKubecontextAsCurrent();
        }
        return await this.loadRegistration(currentId);
    }

    async saveKubecontextAsCurrent(): Promise<KubernetesConfig | undefined> {
        let kubecontextRegistration = await this.getCurrentKubecontextRegistration();
        if (kubecontextRegistration) {
            await this.saveRegistration(kubecontextRegistration);
            await this.setCurrentRegistration(kubecontextRegistration.id);
        }
        return kubecontextRegistration;
    }

    private async getCurrentKubecontextRegistration(): Promise<KubernetesConfig | undefined> {        
        const kubeConfig = new KubeConfig();
        kubeConfig.loadFromDefault();
        let configJson = kubeConfig.exportConfig();
        let configObject = JSON.parse(configJson);
        let configYaml = yaml.dump(configObject);        
        let base64EncodedYaml = Buffer.from(configYaml).toString("base64");

        return {
            id: kubeConfig.currentContext,
            kind: "kubernetes",
            namespace: defaultNamespace,
            kubeconfig: base64EncodedYaml
        };
    }



}

import { DrasiReaction, ChangeEvent, parseYaml, ControlEvent, getConfigValue } from '@drasi/reaction-sdk';
import axios, { AxiosHeaders, Method } from 'axios';
import Handlebars from 'handlebars';

class QueryConfig {
    addedResult?: CallSpec;
    updatedResult?: CallSpec;
    deletedResult?: CallSpec;
}

class CallSpec {
    url: string;
    method: Method;
    body: string;
    headers?: { [key: string]: string };
}

class ReactionConfig {
    baseUrl: string;
    token?: string;
    timeout: number = 10000;
}

const reactionConfig: ReactionConfig = {
    baseUrl: getConfigValue("baseUrl"),
    token: getConfigValue("token"),
    timeout: parseInt(getConfigValue("timeout") || "10000")
}

async function onChangeEvent(event: ChangeEvent, queryConfig?: QueryConfig): Promise<void> {
    console.log(`Received change sequence: ${event.sequence} for query ${event.queryId}`);

    if (queryConfig.addedResult) {
        let urlTemplate = Handlebars.compile(queryConfig.addedResult.url);
        let bodyTemplate = Handlebars.compile(queryConfig.addedResult.body || '');

        let headers = new AxiosHeaders();
        if (reactionConfig.token) {
            headers.setAuthorization(`Bearer ${reactionConfig.token}`);
        }
        for (let k in queryConfig.addedResult.headers) {            
            headers.set(k, queryConfig.addedResult.headers[k]);
        }

        for (let added of event.addedResults) {
            let url = urlTemplate(added);
            let body = bodyTemplate(added);

            let resp = await axios.request({
                baseURL: reactionConfig.baseUrl,
                url: url,
                method: queryConfig.addedResult.method,
                timeout: reactionConfig.timeout,
                data: body,
                headers: headers,
            });
            console.log(`Response from ${url} - ${resp.status}`);
        }
    }

    if (queryConfig.deletedResult) {
        let urlTemplate = Handlebars.compile(queryConfig.deletedResult.url);
        let bodyTemplate = Handlebars.compile(queryConfig.deletedResult.body || '');

        let headers = new AxiosHeaders();
        if (reactionConfig.token) {
            headers.setAuthorization(`Bearer ${reactionConfig.token}`);
        }
        for (let k in queryConfig.deletedResult.headers) {            
            headers.set(k, queryConfig.deletedResult.headers[k]);
        }

        for (let deleted of event.deletedResults) {
            let url = urlTemplate(deleted);
            let body = bodyTemplate(deleted);

            let resp = await axios.request({
                baseURL: reactionConfig.baseUrl,
                url: url,
                method: queryConfig.deletedResult.method,
                timeout: reactionConfig.timeout,
                data: body,
                headers: headers,
            });
            console.log(`Response from ${url} - ${resp.status}`);
        }
    }
    
    
    if (queryConfig.updatedResult) {
        let urlTemplate = Handlebars.compile(queryConfig.updatedResult.url);
        let bodyTemplate = Handlebars.compile(queryConfig.updatedResult.body || '');

        let headers = new AxiosHeaders();
        if (reactionConfig.token) {
            headers.setAuthorization(`Bearer ${reactionConfig.token}`);
        }
        for (let k in queryConfig.updatedResult.headers) {            
            headers.set(k, queryConfig.updatedResult.headers[k]);
        }

        for (let updated of event.updatedResults) {
            let url = urlTemplate(updated);
            let body = bodyTemplate(updated);

            let resp = await axios.request({
                baseURL: reactionConfig.baseUrl,
                url: url,
                method: queryConfig.updatedResult.method,
                timeout: reactionConfig.timeout,
                data: body,
                headers: headers,
            });
            console.log(`Response from ${url} - ${resp.status}`);    
        }    
    }
}

async function onControlEvent(event: ControlEvent, queryConfig?: QueryConfig): Promise<void> {
    console.log(`Received control signal: ${JSON.stringify(event.controlSignal)} for query ${event.queryId}`);
}

let myReaction = new DrasiReaction<QueryConfig>(onChangeEvent, {
    parseQueryConfig: parseYaml,
    onControlEvent: onControlEvent
});

myReaction.start();

import { DrasiReaction, ChangeEvent, parseYaml, ControlEvent, getConfigValue } from '@drasi/reaction-sdk';
import axios, { AxiosHeaders, Method } from 'axios';
import Handlebars from 'handlebars';

class QueryConfig {
    added?: CallSpec;
    updated?: CallSpec;
    deleted?: CallSpec;
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

    if (queryConfig.added) {
        let urlTemplate = Handlebars.compile(queryConfig.added.url);
        let bodyTemplate = Handlebars.compile(queryConfig.added.body || '');

        let headers = new AxiosHeaders();
        if (reactionConfig.token) {
            headers.setAuthorization(`Bearer ${reactionConfig.token}`);
        }
        for (let k in queryConfig.added.headers) {
            headers.set(k, queryConfig.added.headers[k]);
        }

        for (let added of event.addedResults) {
            let url = urlTemplate({ after: added });
            let body = bodyTemplate({ after: added });

            let resp = await axios.request({
                baseURL: reactionConfig.baseUrl,
                url: url,
                method: queryConfig.added.method,
                timeout: reactionConfig.timeout,
                data: body,
                headers: headers,
            });
            console.log(`Response from ${url} - ${resp.status}`);
        }
    }

    if (queryConfig.deleted) {
        let urlTemplate = Handlebars.compile(queryConfig.deleted.url);
        let bodyTemplate = Handlebars.compile(queryConfig.deleted.body || '');

        let headers = new AxiosHeaders();
        if (reactionConfig.token) {
            headers.setAuthorization(`Bearer ${reactionConfig.token}`);
        }
        for (let k in queryConfig.deleted.headers) {
            headers.set(k, queryConfig.deleted.headers[k]);
        }

        for (let deleted of event.deletedResults) {
            let url = urlTemplate({ before: deleted });
            let body = bodyTemplate({ before: deleted });

            let resp = await axios.request({
                baseURL: reactionConfig.baseUrl,
                url: url,
                method: queryConfig.deleted.method,
                timeout: reactionConfig.timeout,
                data: body,
                headers: headers,
            });
            console.log(`Response from ${url} - ${resp.status}`);
        }
    }

    if (queryConfig.updated) {
        let urlTemplate = Handlebars.compile(queryConfig.updated.url);
        let bodyTemplate = Handlebars.compile(queryConfig.updated.body || '');

        let headers = new AxiosHeaders();
        if (reactionConfig.token) {
            headers.setAuthorization(`Bearer ${reactionConfig.token}`);
        }
        for (let k in queryConfig.updated.headers) {
            headers.set(k, queryConfig.updated.headers[k]);
        }

        for (let updated of event.updatedResults) {
            let url = urlTemplate(updated);
            let body = bodyTemplate(updated);

            let resp = await axios.request({
                baseURL: reactionConfig.baseUrl,
                url: url,
                method: queryConfig.updated.method,
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

// To parse this data:
//
//   import { Convert, ChangeNotification, ChangePayload, ChangeSource, ControlPayload, ControlSignalNotification, Notification, Op, ReloadHeader, ReloadItem, Versions } from "./file";
//
//   const changeNotification = Convert.toChangeNotification(json);
//   const changePayload = Convert.toChangePayload(json);
//   const changeSource = Convert.toChangeSource(json);
//   const controlPayload = Convert.toControlPayload(json);
//   const controlSignalNotification = Convert.toControlSignalNotification(json);
//   const notification = Convert.toNotification(json);
//   const op = Convert.toOp(json);
//   const reloadHeader = Convert.toReloadHeader(json);
//   const reloadItem = Convert.toReloadItem(json);
//   const versions = Convert.toVersions(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface ChangeNotification {
    op:      ChangeNotificationOp;
    payload: PayloadObject;
    /**
     * The sequence number of the source change
     */
    seq:       number;
    metadata?: { [key: string]: any };
    ts_ms:     number;
    [property: string]: any;
}

export enum ChangeNotificationOp {
    D = "d",
    I = "i",
    U = "u",
}

export interface PayloadObject {
    after?:  { [key: string]: any };
    before?: { [key: string]: any };
    source:  SourceObject;
    [property: string]: any;
}

export interface SourceObject {
    /**
     * The ID of the query that the change originated from
     */
    queryId: string;
    ts_ms:   number;
    [property: string]: any;
}

export interface ChangePayload {
    after?:  { [key: string]: any };
    before?: { [key: string]: any };
    source:  SourceObject;
    [property: string]: any;
}

export interface ChangeSource {
    /**
     * The ID of the query that the change originated from
     */
    queryId: string;
    ts_ms:   number;
    [property: string]: any;
}

export interface ControlPayload {
    kind:   string;
    source: SourceObject;
    [property: string]: any;
}

export interface ControlSignalNotification {
    op:      ControlSignalNotificationOp;
    payload: ControlSignalNotificationPayload;
    /**
     * The sequence number of the control signal
     */
    seq:       number;
    metadata?: { [key: string]: any };
    ts_ms:     number;
    [property: string]: any;
}

export enum ControlSignalNotificationOp {
    X = "x",
}

export interface ControlSignalNotificationPayload {
    kind:   string;
    source: SourceObject;
    [property: string]: any;
}

export interface Notification {
    metadata?: { [key: string]: any };
    op:        Op;
    ts_ms:     number;
    [property: string]: any;
}

export enum Op {
    D = "d",
    H = "h",
    I = "i",
    R = "r",
    U = "u",
    X = "x",
}

export interface ReloadHeader {
    op: ReloadHeaderOp;
    /**
     * The sequence number of last known source change
     */
    seq:       number;
    metadata?: { [key: string]: any };
    ts_ms:     number;
    [property: string]: any;
}

export enum ReloadHeaderOp {
    H = "h",
}

export interface ReloadItem {
    op:        ReloadItemOp;
    payload:   PayloadObject;
    metadata?: { [key: string]: any };
    ts_ms:     number;
    [property: string]: any;
}

export enum ReloadItemOp {
    R = "r",
}

export enum Versions {
    V1 = "v1",
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toChangeNotification(json: string): ChangeNotification {
        return cast(JSON.parse(json), r("ChangeNotification"));
    }

    public static changeNotificationToJson(value: ChangeNotification): string {
        return JSON.stringify(uncast(value, r("ChangeNotification")), null, 2);
    }

    public static toChangePayload(json: string): ChangePayload {
        return cast(JSON.parse(json), r("ChangePayload"));
    }

    public static changePayloadToJson(value: ChangePayload): string {
        return JSON.stringify(uncast(value, r("ChangePayload")), null, 2);
    }

    public static toChangeSource(json: string): ChangeSource {
        return cast(JSON.parse(json), r("ChangeSource"));
    }

    public static changeSourceToJson(value: ChangeSource): string {
        return JSON.stringify(uncast(value, r("ChangeSource")), null, 2);
    }

    public static toControlPayload(json: string): ControlPayload {
        return cast(JSON.parse(json), r("ControlPayload"));
    }

    public static controlPayloadToJson(value: ControlPayload): string {
        return JSON.stringify(uncast(value, r("ControlPayload")), null, 2);
    }

    public static toControlSignalNotification(json: string): ControlSignalNotification {
        return cast(JSON.parse(json), r("ControlSignalNotification"));
    }

    public static controlSignalNotificationToJson(value: ControlSignalNotification): string {
        return JSON.stringify(uncast(value, r("ControlSignalNotification")), null, 2);
    }

    public static toNotification(json: string): Notification {
        return cast(JSON.parse(json), r("Notification"));
    }

    public static notificationToJson(value: Notification): string {
        return JSON.stringify(uncast(value, r("Notification")), null, 2);
    }

    public static toOp(json: string): Op {
        return cast(JSON.parse(json), r("Op"));
    }

    public static opToJson(value: Op): string {
        return JSON.stringify(uncast(value, r("Op")), null, 2);
    }

    public static toReloadHeader(json: string): ReloadHeader {
        return cast(JSON.parse(json), r("ReloadHeader"));
    }

    public static reloadHeaderToJson(value: ReloadHeader): string {
        return JSON.stringify(uncast(value, r("ReloadHeader")), null, 2);
    }

    public static toReloadItem(json: string): ReloadItem {
        return cast(JSON.parse(json), r("ReloadItem"));
    }

    public static reloadItemToJson(value: ReloadItem): string {
        return JSON.stringify(uncast(value, r("ReloadItem")), null, 2);
    }

    public static toVersions(json: string): Versions {
        return cast(JSON.parse(json), r("Versions"));
    }

    public static versionsToJson(value: Versions): string {
        return JSON.stringify(uncast(value, r("Versions")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ChangeNotification": o([
        { json: "op", js: "op", typ: r("ChangeNotificationOp") },
        { json: "payload", js: "payload", typ: r("PayloadObject") },
        { json: "seq", js: "seq", typ: 0 },
        { json: "metadata", js: "metadata", typ: u(undefined, m("any")) },
        { json: "ts_ms", js: "ts_ms", typ: 0 },
    ], "any"),
    "PayloadObject": o([
        { json: "after", js: "after", typ: u(undefined, m("any")) },
        { json: "before", js: "before", typ: u(undefined, m("any")) },
        { json: "source", js: "source", typ: r("SourceObject") },
    ], "any"),
    "SourceObject": o([
        { json: "queryId", js: "queryId", typ: "" },
        { json: "ts_ms", js: "ts_ms", typ: 0 },
    ], "any"),
    "ChangePayload": o([
        { json: "after", js: "after", typ: u(undefined, m("any")) },
        { json: "before", js: "before", typ: u(undefined, m("any")) },
        { json: "source", js: "source", typ: r("SourceObject") },
    ], "any"),
    "ChangeSource": o([
        { json: "queryId", js: "queryId", typ: "" },
        { json: "ts_ms", js: "ts_ms", typ: 0 },
    ], "any"),
    "ControlPayload": o([
        { json: "kind", js: "kind", typ: "" },
        { json: "source", js: "source", typ: r("SourceObject") },
    ], "any"),
    "ControlSignalNotification": o([
        { json: "op", js: "op", typ: r("ControlSignalNotificationOp") },
        { json: "payload", js: "payload", typ: r("ControlSignalNotificationPayload") },
        { json: "seq", js: "seq", typ: 0 },
        { json: "metadata", js: "metadata", typ: u(undefined, m("any")) },
        { json: "ts_ms", js: "ts_ms", typ: 0 },
    ], "any"),
    "ControlSignalNotificationPayload": o([
        { json: "kind", js: "kind", typ: "" },
        { json: "source", js: "source", typ: r("SourceObject") },
    ], "any"),
    "Notification": o([
        { json: "metadata", js: "metadata", typ: u(undefined, m("any")) },
        { json: "op", js: "op", typ: r("Op") },
        { json: "ts_ms", js: "ts_ms", typ: 0 },
    ], "any"),
    "ReloadHeader": o([
        { json: "op", js: "op", typ: r("ReloadHeaderOp") },
        { json: "seq", js: "seq", typ: 0 },
        { json: "metadata", js: "metadata", typ: u(undefined, m("any")) },
        { json: "ts_ms", js: "ts_ms", typ: 0 },
    ], "any"),
    "ReloadItem": o([
        { json: "op", js: "op", typ: r("ReloadItemOp") },
        { json: "payload", js: "payload", typ: r("PayloadObject") },
        { json: "metadata", js: "metadata", typ: u(undefined, m("any")) },
        { json: "ts_ms", js: "ts_ms", typ: 0 },
    ], "any"),
    "ChangeNotificationOp": [
        "d",
        "i",
        "u",
    ],
    "ControlSignalNotificationOp": [
        "x",
    ],
    "Op": [
        "d",
        "h",
        "i",
        "r",
        "u",
        "x",
    ],
    "ReloadHeaderOp": [
        "h",
    ],
    "ReloadItemOp": [
        "r",
    ],
    "Versions": [
        "v1",
    ],
};

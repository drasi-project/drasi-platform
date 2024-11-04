// package: dapr.proto.placement.v1
// file: dapr/proto/placement/v1/placement.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";

export class PlacementOrder extends jspb.Message { 

    hasTables(): boolean;
    clearTables(): void;
    getTables(): PlacementTables | undefined;
    setTables(value?: PlacementTables): PlacementOrder;
    getOperation(): string;
    setOperation(value: string): PlacementOrder;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PlacementOrder.AsObject;
    static toObject(includeInstance: boolean, msg: PlacementOrder): PlacementOrder.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PlacementOrder, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PlacementOrder;
    static deserializeBinaryFromReader(message: PlacementOrder, reader: jspb.BinaryReader): PlacementOrder;
}

export namespace PlacementOrder {
    export type AsObject = {
        tables?: PlacementTables.AsObject,
        operation: string,
    }
}

export class PlacementTables extends jspb.Message { 

    getEntriesMap(): jspb.Map<string, PlacementTable>;
    clearEntriesMap(): void;
    getVersion(): string;
    setVersion(value: string): PlacementTables;
    getApiLevel(): number;
    setApiLevel(value: number): PlacementTables;
    getReplicationFactor(): number;
    setReplicationFactor(value: number): PlacementTables;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PlacementTables.AsObject;
    static toObject(includeInstance: boolean, msg: PlacementTables): PlacementTables.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PlacementTables, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PlacementTables;
    static deserializeBinaryFromReader(message: PlacementTables, reader: jspb.BinaryReader): PlacementTables;
}

export namespace PlacementTables {
    export type AsObject = {

        entriesMap: Array<[string, PlacementTable.AsObject]>,
        version: string,
        apiLevel: number,
        replicationFactor: number,
    }
}

export class PlacementTable extends jspb.Message { 

    getHostsMap(): jspb.Map<number, string>;
    clearHostsMap(): void;
    clearSortedSetList(): void;
    getSortedSetList(): Array<number>;
    setSortedSetList(value: Array<number>): PlacementTable;
    addSortedSet(value: number, index?: number): number;

    getLoadMapMap(): jspb.Map<string, Host>;
    clearLoadMapMap(): void;
    getTotalLoad(): number;
    setTotalLoad(value: number): PlacementTable;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PlacementTable.AsObject;
    static toObject(includeInstance: boolean, msg: PlacementTable): PlacementTable.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PlacementTable, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PlacementTable;
    static deserializeBinaryFromReader(message: PlacementTable, reader: jspb.BinaryReader): PlacementTable;
}

export namespace PlacementTable {
    export type AsObject = {

        hostsMap: Array<[number, string]>,
        sortedSetList: Array<number>,

        loadMapMap: Array<[string, Host.AsObject]>,
        totalLoad: number,
    }
}

export class Host extends jspb.Message { 
    getName(): string;
    setName(value: string): Host;
    getPort(): number;
    setPort(value: number): Host;
    getLoad(): number;
    setLoad(value: number): Host;
    clearEntitiesList(): void;
    getEntitiesList(): Array<string>;
    setEntitiesList(value: Array<string>): Host;
    addEntities(value: string, index?: number): string;
    getId(): string;
    setId(value: string): Host;
    getPod(): string;
    setPod(value: string): Host;
    getApiLevel(): number;
    setApiLevel(value: number): Host;
    getNamespace(): string;
    setNamespace(value: string): Host;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Host.AsObject;
    static toObject(includeInstance: boolean, msg: Host): Host.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Host, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Host;
    static deserializeBinaryFromReader(message: Host, reader: jspb.BinaryReader): Host;
}

export namespace Host {
    export type AsObject = {
        name: string,
        port: number,
        load: number,
        entitiesList: Array<string>,
        id: string,
        pod: string,
        apiLevel: number,
        namespace: string,
    }
}

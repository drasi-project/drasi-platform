

export class ChangeEvent {
    kind: string = "Change";
    addedResults: any[] = [];
    removedResults: any[] = [];
    updatedResults: UpdatedResult[] = [];
}

export class UpdatedResult {
    before: any;
    after: any;
}

export class ControlEvent {
    kind: string = "Control";
    controlSignal: ControlSignal | undefined;   
}

export class ControlSignal {
    kind: string | undefined;
}
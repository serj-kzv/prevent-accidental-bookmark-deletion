import {Identifiable} from "./Identifiable";

export default class IdentifiableObject implements Identifiable {

    constructor(protected id?: string) {
    }

    getId(): string {
        return this.id;
    }

    setId(id: string): void {
        this.id = id;
    }

}
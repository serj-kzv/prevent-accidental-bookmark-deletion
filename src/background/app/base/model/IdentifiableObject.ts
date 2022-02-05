import {Identifiable} from "./Identifiable";

export default class IdentifiableObject implements Identifiable {

    constructor(public id?: string) {
    }

    getId(): string {
        return this.id;
    }

}
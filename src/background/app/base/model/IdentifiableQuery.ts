import IdentifiableObject from "./IdentifiableObject";

export default class IdentifiableQuery extends IdentifiableObject {
    public constructor(id?: string) {
        super(id);
    }
}
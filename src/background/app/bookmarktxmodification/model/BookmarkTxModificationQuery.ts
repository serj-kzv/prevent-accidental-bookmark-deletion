import {Identifiable} from "../../base/model/Identifiable";

export default class BookmarkTxModificationQuery implements Identifiable {

    public constructor(
        public id?: string,
    ) {
    }

    getId(): string {
        return this.id;
    }

}
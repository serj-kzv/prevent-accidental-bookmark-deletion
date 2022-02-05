import {BookmarkType} from "./BookmarkType";
import {Identifiable} from "../../base/model/Identifiable";

export class BookmarkQuery implements Identifiable {

    public constructor(
        public id?: string,
        public parentId?: string,
        public title?: string,
        public type?: BookmarkType,
        public url?: string,
        public index?: number,
    ) {
    }

    getId(): string {
        return this.id;
    }

}
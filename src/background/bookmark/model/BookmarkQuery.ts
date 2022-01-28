import {BookmarkType} from "./BookmarkType";

export class BookmarkQuery {

    public constructor(
        public id?: string,
        public parentId?: string,
        public title?: string,
        public type?: BookmarkType,
        public url?: string,
        public index?: number,
    ) {
    }

}
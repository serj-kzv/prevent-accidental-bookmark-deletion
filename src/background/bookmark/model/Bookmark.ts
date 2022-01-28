import {BookmarkType} from "./BookmarkType";

export class Bookmark {

    public constructor(
        public id: string,
        public parentId: string,
        public title: string,
        public type: BookmarkType,
        public url: string,
        public index: number,
        public bookmarks: Bookmark[] = []
    ) {
    }

}
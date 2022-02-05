import {BookmarkType} from "./BookmarkType";
import IdentifiableObject from "../../base/model/IdentifiableObject";

export class Bookmark extends IdentifiableObject {

    public constructor(
        public id: string,
        public parentId: string,
        public title: string,
        public type: BookmarkType,
        public url: string,
        public index: number,
        public bookmarks: Bookmark[] = []
    ) {
        super(id);
    }

}
import {Bookmark} from "../../bookmark/model/Bookmark";
import {BookmarkTxModificationType} from "./BookmarkTxModificationType";
import {Identifiable} from "../../base/model/Identifiable";

export default class BookmarkTxModification implements Identifiable {
    public id: string;

    constructor(
        public bookmark: Bookmark,
        public bookmarkTxModificationType: BookmarkTxModificationType
    ) {
        this.id = bookmark.id;
    }

    getId(): string {
        return this.id;
    }
}
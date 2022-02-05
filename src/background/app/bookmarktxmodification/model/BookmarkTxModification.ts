import {Bookmark} from "../../bookmark/model/Bookmark";
import {BookmarkTxModificationType} from "./BookmarkTxModificationType";
import IdentifiableObject from "../../base/model/IdentifiableObject";

export default class BookmarkTxModification extends IdentifiableObject {
    public id: string;

    constructor(
        public bookmark: Bookmark,
        public bookmarkTxModificationType: BookmarkTxModificationType
    ) {
        super(bookmark.id);
    }

}
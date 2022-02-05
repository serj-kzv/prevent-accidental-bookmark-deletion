import {BookmarkTxModificationType} from "./BookmarkTxModificationType";
import IdentifiableObject from "../../base/model/IdentifiableObject";

export default class BookmarkTxModification extends IdentifiableObject {

    constructor(
        id: string,
        public bookmarkTxModificationType: BookmarkTxModificationType
    ) {
        super(id);
    }

}
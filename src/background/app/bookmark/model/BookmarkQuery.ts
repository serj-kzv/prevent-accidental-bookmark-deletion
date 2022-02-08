import {BookmarkType} from "./BookmarkType";
import IdentifiableQuery from "../../base/model/IdentifiableQuery";

export class BookmarkQuery extends IdentifiableQuery {

    public constructor(
        id?: string,
        public parentId?: string,
        public title?: string,
        public type?: BookmarkType,
        public url?: string,
        public index?: number,
    ) {
        super(id);
    }

}
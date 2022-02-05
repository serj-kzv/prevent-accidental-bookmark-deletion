import IdentifiableObject from "../../base/model/IdentifiableObject";

export default class BookmarkTxModificationQuery extends IdentifiableObject {

    public constructor(
        public id?: string,
    ) {
        super(id);
    }

}
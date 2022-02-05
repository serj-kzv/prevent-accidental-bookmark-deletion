import BookmarkTxModification from "../model/BookmarkTxModification";
import {BaseDao} from "../../base/repository/BaseDao";
import {default as PouchDB} from "pouchdb-browser";
import BookmarkTxModificationQuery from "../model/BookmarkTxModificationQuery";

export default class BookmarkTxModificationDao extends BaseDao<BookmarkTxModification, BookmarkTxModificationQuery>{

    public constructor(db: PouchDB.Database<BookmarkTxModification>) {
        super(db, BookmarkTxModificationQuery);
    }

}
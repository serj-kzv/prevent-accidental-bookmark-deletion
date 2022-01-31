import {Constants} from "../utils/Constants";
import {Bookmark} from "../model/Bookmark";
import PouchDBFind from "pouchdb-find";

const PouchDB = require('pouchdb-browser').default;

PouchDB.plugin(PouchDBFind);

export default class BookmarkDataSource {
    public db: PouchDB.Database<Bookmark> = null;

    private constructor() {
    }

    public static build(): BookmarkDataSource {
        const bookmarkDataSource: BookmarkDataSource = new BookmarkDataSource();

        bookmarkDataSource.db = new PouchDB(Constants.BOOKMARK_DATABASE_NAME);

        return bookmarkDataSource;
    }
}
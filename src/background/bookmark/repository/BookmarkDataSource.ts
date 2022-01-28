const PouchDB = require('pouchdb-browser').default;
import {Bookmark} from "../model/Bookmark";
import PouchDBFind from "pouchdb-find";

PouchDB.plugin(PouchDBFind);

class BookmarkDataSource {
    public db: PouchDB.Database<Bookmark> = null;

    private constructor() {
    }

    public static build(): BookmarkDataSource {
        const bookmarkDataSource: BookmarkDataSource = new BookmarkDataSource();

        bookmarkDataSource.db = new PouchDB('bookmark');

        return bookmarkDataSource;
    }
}

const bookmarkDataSource: BookmarkDataSource = BookmarkDataSource.build();

export default bookmarkDataSource;
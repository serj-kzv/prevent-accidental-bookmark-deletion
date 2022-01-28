import * as PouchDB from "pouchdb";
import {Bookmark} from "../model/Bookmark";
import PouchDBFind from "pouchdb-find";

PouchDB.plugin(PouchDBFind);

class BookmarkDataSource {
    public db: PouchDB.Database<Bookmark> = null;

    private constructor() {
    }

    public static build(): BookmarkDataSource {
        const bookmarkDataSource: BookmarkDataSource = new BookmarkDataSource();

        bookmarkDataSource.db = new PouchDB<Bookmark>('bookmark');

        return bookmarkDataSource;
    }
}

const bookmarkDataSource: BookmarkDataSource = BookmarkDataSource.build();

export default bookmarkDataSource;
import {BookmarkQuery} from "./BookmarkQuery";
import {Bookmark} from "./Bookmark";
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

export class BookmarkDao {

    constructor(
        public db = new PouchDB('kittens')
    ) {
    }

    async findOne(query: BookmarkQuery): Promise<any> {
        const bookmarks: Bookmark[] = await this.find(query);
        const count: number = bookmarks.length;

        if (count < 1) {
            return null;
        } else if (count > 1) {
            throw new Error('Multi values');
        }

        return (await this.find(query))[0];
    }

    async find(query: BookmarkQuery): Promise<any> {
        return await this.db.find({
            selector: query
        });
    }

    async findById(id: string): Promise<any> {
        return await this.findOne(new BookmarkQuery(id));
    }

    async create(bookmark: Bookmark): Promise<any> {
        const bookmarks: Bookmark[] = await this.findById(bookmark.getId());

        if (bookmarks.length > 1) {
            throw new Error('Already exists');
        }

        return await this.db.put<Bookmark>(bookmark);
    }

    addChild(query: BookmarkQuery, bookmark: Bookmark) {
        const foundBookmark = this.findOne(query);


    }

    addChildById(id: string, bookmark: Bookmark) {
        return this.addChild(new BookmarkQuery(id), bookmark);
    }

    remove(query: BookmarkQuery, bookmark: Bookmark) {
        this.find(query);
    }

    removeById(id: string, bookmark: Bookmark) {
        return this.remove(new BookmarkQuery(id), bookmark);
    }

    removeChild(query: BookmarkQuery, bookmark: Bookmark) {
        this.find(query);
    }

    removeChildById(id: string, bookmark: Bookmark) {
        return this.removeChild(new BookmarkQuery(id), bookmark);
    }

}
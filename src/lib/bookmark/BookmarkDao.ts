import {BookmarkQuery} from "./BookmarkQuery";
import {BookmarkValidatorUtils} from "./BookmarkValidatorUtils";
import {Bookmark} from "./Bookmark";
import * as PouchDB from 'pouchdb';
import * as PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);

export class BookmarkDao {

    constructor(
        public db = new PouchDB<Bookmark>('bookmark')
    ) {
    }

    async save(bookmark: Bookmark): Promise<Bookmark> {
        BookmarkValidatorUtils.validateHasId(bookmark);

        const foundBookmark: Bookmark = await this.findById(bookmark.getId());

        if (foundBookmark) {
            throw new Error('Already exists');
        }

        await this.db.put<Bookmark>(bookmark);

        return bookmark;
    }

    async saveChildByParentQuery(query: BookmarkQuery, bookmark: Bookmark): Promise<Bookmark> {
        BookmarkValidatorUtils.validateHasNoId(bookmark)
        BookmarkValidatorUtils.validateNotEmptyQuery(query);

        const parentBookmark: Bookmark = await this.findOne(query);

        if (parentBookmark) {
            bookmark.parentId = parentBookmark.id;

            return this.save(bookmark);
        }

        throw Error('Has no such parent with query');
    }

    async saveChildByParentId(id: string, bookmark: Bookmark): Promise<Bookmark | null> {
        BookmarkValidatorUtils.validateBookmarkId(id);

        return this.saveChildByParentQuery(new BookmarkQuery(id), bookmark);
    }

    async find(query: BookmarkQuery): Promise<Bookmark[]> {
        return (await this.db.find({selector: query})).docs;
    }

    async findOne(query: BookmarkQuery): Promise<Bookmark | null> {
        const bookmarks: Bookmark[] = await this.find(query);
        const count: number = bookmarks.length;

        if (count < 1) {
            return null;
        } else if (count > 1) {
            throw new Error('Multi values');
        }

        return bookmarks[0];
    }

    async findById(id: string): Promise<Bookmark | null> {
        return this.findOne(new BookmarkQuery(id));
    }

    async delete(query: BookmarkQuery, bookmark: Bookmark): Promise<void> {
        await Promise.allSettled((await this.find(query))
            .map(async bookmark => await this.db.remove(await this.db.get(bookmark.id))));
    }

    async deleteById(id: string, bookmark: Bookmark): Promise<void> {
        await this.delete(new BookmarkQuery(id), bookmark);
    }

}
import {BookmarkQuery} from "./BookmarkQuery";
import {BookmarkValidatorUtils} from "./BookmarkValidatorUtils";
import {Bookmark} from "./Bookmark";
import bookmarkDataSource from "./BookmarkDataSource";

export class BookmarkDao {

    constructor(
    ) {
    }

    async save(bookmark: Bookmark): Promise<Bookmark> {
        BookmarkValidatorUtils.validateHasId(bookmark);

        const foundBookmark: Bookmark = await this.findById(bookmark.getId());

        if (foundBookmark) {
            throw new Error('Already exists');
        }

        await bookmarkDataSource.db.put<Bookmark>(bookmark);

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
        return (await bookmarkDataSource.db.find({selector: query})).docs;
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
        BookmarkValidatorUtils.validateBookmarkId(id);

        return this.findOne(new BookmarkQuery(id));
    }

    async delete(query: BookmarkQuery): Promise<void> {
        await Promise.allSettled((await this.find(query))
            .map(async bookmark => await bookmarkDataSource.db.remove(await bookmarkDataSource.db.get(bookmark.id))));
    }

    async deleteById(id: string): Promise<void> {
        BookmarkValidatorUtils.validateBookmarkId(id);

        await this.delete(new BookmarkQuery(id));
    }

}
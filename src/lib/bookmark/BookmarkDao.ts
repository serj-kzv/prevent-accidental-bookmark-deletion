import {BookmarkQuery} from "./BookmarkQuery";
import {Bookmark} from "./Bookmark";
import * as lf from 'lf';

export class BookmarkDao {

    findOne(query: BookmarkQuery): Bookmark {
        const count: number = this.count(query);

        if (count < 1) {
            return null;
        } else if (count > 1) {
            throw new Error('Multi values');
        }

        return this.find(query)[0];
    }

    find(query: BookmarkQuery): Bookmark[] {

    }

    findById(id: string): Bookmark {
        return this.findOne(new BookmarkQuery(id));
    }

    create(bookmark: Bookmark): Bookmark {
        const count: number = this.countById(bookmark.id);

        if (count > 1) {
            throw new Error('Already exists');
        }
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

    count(query: BookmarkQuery): number {

    }

    countById(id: string): number {
        return this.count(new BookmarkQuery(id));
    }

}
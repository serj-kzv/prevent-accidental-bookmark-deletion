import {Bookmark} from "../model/Bookmark";
import {BookmarkQuery} from "../model/BookmarkQuery";

export class BookmarkValidatorUtils {

    public static validateHasId(bookmark: Bookmark): void {
        if (bookmark.id) {
            return;
        }

        throw Error('bookmark should has an id');
    }

    public static validateHasNoId(bookmark: Bookmark): void {
        if (bookmark.id) {
            throw Error('bookmark should not has an id');
        }
    }

    public static validateBookmarkId(id: string): void {
        if (id && id.length > 0) {
            return
        }

        throw Error('bookmark id is wrong');
    }

    public static validateNotEmptyQuery(query: BookmarkQuery): void {
        if (query.id || query.url || query.index || query.type || query.title || query.parentId) {
           return;
        }

        throw Error('query is empty');
    }
}
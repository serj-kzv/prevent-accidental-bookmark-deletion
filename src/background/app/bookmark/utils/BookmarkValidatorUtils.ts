import {BookmarkQuery} from "../model/BookmarkQuery";

export abstract class BookmarkValidatorUtils {

    private constructor() {
    }

    public static validateNotEmptyQuery(query: BookmarkQuery): void {
        if (query.getId() || query.url || query.index || query.type || query.title || query.parentId) {
           return;
        }

        throw Error('query is empty');
    }
}
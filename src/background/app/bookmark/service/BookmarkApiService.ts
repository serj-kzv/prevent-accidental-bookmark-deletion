import {Bookmark} from "../model/Bookmark";
import {bookmarkStore} from "../../BookmarkApplicationContext";

export default class BookmarkApiService {

    public async getAll(): Promise<Bookmark[]> {
        return (await browser.bookmarks.search({})) as Bookmark[];
    }

    public async removeById(id: string) {
        this.allowRemove(id);
        await browser.bookmarks.removeTree(id);
        this.disallowRemove(id);
    }

    allowRemove(id: string): void {
        bookmarkStore.bookmarkRemoveAllowedIds.push(id);
    }

    disallowRemove(id: string): void {
        const ids = bookmarkStore.bookmarkRemoveAllowedIds;
        const index = ids.indexOf(id);

        if (index > -1) {
            ids.splice(index, 1);
        }
    }

    canRemove(id: string): boolean {
        return bookmarkStore.bookmarkRemoveAllowedIds.includes(id);
    }

}
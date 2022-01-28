import {Bookmark} from "../model/Bookmark";

class BookmarkApi {
    public async getAll(): Promise<Bookmark[]> {
        return (await browser.bookmarks.search({})) as Bookmark[];
    }
}

const bookmarkApi: BookmarkApi = new BookmarkApi();

export default bookmarkApi;
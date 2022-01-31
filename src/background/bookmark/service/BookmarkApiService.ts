import {Bookmark} from "../model/Bookmark";

export default class BookmarkApiService {
    public async getAll(): Promise<Bookmark[]> {
        return (await browser.bookmarks.search({})) as Bookmark[];
    }
}
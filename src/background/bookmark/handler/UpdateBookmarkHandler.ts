import {Handler} from "./Handler";
import {Bookmark} from "../model/Bookmark";
import bookmarkDao from "../repository/BookmarkDao";

export class UpdateBookmarkHandler implements Handler {

    constructor(private handle: any = null) {
        this.init();
    }

    init(): void {
        this.handle = async (id: string, bookmarkInfo: any) => {
            const bookmark: Bookmark = bookmarkInfo as Bookmark;

            await bookmarkDao.save(bookmark);
        }
    }

    start(): void {
        browser.bookmarks.onChanged.addListener(this.handle);
    }

    stop(): void {
        browser.bookmarks.onChanged.removeListener(this.handle);
    }

}
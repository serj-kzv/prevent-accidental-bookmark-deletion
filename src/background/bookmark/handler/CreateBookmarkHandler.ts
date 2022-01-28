import {Handler} from "./Handler";
import {Bookmark} from "../model/Bookmark";
import bookmarkDao from "../repository/BookmarkDao";

export class CreateBookmarkHandler implements Handler {

    constructor(private handle: any = null) {
        this.init();
    }

    public start(): void {
        browser.bookmarks.onCreated.addListener(this.handle);
    }

    public stop(): void {
        browser.bookmarks.onCreated.removeListener(this.handle);
    }

    public init(): void {
        this.handle = async (id: string, bookmarkInfo: any) => {
            const bookmark: Bookmark = bookmarkInfo as Bookmark;

            await bookmarkDao.save(bookmark);
        }
    }

}
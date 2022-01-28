import {Handler} from "./base/Handler";
import {Bookmark} from "../model/Bookmark";
import bookmarkDao from "../repository/BookmarkDao";

export class ChangeBookmarkHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const updateBookmarkHandler: ChangeBookmarkHandler = new ChangeBookmarkHandler();

        await updateBookmarkHandler.init();

        return updateBookmarkHandler;
    }

    public async init(): Promise<void> {
        this.handle = async (id: string, bookmarkInfo: any) => {
            const bookmark: Bookmark = bookmarkInfo as Bookmark;

            await bookmarkDao.save(bookmark);
        }
    }

    public start(): void {
        browser.bookmarks.onChanged.addListener(this.handle);
    }

    public stop(): void {
        browser.bookmarks.onChanged.removeListener(this.handle);
    }

}
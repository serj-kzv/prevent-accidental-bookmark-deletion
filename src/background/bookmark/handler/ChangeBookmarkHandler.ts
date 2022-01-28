import {Handler} from "./base/Handler";
import {Bookmark} from "../model/Bookmark";
import bookmarkDao from "../repository/BookmarkDao";
import BookmarkChangeInfo from "../model/BookmarkChangeInfo";

export class ChangeBookmarkHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const updateBookmarkHandler: ChangeBookmarkHandler = new ChangeBookmarkHandler();

        await updateBookmarkHandler.init();

        return updateBookmarkHandler;
    }

    public async init(): Promise<void> {
        this.handle = async (id: string, bookmarkInfo: BookmarkChangeInfo) => {
            const bookmark: Bookmark = await bookmarkDao.findById(id);

            bookmark.title = bookmarkInfo.title;
            bookmark.url = bookmarkInfo.url;

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
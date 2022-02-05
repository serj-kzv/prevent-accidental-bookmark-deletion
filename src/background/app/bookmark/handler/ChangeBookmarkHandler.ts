import {Handler} from "../../base/handler/Handler";
import {Bookmark} from "../model/Bookmark";
import BookmarkChangeInfo from "../model/BookmarkChangeInfo";
import {bookmarkDao} from "../../BookmarkApplicationContext";

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
            console.debug('ChangeBookmarkHandler handle', bookmarkInfo);

            const bookmark: Bookmark = await bookmarkDao.findById(id);
            const title: string = bookmarkInfo.title;
            const url: string = bookmarkInfo.url;

            if (title) {
                bookmark.title = title;
            }
            if (url) {
                bookmark.url = url;
            }

            await bookmarkDao.save(bookmark);
        }
    }

    public start(): void {
        console.debug('ChangeBookmarkHandler start');
        browser.bookmarks.onChanged.addListener(this.handle);
    }

    public stop(): void {
        browser.bookmarks.onChanged.removeListener(this.handle);
    }

}
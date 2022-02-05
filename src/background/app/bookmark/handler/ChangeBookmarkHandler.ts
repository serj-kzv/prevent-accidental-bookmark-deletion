import {Handler} from "../../base/handler/Handler";
import BookmarkChangeInfo from "../model/BookmarkChangeInfo";
import {bookmarkHandlerService} from "../../BookmarkApplicationContext";

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

            await bookmarkHandlerService.change(id, bookmarkInfo);
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
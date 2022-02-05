import {Handler} from "../../base/handler/Handler";
import BookmarkRemoveInfo from "../model/BookmarkRemoveInfo";
import {bookmarkHandlerService} from "../../BookmarkApplicationContext";

export class RemoveBookmarkHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const deleteBookmarkHandler: RemoveBookmarkHandler = new RemoveBookmarkHandler();

        await deleteBookmarkHandler.init();

        return deleteBookmarkHandler;
    }

    public async init(): Promise<void> {
        this.handle = async (id: string, bookmarkRemoveInfo: BookmarkRemoveInfo) => {
            console.debug('RemoveBookmarkHandler handle', bookmarkRemoveInfo);

            await bookmarkHandlerService.restoreOnRemove(id, bookmarkRemoveInfo);
        }
    }

    public start(): void {
        console.debug('RemoveBookmarkHandler start');
        browser.bookmarks.onRemoved.addListener(this.handle);
    }

    public stop(): void {
        browser.bookmarks.onRemoved.removeListener(this.handle);
    }

}
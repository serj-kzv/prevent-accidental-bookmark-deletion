import {Handler} from "./base/Handler";
import bookmarkDao from "../repository/BookmarkDao";
import BookmarkRemoveInfo from "../model/BookmarkRemoveInfo";

export class RemoveBookmarkHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const deleteBookmarkHandler: RemoveBookmarkHandler = new RemoveBookmarkHandler();

        await deleteBookmarkHandler.init();

        return deleteBookmarkHandler;
    }

    public async init(): Promise<void> {
        this.handle = async (id: string, removeInfo: BookmarkRemoveInfo) => {
            console.debug('RemoveBookmarkHandler handle', removeInfo);

            await bookmarkDao.findAllChildrenByParentId(id);
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
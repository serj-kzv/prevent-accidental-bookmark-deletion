import {Handler} from "./base/Handler";
import bookmarkDao from "../repository/BookmarkDao";

export class DeleteBookmarkHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const deleteBookmarkHandler: DeleteBookmarkHandler = new DeleteBookmarkHandler();

        await deleteBookmarkHandler.init();

        return deleteBookmarkHandler;
    }

    public async init(): Promise<void> {
        this.handle = async (id: string, removeInfo: any) => {

            await bookmarkDao.findAllChildrenByParentId(id);
        }
    }

    public start(): void {
        browser.bookmarks.onRemoved.addListener(this.handle);
    }

    public stop(): void {
        browser.bookmarks.onRemoved.removeListener(this.handle);
    }

}
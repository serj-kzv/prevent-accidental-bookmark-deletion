import {bookmarkApiService, bookmarkStore, bookmarkTxModificationService} from "../../BookmarkApplicationContext";

export default class BookmarkRestoreService {

    async restoreWithTx(id: string): Promise<void> {
        await bookmarkTxModificationService.start(id);
        await this.restore(id);
        await bookmarkTxModificationService.stop(id);
    }

    async restore(id: string): Promise<void> {

    }

    async rollbackAndRestore(id: string): Promise<void> {
        await bookmarkApiService.removeById(id);
        await this.restore(id);
        await bookmarkTxModificationService.stop(id);
    }

    // step 1.1
    async findAllChildBookmarkDirectories(id: string): Promise<void> {

    }

    // step 1.2
    async restoreAllChildBookmarkDirectories(id: string): Promise<void> {

    }

    // step 2
    async restoreAllBookmarks(ids: string[]): Promise<void> {

    }

}
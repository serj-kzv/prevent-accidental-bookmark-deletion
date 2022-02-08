import {bookmarkApiService, bookmarkTxModificationService} from "../../BookmarkApplicationContext";

export default class BookmarkRestoreService {

    async startTxAndRestore(id: string): Promise<void> {
        await bookmarkTxModificationService.start(id);
        await this.continueTxAndRestore(id);
    }

    async rollbackTxAndRestore(id: string): Promise<void> {
        await bookmarkApiService.removeById(id);
        await this.continueTxAndRestore(id);
    }

    async continueTxAndRestore(id: string): Promise<void> {
        try {
            await this.restore(id);
            await bookmarkTxModificationService.stop(id);
            this.restoreAllDelayedTx(); // TODO: was not it should be wrapped in try?
        } catch (e) {
            console.debug(`Tx for bookmark with id=${id} is failed and possibly will be delayed until parent bookmark tx will be done.`);

            await bookmarkTxModificationService.release(id);

            throw e;
        }
    }

    async restoreAllDelayedTx(): Promise<void> {
        Promise.allSettled(
            (await bookmarkTxModificationService.findAllTxsNotInProgress())
                .map(async tx => this.rollbackTxAndRestore(tx.getId()))
        );
    }

    async restore(id: string): Promise<void> {

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
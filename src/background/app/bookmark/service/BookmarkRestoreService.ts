import {bookmarkApiService, bookmarkTxModificationService} from "../../BookmarkApplicationContext";

export default class BookmarkRestoreService {

    async restoreWithTx(id: string): Promise<void> {
        await bookmarkTxModificationService.start(id);
        try {
            await this.restore(id);
            await bookmarkTxModificationService.stop(id);
            this.restoreAllDelayedTx();
        } catch (e) {
            console.debug(`Tx for bookmark with id=${id} is failed and possibly will be delayed until parent bookmark tx will be done.`);

            this.restoreAllDelayedTx();

            throw e;
        }
    }

    async restoreAllDelayedTx(): Promise<void> {
        (await bookmarkTxModificationService.findAllTxsNotInProgress())
            .forEach(tx => this.rollbackAndRestoreTx(tx.getId()));
    }

    async restore(id: string): Promise<void> {

    }

    async rollbackAndRestoreTx(id: string): Promise<void> {
        try {
            await bookmarkApiService.removeById(id);
            await this.restore(id);
            await bookmarkTxModificationService.stop(id);
            this.restoreAllDelayedTx();
        } catch (e) {
            console.debug(`Tx for bookmark with id=${id} is failed and possibly will be delayed until parent bookmark tx will be done.`);

            this.restoreAllDelayedTx();

            throw e;
        }
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
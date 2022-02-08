import {bookmarkRestoreService, bookmarkTxModificationService} from "../../BookmarkApplicationContext";

export default class BrowserHandlerService {

    async checkTxAndRunRestore(): Promise<void> {
        (await bookmarkTxModificationService.findAllTxsNotInProgress())
            .forEach(tx => bookmarkRestoreService.rollbackAndRestoreTx(tx.getId()));
    }

}
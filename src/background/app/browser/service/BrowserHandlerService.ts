import {bookmarkRestoreService, bookmarkTxModificationService} from "../../BookmarkApplicationContext";

export default class BrowserHandlerService {

    async checkTxAndRunRestore(): Promise<void> {
        (await bookmarkTxModificationService.findAllTxs())
            .forEach(tx => bookmarkRestoreService.rollbackAndRestore(tx.getId()));
    }

}
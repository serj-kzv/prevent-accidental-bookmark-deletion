import {bookmarkTxModificationDao} from "../../BookmarkApplicationContext";
import BookmarkTxModification from "../model/BookmarkTxModification";
import {BookmarkTxModificationType} from "../model/BookmarkTxModificationType";
import Utils from "../../utils/Utils";

export default class BookmarkTxModificationService {

    private readonly txInProgress: string[] = [];

    async start(id: string): Promise<void> {
        this.txInProgress.push(id);
        await bookmarkTxModificationDao.save(new BookmarkTxModification(id, BookmarkTxModificationType.REMOVE));
    }

    async stop(id: string): Promise<void> {
        await bookmarkTxModificationDao.deleteById(id);
        Utils.removeFromArray(this.txInProgress, id);
    }

    async findAllTxs(): Promise<BookmarkTxModification[]> {
        return await bookmarkTxModificationDao.findAll();
    }

    async findAllTxsNotInProgress(): Promise<BookmarkTxModification[]> {
        return (await this.findAllTxs()).filter(tx => !this.isTxInProgress(tx.getId()));
    }

    isTxInProgress(id: string): boolean {
        return this.txInProgress.includes(id);
    }

}
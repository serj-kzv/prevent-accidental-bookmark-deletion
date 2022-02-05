import {bookmarkTxModificationDao} from "../../BookmarkApplicationContext";
import BookmarkTxModification from "../model/BookmarkTxModification";
import {BookmarkTxModificationType} from "../model/BookmarkTxModificationType";

export default class BookmarkTxModificationService {

    async start(id: string): Promise<void> {
        await bookmarkTxModificationDao.save(new BookmarkTxModification(id, BookmarkTxModificationType.REMOVE));
    }

    async stop(id: string): Promise<void> {
        await bookmarkTxModificationDao.deleteById(id);
    }

    async findAllTxs(): Promise<BookmarkTxModification[]> {
        return await bookmarkTxModificationDao.findAll();
    }

}
import {bookmarkApiService, bookmarkDao, bookmarkRestoreService} from "../../BookmarkApplicationContext";
import {Bookmark} from "../model/Bookmark";
import BookmarkMoveInfo from "../model/BookmarkMoveInfo";
import BookmarkRemoveInfo from "../model/BookmarkRemoveInfo";
import BookmarkChangeInfo from "../model/BookmarkChangeInfo";

export default class BookmarkHandlerService {

    async create(id: string, bookmark: Bookmark): Promise<void> {
        await bookmarkDao.save(bookmark);
    }

    async change(id: string, bookmarkInfo: BookmarkChangeInfo): Promise<void> {
        const bookmark: Bookmark = await bookmarkDao.findById(id);
        const title: string = bookmarkInfo.title;
        const url: string = bookmarkInfo.url;

        if (title) {
            bookmark.title = title;
        }
        if (url) {
            bookmark.url = url;
        }

        await bookmarkDao.save(bookmark);
    }

    async move(id: string, bookmarkInfo: BookmarkMoveInfo): Promise<void> {
        const bookmark: Bookmark = await bookmarkDao.findById(id);

        bookmark.parentId = bookmarkInfo.parentId;
        bookmark.index = bookmarkInfo.index;

        await bookmarkDao.save(bookmark);
    }

    async restoreOnRemove(id: string, removeInfo: BookmarkRemoveInfo): Promise<void> {
        if (!bookmarkApiService.canRemove(id)) {
            await bookmarkRestoreService.startTxAndRestore(id);
        }
    }

}
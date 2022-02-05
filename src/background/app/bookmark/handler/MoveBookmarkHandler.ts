import {Handler} from "../../base/handler/Handler";
import {Bookmark} from "../model/Bookmark";
import BookmarkMoveInfo from "../model/BookmarkMoveInfo";
import {bookmarkDao} from "../../BookmarkApplicationContext";

export class MoveBookmarkHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const moveBookmarkHandler: MoveBookmarkHandler = new MoveBookmarkHandler();

        await moveBookmarkHandler.init();

        return moveBookmarkHandler;
    }

    public async init(): Promise<void> {
        this.handle = async (id: string, bookmarkInfo: BookmarkMoveInfo) => {
            console.debug('MoveBookmarkHandler handle', bookmarkInfo);

            const bookmark: Bookmark = await bookmarkDao.findById(id);

            bookmark.parentId = bookmarkInfo.parentId;
            bookmark.index = bookmarkInfo.index;

            await bookmarkDao.save(bookmark);
        }
    }

    public start(): void {
        console.debug('MoveBookmarkHandler start');
        browser.bookmarks.onMoved.addListener(this.handle);
    }

    public stop(): void {
        browser.bookmarks.onMoved.removeListener(this.handle);
    }

}
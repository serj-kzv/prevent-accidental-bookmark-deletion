import {Handler} from "./base/Handler";
import {Bookmark} from "../model/Bookmark";
import bookmarkDao from "../repository/BookmarkDao";
import BookmarkMoveInfo from "../model/BookmarkMoveInfo";

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
            const bookmark: Bookmark = await bookmarkDao.findById(id);

            bookmark.parentId = bookmarkInfo.parentId;
            bookmark.index = bookmarkInfo.index;

            await bookmarkDao.save(bookmark);
        }
    }

    public start(): void {
        browser.bookmarks.onChanged.addListener(this.handle);
    }

    public stop(): void {
        browser.bookmarks.onChanged.removeListener(this.handle);
    }

}
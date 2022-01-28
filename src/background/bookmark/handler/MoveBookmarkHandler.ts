import {Handler} from "./base/Handler";
import {Bookmark} from "../model/Bookmark";
import bookmarkDao from "../repository/BookmarkDao";

export class MoveBookmarkHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const moveBookmarkHandler: MoveBookmarkHandler = new MoveBookmarkHandler();

        await moveBookmarkHandler.init();

        return moveBookmarkHandler;
    }

    public async init(): Promise<void> {
        this.handle = async (id: string, bookmarkInfo: any) => {
            const bookmark: Bookmark = bookmarkInfo as Bookmark;

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
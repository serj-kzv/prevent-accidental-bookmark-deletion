import {Handler} from "./base/Handler";
import {Bookmark} from "../model/Bookmark";
import bookmarkDao from "../repository/BookmarkDao";

export class CreateBookmarkHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const createBookmarkHandler: CreateBookmarkHandler = new CreateBookmarkHandler();

        await createBookmarkHandler.init();

        return createBookmarkHandler;
    }

    public async init(): Promise<void> {
        this.handle = async (id: string, bookmarkInfo: any) => {
            const bookmark: Bookmark = bookmarkInfo as Bookmark;

            await bookmarkDao.save(bookmark);
        }
    }

    public start(): void {
        browser.bookmarks.onCreated.addListener(this.handle);
    }

    public stop(): void {
        browser.bookmarks.onCreated.removeListener(this.handle);
    }

}
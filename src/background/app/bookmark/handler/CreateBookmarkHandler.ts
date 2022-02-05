import {Handler} from "../../base/handler/Handler";
import {Bookmark} from "../model/Bookmark";
import {bookmarkDao} from "../../BookmarkApplicationContext";

export class CreateBookmarkHandler implements Handler {

    private constructor(private handle: any = null) {
    }

    public static async build() {
        const createBookmarkHandler: CreateBookmarkHandler = new CreateBookmarkHandler();

        await createBookmarkHandler.init();

        return createBookmarkHandler;
    }

    public async init(): Promise<void> {
        this.handle = async (id: string, bookmark: Bookmark) => {
            console.debug('CreateBookmarkHandler handle', bookmark);

            await bookmarkDao.save(bookmark);
        }
    }

    public start(): void {
        console.debug('CreateBookmarkHandler start');
        browser.bookmarks.onCreated.addListener(this.handle);
    }

    public stop(): void {
        browser.bookmarks.onCreated.removeListener(this.handle);
    }

}
import {Handler} from "../../base/handler/Handler";
import BookmarkMoveInfo from "../model/BookmarkMoveInfo";
import {bookmarkHandlerService} from "../../BookmarkApplicationContext";

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

            await bookmarkHandlerService.move(id, bookmarkInfo);
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
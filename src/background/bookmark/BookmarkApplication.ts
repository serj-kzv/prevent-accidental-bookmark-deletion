import bookmarkDao from "./repository/BookmarkDao";
import {CreateBookmarkHandler} from "./handler/CreateBookmarkHandler";
import {DeleteBookmarkHandler} from "./handler/DeleteBookmarkHandler";
import {ChangeBookmarkHandler} from "./handler/ChangeBookmarkHandler";
import bookmarkApi from "./service/BookmarkApi";
import {MoveBookmarkHandler} from "./handler/MoveBookmarkHandler";

export class BookmarkApplication {

    public async run(): Promise<void> {
        await this.init();
    }

    private async init(): Promise<void> {
        await bookmarkDao.saveAll(await bookmarkApi.getAll());
        (await CreateBookmarkHandler.build()).start();
        (await ChangeBookmarkHandler.build()).start();
        (await MoveBookmarkHandler.build()).start();
        (await DeleteBookmarkHandler.build()).start();
    }

}
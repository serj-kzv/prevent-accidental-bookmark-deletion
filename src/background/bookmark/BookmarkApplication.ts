import bookmarkDao from "./repository/BookmarkDao";
import {CreateBookmarkHandler} from "./handler/CreateBookmarkHandler";
import {DeleteBookmarkHandler} from "./handler/DeleteBookmarkHandler";
import {UpdateBookmarkHandler} from "./handler/UpdateBookmarkHandler";
import bookmarkApi from "./service/BookmarkApi";

export class BookmarkApplication {

    public async run(): Promise<void> {
        await this.init();
    }

    private async init(): Promise<void> {
        await bookmarkDao.saveAll(await bookmarkApi.getAll());
        (await CreateBookmarkHandler.build()).start();
        (await UpdateBookmarkHandler.build()).start();
        (await DeleteBookmarkHandler.build()).start();
    }

}
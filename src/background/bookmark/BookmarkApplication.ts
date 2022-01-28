import bookmarkDao from "./repository/BookmarkDao";
import {CreateBookmarkHandler} from "./handler/CreateBookmarkHandler";
import {RemoveBookmarkHandler} from "./handler/RemoveBookmarkHandler";
import {ChangeBookmarkHandler} from "./handler/ChangeBookmarkHandler";
import bookmarkApi from "./service/BookmarkApi";
import {MoveBookmarkHandler} from "./handler/MoveBookmarkHandler";

export class BookmarkApplication {

    public async run(): Promise<void> {
        console.debug('BookmarkApplication run');
        await this.init();
        console.debug('BookmarkApplication run inited');
    }

    private async init(): Promise<void> {
        console.debug('BookmarkApplication init');
        await bookmarkDao.saveAll(await bookmarkApi.getAll());
        (await CreateBookmarkHandler.build()).start();
        (await ChangeBookmarkHandler.build()).start();
        (await MoveBookmarkHandler.build()).start();
        (await RemoveBookmarkHandler.build()).start();
    }

}
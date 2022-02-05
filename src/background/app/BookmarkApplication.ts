import {CreateBookmarkHandler} from "./bookmark/handler/CreateBookmarkHandler";
import {RemoveBookmarkHandler} from "./bookmark/handler/RemoveBookmarkHandler";
import {ChangeBookmarkHandler} from "./bookmark/handler/ChangeBookmarkHandler";
import {MoveBookmarkHandler} from "./bookmark/handler/MoveBookmarkHandler";
import {bookmarkApi, bookmarkDao} from "./BookmarkApplicationContext";

export class BookmarkApplication {

    public async run(): Promise<void> {
        console.debug('BookmarkApplication run');
        console.debug('BookmarkApplication allDocs before', await bookmarkDao.findAll());
        console.debug('BookmarkApplication run deleteAll for development purposes', await bookmarkDao.deleteAll());
        console.debug('BookmarkApplication allDocs after', await bookmarkDao.findAll());
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
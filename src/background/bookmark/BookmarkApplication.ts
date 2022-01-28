import bookmarkDao from "./repository/BookmarkDao";
import {CreateBookmarkHandler} from "./handler/CreateBookmarkHandler";
import {RemoveBookmarkHandler} from "./handler/RemoveBookmarkHandler";
import {ChangeBookmarkHandler} from "./handler/ChangeBookmarkHandler";
import bookmarkApi from "./service/BookmarkApi";
import {MoveBookmarkHandler} from "./handler/MoveBookmarkHandler";
import bookmarkDataSource from "./repository/BookmarkDataSource";

export class BookmarkApplication {

    public async run(): Promise<void> {
        console.debug('BookmarkApplication run');
        console.debug('BookmarkApplication run deleteAll for development purposes', await bookmarkDao.deleteAll());
        console.debug('BookmarkApplication allDocs', await bookmarkDataSource.db.allDocs({
            include_docs: true,
            attachments: true
        }));
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
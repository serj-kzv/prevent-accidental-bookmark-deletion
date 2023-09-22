import BookmarkCreator from "./BookmarkCreator.js";
import BookmarkStorage from "./bookmarkstorage/BookmarkStorage.js";
import ChangeBookmarkProcessor from './processor/ChangeBookmarkProcessor.js';
import CreateBookmarkProcessor from './processor/CreateBookmarkProcessor.js';
import MoveBookmarkProcessor from './processor/MoveBookmarkProcessor.js';
import RemoveBookmarkProcessor from './processor/RemoveBookmarkProcessor.js';
import BookmarkTypeEnum from './utils/BookmarkTypeEnum.js';
import BookmarkValidator from './utils/BookmarkValidator.js';

export default class PreventBookmarkRemoval {
    #storage;
    #bookmarkCreator = new BookmarkCreator();
    #processors = [];

    static async build() {
        const command = new PreventBookmarkRemoval();

        await command.#init();

        return command;
    }

    async #init() {
        console.debug('start PreventBookmarkRemoval initialization starts');

        console.debug('start PreventBookmarkRemoval validation starts');
        if (await BookmarkValidator.validate()) {
            console.debug('Web Extension Bookmark API data is valid.');
        } else {
            console.error('Web Extension Bookmark API data is NOT valid.');
        }
        console.debug('start PreventBookmarkRemoval validation ended');

        const bookmarks = await browser.bookmarks.search({});
        console.debug('Non root bookmarks', bookmarks);

        console.debug('start PreventBookmarkRemoval storage initialization starts');
        this.#storage = await BookmarkStorage.build(bookmarks);
        console.debug('start PreventBookmarkRemoval storage initialized');

        this.#processors = [...await Promise.all([
            CreateBookmarkProcessor.build(),
            ChangeBookmarkProcessor.build(),
            MoveBookmarkProcessor.build(),
            RemoveBookmarkProcessor.build(),
        ])];

        console.debug('start PreventBookmarkRemoval initialized');
    }

    async #recreateBookmarks(id, index, node) {
        const {parentId} = node;

        console.debug('Recreation is started.', {id, parentId, node});

        if (BookmarkTypeEnum.isFolder(node.type)) {
            console.debug('Recreation is started. Bookmark type is folder starts');

            const folders = this.#storage.getFoldersWithChildrenRecursiveById(id);
            const foldersIds = folders.flat(Infinity)
                .map(id => id);
            const bookmarks = this.#storage.getBookmarksByFolderIds(foldersIds);



            console.debug('Start bookmark recreation');


            console.debug('End bookmark storage clearing', this.#storage);

            console.debug('Recreation is started. Bookmark type is folder ended');
        } else {
            const bookmark = await this.#storage.get(id);

            await this.#bookmarkCreator.create(index, bookmark);
            await this.#storage.delete(id);
        }
    }

    async #makeRecreateOperations(bookmarkArrays) {
        if (bookmarkArrays.length < 1) {
            return [];
        }

        const createdBookmarkArray = bookmarkArrays[0]
            .map(async bookmark => await this.#bookmarkCreator.create(bookmark.index, bookmark));
        const recreatedBookmark = await Promise.all(createdBookmarkArray);

        console.debug('recreatedBookmark', recreatedBookmark);

        let currentNewIds = recreatedBookmark
            .map(({bookmark, oldId}) => [oldId, bookmark.id]);
        console.debug('first new id - old id Map', currentNewIds);
        currentNewIds = new Map(currentNewIds);

        console.debug('first new id - old id Map', currentNewIds);

        const recreatedBookmarks = [];

        for (const bookmarkArray of bookmarkArrays.slice(1, bookmarkArrays.length)) {
            const createdBookmarkArray = bookmarkArray.map(async bookmark => {
                    bookmark.parentId = currentNewIds.get(bookmark.parentId);
                    return await this.#bookmarkCreator.create(bookmark.index, bookmark);
                });
            const createdBookmarks = await Promise.all(createdBookmarkArray);

            console.debug('recreatedBookmarks', createdBookmarks);

            currentNewIds = createdBookmarks
                .map(({bookmark, oldId}) => [oldId, bookmark.id]);
            console.debug('first new id - old id Map', currentNewIds);
            currentNewIds = new Map(currentNewIds);

            console.debug('first new id - old id Map', currentNewIds);

            if (bookmarkArrays.length > 0) {
                recreatedBookmarks.push(createdBookmarks);
            }
        }

        return [recreatedBookmark, ...recreatedBookmarks]
            .map(bookmark => ({currentNewIds, bookmark}));
    }

    destroy() {
        this.#processors.forEach(processor => processor.destroy());
        this.#storage = undefined;
    }
}
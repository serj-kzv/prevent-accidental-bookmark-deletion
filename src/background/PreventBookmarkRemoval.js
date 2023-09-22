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

        this.#processors.push(await CreateBookmarkProcessor.build());
        this.#processors.push(await ChangeBookmarkProcessor.build());
        this.#processors.push(await MoveBookmarkProcessor.build());
        this.#processors.push(await RemoveBookmarkProcessor.build());

        console.debug('start PreventBookmarkRemoval initialized');
    }

    async #recreateBookmarks(id, index, node) {
        const {parentId} = node;

        console.debug('Recreation is started.', {id, parentId, node});

        if (BookmarkTypeEnum.isFolder(node.type)) {
            console.debug('Recreation is started. Bookmark type is folder starts');

            const bookmarks = this.#storage.getChildrenRecursiveById(id);

            console.debug('Recursive gotten bookmarks to recreate', bookmarks);

            const foldersAndBookmark = this.#groupByBookmarks(bookmarks);

            console.debug('Bookmark folders and bookmarks to recreate', foldersAndBookmark);

            console.debug('Start bookmark folder recreation');

            const recreatedFolders = await this.#makeRecreateOperations(foldersAndBookmark.foldersOnly);

            console.debug('End bookmark folder recreation', recreatedFolders);

            console.debug('Start bookmark recreation');

            const {currentNewIds} = recreatedFolders;

            foldersAndBookmark.bookmarksOnly.flat(2)
                .forEach(bookmark => bookmark.parentId = currentNewIds.get(bookmark.parentId));
            foldersAndBookmark.bookmarksOnly.flat(2)
                .map(bookmark => bookmark.id)
                .map(bookmark => this.#recreateBookmark())

            console.debug('End bookmark recreation', recreatedBookmarks);

            console.debug('Start bookmark folder storage clearing', this.#storage);

            const bookmarkFolderIdsToClear = recreatedFolders
                .flat()
                .map(({bookmark, oldId}) => oldId);

            console.debug('Bookmark folders to be cleared', bookmarkFolderIdsToClear)

            await Promise.all(bookmarkFolderIdsToClear.map(async id => await this.#storage.delete(id)));

            console.debug('End bookmark folder storage clearing', this.#storage);

            console.debug('Start bookmark storage clearing', this.#storage);

            const bookmarkIdsToClear = recreatedBookmarks
                .flat()
                .map(({bookmark, oldId}) => oldId);

            console.debug('Bookmarks to be cleared', bookmarkIdsToClear)

            await Promise.all(bookmarkIdsToClear.map(async id => await this.#storage.delete(id)));

            console.debug('End bookmark storage clearing', this.#storage);

            console.debug('Recreation is started. Bookmark type is folder ended');
        } else {
            await this.#recreateBookmark(id, index);
        }
    }

    async #recreateBookmark(id, index) {
        console.debug('Recreation is started. Bookmark type is not folder starts');

        const bookmark = await this.#storage.get(id);

        console.debug('bookmark will be recreated', bookmark);

        await this.#bookmarkCreator.create(index, bookmark);
        await this.#storage.delete(id);

        console.debug('Recreation is started. Bookmark type is not folder ended');
    }

    #groupByBookmarks(bookmarkArrays) {
        const foldersOnly = [];
        const bookmarksOnly = [];

        bookmarkArrays.forEach(bookmarkArray => {
            const foundFoldersOnly = [];
            const foundBookmarksOnly = [];

            bookmarkArray.forEach(bookmark => {
                if (BookmarkTypeEnum.isFolder(bookmark.type)) {
                    foundFoldersOnly.push(bookmark);
                } else {
                    foundBookmarksOnly.push(bookmark);
                }
            });

            if (foundFoldersOnly.length > 0) {
                foldersOnly.push(foundFoldersOnly);
            }
            if (foundBookmarksOnly.length > 0) {
                bookmarksOnly.push(foundBookmarksOnly);
            }
        });

        return {foldersOnly, bookmarksOnly};
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
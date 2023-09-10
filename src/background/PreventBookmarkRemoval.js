import BookmarkCreator from "./BookmarkCreator.js";
import BookmarkStorage from "./bookmarkstorage/BookmarkStorage.js";
import BookmarkTypeEnum from './utils/BookmarkTypeEnum.js';
import BookmarkValidator from './utils/BookmarkValidator.js';

export default class PreventBookmarkRemoval {
    #storage;
    #bookmarkCreator = new BookmarkCreator();
    #onRemovedListener;
    #onCreatedListener;
    #onChangedListener;

    static async build() {
        const command = new PreventBookmarkRemoval();

        await command.#init();

        return command;
    }

    async #init() {
        console.debug('start PreventBookmarkRemoval initialization starts');

        console.debug('start PreventBookmarkRemoval validation starts');
        await BookmarkValidator.validate();
        console.debug('start PreventBookmarkRemoval validation ended');

        const bookmarks = await browser.bookmarks.search({});
        console.debug('Non root bookmarks', bookmarks);

        console.debug('start PreventBookmarkRemoval storage initialization starts');
        this.#storage = await BookmarkStorage.build(bookmarks);
        console.debug('start PreventBookmarkRemoval storage initialized');

        console.debug('start PreventBookmarkRemoval listeners initialization starts');
        await this.#initOnCreatedListener();
        await this.#initOnChangedListener();
        await this.#initOnRemovedListener();
        console.debug('start PreventBookmarkRemoval listeners initialized');

        console.debug('start PreventBookmarkRemoval initialized');
    }

    async #initOnCreatedListener() {
        this.#onCreatedListener = async (id, bookmark) => {
            const {parentId} = bookmark;

            console.debug('Will be added to storage', bookmark);
            console.debug('Will be added to storage, parentId', parentId);
            console.debug('Will be added to storage, id', id);

            this.#storage.save(bookmark);
        };
        browser.bookmarks.onCreated.addListener(this.#onCreatedListener);
    }

    async #initOnChangedListener() {
        this.#onChangedListener = async (id, bookmark) => {
            const {parentId} = bookmark;

            console.debug('Will be changed in storage', bookmark);
            console.debug('Will be changed in storage, parentId', parentId);
            console.debug('Will be changed in storage, id', id);

            this.#storage.save(bookmark);
        };
        browser.bookmarks.onChanged.addListener(this.#onChangedListener);
    }

    async #initOnRemovedListener() {
        const that = this;

        this.#onRemovedListener = async (id, {index, node}) => {
            await that.#recreateBookmark(id, index, node);
        };
        browser.bookmarks.onRemoved.addListener(this.#onRemovedListener);
    }

    async #recreateBookmark(id, index, node) {
        const {parentId} = node;

        console.debug('Recreation is started.');
        console.debug('id', id);
        console.debug('parentId', parentId);
        console.debug('node', node);

        if (BookmarkTypeEnum.isFolder(node.type)) {
            console.debug('Recreation is started. Bookmark type is folder starts');

            const bookmarks = this.#storage.getChildrenRecursiveById(id);

            console.debug('Recursive gotten bookmarks to recreate', bookmarks);

            const foldersAndBookmark = this.#groupByBookmarks(bookmarks);

            console.debug('Bookmark folders and bookmarks to recreate', foldersAndBookmark);

            console.debug('Start bookmark folder recreation');

            const recreatedFolders = await Promise
                .all(this.#makeRecreateOperations(foldersAndBookmark.foldersOnly));

            console.debug('End bookmark folder recreation', recreatedFolders);

            console.debug('Start bookmark recreation');

            const recreatedBookmarks = await Promise
                .all(this.#makeRecreateOperations(foldersAndBookmark.bookmarksOnly));

            console.debug('End bookmark recreation', recreatedBookmarks);

            console.debug('Recreation is started. Bookmark type is folder ended');
        } else {
            console.debug('Recreation is started. Bookmark type is not folder starts');

            const bookmark = await this.#storage.get(id);

            console.debug('bookmark will be recreated', bookmark);

            await this.#bookmarkCreator.create(index, bookmark);

            console.debug('Recreation is started. Bookmark type is not folder ended');
        }

        await this.#storage.delete(id);
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

    #makeRecreateOperations(bookmarkArrays) {
        const createdBookmarkArray = bookmarkArrays[0]
            .map(async bookmark => await this.#bookmarkCreator.create(bookmark.index, bookmark));

        let currentNewIds = createdBookmarkArray
            .map((bookmark, oldId) => [oldId, bookmark.id]);
        console.debug('first new id - old id Map', currentNewIds);
        currentNewIds = new Map(currentNewIds);

        console.debug('first new id - old id Map', currentNewIds);

        const createdBookmarkArrays = [];

        for (const bookmarkArray of bookmarkArrays.slice(1, bookmarkArrays.length)) {
            const currentCreatedBookmarkArray = bookmarkArray
                .map(async bookmark => {
                    bookmark.parentId = currentNewIds.get(bookmark.parentId);
                    return await this.#bookmarkCreator.create(bookmark.index, bookmark);
                });

            currentNewIds = currentCreatedBookmarkArray
                .map((bookmark, oldId) => [oldId, bookmark.id]);
            console.debug('first new id - old id Map', currentNewIds);
            currentNewIds = new Map(currentNewIds);

            console.debug('first new id - old id Map', currentNewIds);

            createdBookmarkArrays.push(currentCreatedBookmarkArray);
        }

        return [createdBookmarkArray, ...createdBookmarkArrays]
            .map(createdBookmarkArray => Promise.all(createdBookmarkArray));
    }

    async destroy() {
        if (this.#onRemovedListener) {
            browser.bookmarks.onCreated.removeListener(this.#onCreatedListener);
            browser.bookmarks.onChanged.removeListener(this.#onChangedListener);
            browser.bookmarks.onRemoved.removeListener(this.#onRemovedListener);
        }
        this.#onCreatedListener = undefined;
        this.#onChangedListener = undefined;
        this.#onRemovedListener = undefined;
        this.#storage = undefined;
    }
}
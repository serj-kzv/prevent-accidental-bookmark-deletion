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

            const bookmarks = await this.#storage.getChildrenRecursiveById(id);

            const bookmarkFoldersOnly = bookmarks
                .forEach(bookmarks => bookmarks.filter(({type}) => BookmarkTypeEnum.isFolder(type)));

            console.debug('Recreation is started. Bookmark type is folder starts. Bookmarks folder to recreate', bookmarkFoldersOnly);

            await Promise.allSettled(this.#bookmarksToRecreateBookmarks(bookmarkFoldersOnly));

            const bookmarksOnly = bookmarks
                .forEach(bookmarks => bookmarks.filter(({type}) => !BookmarkTypeEnum.isFolder(type)));

            console.debug('Recreation is started. Bookmark type is folder starts. Bookmarks to recreate', bookmarksOnly);

            await Promise.allSettled(this.#bookmarksToRecreateBookmarks(bookmarksOnly));

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

    #bookmarksToRecreateBookmarks(bookmars) {
        return bookmars
            .map(bookmars => bookmars.map(async bookmark => await this.#bookmarkCreator.create(bookmark.index, bookmark)))
            .map(async bookmarks => await Promise.allSettled(bookmarks));
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
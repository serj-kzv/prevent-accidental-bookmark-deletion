import BookmarkCreator from "./BookmarkCreator.js";
import BookmarkStorageUtils from "./bookmarkstorage/BookmarkStorageUtils.js";

class PreventBookmarkRemoval {
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
        console.debug('start PreventBookmarkRemoval init');
        await this.#initOnCreatedListener();
        await this.#initOnChangedListener();
        await this.#initOnRemovedListener();
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

            console.debug('Will be added to storage', bookmark);
            console.debug('Will be added to storage, parentId', parentId);
            console.debug('Will be added to storage, id', id);

            this.#storage.save(bookmark);
        };
        browser.bookmarks.onChanged.addListener(this.#onChangedListener);
    }

    async #initOnRemovedListener() {
        this.#onRemovedListener = async (id, {index, node}) => {
            const {parentId} = node;

            console.debug('Recreation is started.');
            console.debug('id', id);
            console.debug('parentId', parentId);
            console.debug('node', node);

            const bookmark = await this.#storage.get(id);

            console.debug('index', index);
            console.debug('bookmark', bookmark);

            await this.#storage.delete(id);
            this.#bookmarkCreator.create(index, bookmark);
        };
        browser.bookmarks.onRemoved.addListener(this.#onRemovedListener);
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

export default PreventBookmarkRemoval;
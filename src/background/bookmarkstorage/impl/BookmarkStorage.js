import AbstractBookmarkStorage from "../AbstractBookmarkStorage.js";
import BookmarkStorageMode from "../BookmarkStorageMode.js";
import MemoryBookmarkStorage from "./MemoryBookmarkStorage.js";
import BookmarkStorageUtils from "../BookmarkStorageUtils.js";

class BookmarkStorage extends AbstractBookmarkStorage {
    #mode;
    #storage;
    #onCreatedListener;
    #onChangedListener;

    static async build() {
        const bookmarkStorage = new BookmarkStorage();

        await bookmarkStorage.#init();

        return bookmarkStorage;
    }

    async #init() {
        await this.activateMemoryStorageMode();
        this.#onCreatedListener = async (id, bookmark) => {
            const {parentId} = bookmark;
            const key = BookmarkStorageUtils.makeStorageKey(id, parentId);

            console.debug('Will be added to storage', bookmark);
            console.debug('Will be added to storage, parentId', parentId);
            console.debug('Will be added to storage, key', key);

            await this.save(key, bookmark);
        };
        this.#onChangedListener = async (id, bookmark) => {
            const {parentId} = bookmark;
            const key = BookmarkStorageUtils.makeStorageKey(id, parentId);

            console.debug('Will be added to storage', bookmark);
            console.debug('Will be added to storage, parentId', parentId);
            console.debug('Will be added to storage, key', key);

            await this.save(key, bookmark);
        };
        browser.bookmarks.onCreated.addListener(this.#onCreatedListener);
        browser.bookmarks.onChanged.addListener(this.#onChangedListener);
    }

    async get(key) {
        return await this.#storage.get(key);
    }

    async save(key, bookmark) {
        return await this.#storage.save(key, bookmark);
    }

    async delete(key) {
        return await this.#storage.delete(key);
    }

    async activateMemoryStorageMode() {
        await this.destroy();
        this.#storage = await MemoryBookmarkStorage.build();
        this.#mode = BookmarkStorageMode.MEMORY_STORAGE;
    }

    async destroy() {
        if (this.#onCreatedListener) {
            browser.bookmarks.onCreated.removeListener(this.#onCreatedListener);
        }
        if (this.#onChangedListener) {
            browser.bookmarks.onChanged.removeListener(this.#onChangedListener);
        }
        this.#onCreatedListener = undefined;
        this.#onChangedListener = undefined;
        if (this.#storage) {
            await this.#storage.destroy();
        }
        this.#storage = undefined;
        this.#mode = undefined;
    }

}

export default BookmarkStorage;
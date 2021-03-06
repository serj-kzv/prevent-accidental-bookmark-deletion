import AbstractBookmarkStorage from "./AbstractBookmarkStorage.js";
import BookmarkStorageMode from "./BookmarkStorageMode.js";
import LocalBookmarkStorage from "./LocalBookmarkStorage.js";
import MemoryBookmarkStorage from "./MemoryBookmarkStorage.js";

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
            console.debug('Will be added to storage', bookmark);
            await this.save(id, bookmark);
        };
        this.#onChangedListener = async (id, bookmark) => {
            console.debug('Will be added to storage', bookmark);
            await this.save(id, bookmark);
        };
        browser.bookmarks.onCreated.addListener(this.#onCreatedListener);
        browser.bookmarks.onChanged.addListener(this.#onChangedListener);
    }

    async get(id) {
        return await this.#storage.get(id);
    }

    async save(id, bookmark) {
        return await this.#storage.save(id, bookmark);
    }

    async delete(id) {
        return await this.#storage.delete(id);
    }

    async activateLocalStorageMode() {
        await this.destroy();
        this.#storage = await LocalBookmarkStorage.build();
        this.#mode = BookmarkStorageMode.LOCAL_STORAGE;
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
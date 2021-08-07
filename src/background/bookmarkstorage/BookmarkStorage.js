import BookmarkStorageMode from "./BookmarkStorageMode.js";
import MemoryBookmarkStorage from "./MemoryBookmarkStorage.js";
import LocalBookmarkStorage from "./LocalBookmarkStorage.js";
import AbstractBookmarkStorage from "./AbstractBookmarkStorage.js";

class BookmarkStorage extends AbstractBookmarkStorage {
    #mode;
    #storage;
    #onCreatedFn = async (id, info) => {
        console.debug('Will be added to storage', info);
        await this.save(id, info.title);
    };
    #onChangedFn = async (id, info) => {
        console.debug('Will be added to storage', info);
        await this.save(id, info.title);
    };

    static async build() {
        const bookmarkStorage = new BookmarkStorage();

        await bookmarkStorage.#init();

        return bookmarkStorage;
    }

    async #init() {
        await this.activateMemoryStorageMode();
        browser.bookmarks.onCreated.addListener(this.#onCreatedFn);
        browser.bookmarks.onChanged.addListener(this.#onChangedFn);
    }

    async getById(id) {
        return await this.#storage.getById(id);
    }

    async save(id, title) {
        return await this.#storage.save(id, title);
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
        browser.bookmarks.onCreated.removeListener(this.#onCreatedFn);
        browser.bookmarks.onChanged.removeListener(this.#onChangedFn);
        if (this.#storage) {
            await this.#storage.destroy();
        }
        this.#mode = undefined;
    }

}

export default BookmarkStorage;
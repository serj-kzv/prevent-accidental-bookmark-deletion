import BookmarkStorageMode from "./BookmarkStorageMode";
import MemoryBookmarkStorage from "./MemoryBookmarkStorage";
import LocalBookmarkStorage from "./LocalBookmarkStorage";
import AbstractBookmarkStorage from "./AbstractBookmarkStorage";

class BookmarkStorage extends AbstractBookmarkStorage {
    #mode;
    #storage;

    static async build() {
        const bookmarkStorage = new BookmarkStorage();

        await bookmarkStorage.init();

        return bookmarkStorage;
    }

    async init() {
        await this.activateMemoryStorageMode();
    }

    async getById(id) {
        return await this.#storage.getById(id);
    }

    async save(id, title) {
        return this.#storage.save(id, title);
    }

    async activateLocalStorageMode() {
        await this.destroy();
        await this.#storage = await LocalBookmarkStorage.build();
        this.#mode = BookmarkStorageMode.LOCAL_STORAGE;
    }

    async activateMemoryStorageMode() {
        await this.destroy();
        await this.#storage = await MemoryBookmarkStorage.build();
        this.#mode = BookmarkStorageMode.MEMORY_STORAGE;
    }

    async destroy() {
        await this.#storage.destroy();
        this.#mode = undefined;
    }

}

export default BookmarkStorage;
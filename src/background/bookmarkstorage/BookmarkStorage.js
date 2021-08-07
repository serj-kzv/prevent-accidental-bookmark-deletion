import BookmarkStorageMode from "./BookmarkStorageMode";
import MemoryBookmarkStorage from "./MemoryBookmarkStorage";
import LocalBookmarkStorage from "./LocalBookmarkStorage";

class BookmarkStorage {
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

    getById(id) {
        this.#storage.getById(id);
    }

    async activateLocalStorageMode() {
        await this.destroy();
        await this.#storage = await LocalBookmarkStorage.build();
        this.#mode = BookmarkStorageMode.LOCAL_STORAGE;
    }

    async activateMemoryStorageMode() {
        await this.#storage.destroy();
        await this.#storage = await MemoryBookmarkStorage.build();
        this.#mode = BookmarkStorageMode.MEMORY_STORAGE;
    }

    async destroy() {
        await this.#storage.destroy();
        this.#mode = undefined;
    }

}

export default BookmarkStorage;
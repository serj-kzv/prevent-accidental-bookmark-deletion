import BookmarkStorageMode from "./BookmarkStorageMode";
import MemoryBookmarkStorage from "./MemoryBookmarkStorage";
import LocalBookmarkStorage from "./LocalBookmarkStorage";
import AbstractBookmarkStorage from "./AbstractBookmarkStorage";

class BookmarkStorage extends AbstractBookmarkStorage {
    #mode;
    #storage;
    #onCreatedFn = async ({id, info}) => {
        await this.save(id, info.title);
    };
    #onChangedFn = async ({id, info}) => {
        await this.save(id, info.title);
    };
    #onRemovedFn = async ({id, info}) => {
        await this.delete(id, info.title);
    };

    static async build() {
        const bookmarkStorage = new BookmarkStorage();

        await bookmarkStorage.init();

        return bookmarkStorage;
    }

    async init() {
        await this.activateMemoryStorageMode();
        browser.bookmarks.onCreated.addListener(this.#onCreatedFn);
        browser.bookmarks.onChanged.addListener(this.#onChangedFn);
        browser.bookmarks.onRemoved.addListener(this.#onRemovedFn);
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
        await this.#storage = await LocalBookmarkStorage.build();
        this.#mode = BookmarkStorageMode.LOCAL_STORAGE;
    }

    async activateMemoryStorageMode() {
        await this.destroy();
        await this.#storage = await MemoryBookmarkStorage.build();
        this.#mode = BookmarkStorageMode.MEMORY_STORAGE;
    }

    async destroy() {
        browser.bookmarks.onCreated.removeListener(this.#onCreatedFn);
        browser.bookmarks.onChanged.removeListener(this.#onChangedFn);
        browser.bookmarks.onRemoved.removeListener(this.#onRemovedFn);
        await this.#storage.destroy();
        this.#mode = undefined;
    }

}

export default BookmarkStorage;
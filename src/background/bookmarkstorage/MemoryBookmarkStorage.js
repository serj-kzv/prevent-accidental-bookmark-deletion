import BookmarkStorageUtils from "./BookmarkStorageUtils.js";

class MemoryBookmarkStorage {
    #storage;
    #parentStorage;

    static async build() {
        const storage = new MemoryBookmarkStorage();

        await storage.#init();

        return storage;
    }

    async #init() {
        this.#storage = new Map();
        this.#parentStorage = new Map();
        (await browser.bookmarks.search({})).forEach(bookmark => {
            const {id, parentId} = bookmark;

            this.#storage.set(id, bookmark);
        });
        console.debug('init storage state is', this.#storage);
    }

    get(id) {
        return this.#storage.get(id);
    }

    getChildren(id) {
        const bookmarks = this.#parentStorage.get(id);
        return bookmarks === undefined ? [] : bookmarks;
    }

    save(bookmark) {
        const {id, parentId} = bookmark;

        this.#storage.set(id, bookmark);
        this.#parentStorage.set(parentId, [...this.getChildren(parentId), bookmark]);
    }

    delete(id) {
        return this.#storage.delete(id);
    }

    destroy() {
        this.#storage = undefined;
    }

}

export default MemoryBookmarkStorage;
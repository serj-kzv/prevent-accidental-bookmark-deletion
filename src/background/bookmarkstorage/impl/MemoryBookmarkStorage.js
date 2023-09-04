import BookmarkStorageUtils from "../BookmarkStorageUtils.js";

class MemoryBookmarkStorage {
    #storage;

    static async build() {
        const storage = new MemoryBookmarkStorage();

        await storage.#init();

        return storage;
    }

    async #init() {
        this.#storage = new Map();
        (await browser.bookmarks.search({})).forEach(bookmark => {
            const {id, parentId} = bookmark;
            const key = BookmarkStorageUtils.makeStorageKey(id, parentId);

            this.#storage.set(key, bookmark);
        });
        console.debug('init storage state is', this.#storage);
    }

    async get(key) {
        return this.#storage.get(key);
    }

    async save(key, bookmark) {
        const {parentId} = bookmark;

        return this.#storage.set(key, bookmark);
    }

    async delete(key) {
        return this.#storage.delete(key);
    }

    async destroy() {
        this.#storage = undefined;
    }

}

export default MemoryBookmarkStorage;
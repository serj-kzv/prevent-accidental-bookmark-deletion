class MemoryBookmarkStorage {
    #memoryStorage;

    static async build() {
        const storage = new MemoryBookmarkStorage();

        await storage.#init();

        return storage;
    }

    async #init() {
        this.#memoryStorage = new Map();
        (await browser.bookmarks.search({}))
            .forEach(({id, title}) => this.#memoryStorage.set(id, title));
        console.debug('init storage state is', this.#memoryStorage);
    }

    async get(id) {
        return this.#memoryStorage.get(id);
    }

    async save(id, title) {
        return this.#memoryStorage.set(id, title);
    }

    async delete(id) {
        return this.#memoryStorage.delete(id);
    }

    async destroy() {
        this.#memoryStorage = undefined;
    }

}

export default MemoryBookmarkStorage;
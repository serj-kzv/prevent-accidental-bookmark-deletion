class MemoryBookmarkStorage {
    #storage;

    static async build() {
        const storage = new MemoryBookmarkStorage();

        await storage.#init();

        return storage;
    }

    async #init() {
        this.#storage = new Map();
        (await browser.bookmarks.search({}))
            .forEach(bookmark => {
                const {id} = bookmark;

                this.#storage.set(id, bookmark);
            });
        console.debug('init storage state is', this.#storage);
    }

    async get(id) {
        return this.#storage.get(id);
    }

    async save(id, bookmark) {
        return this.#storage.set(id, bookmark);
    }

    async delete(id) {
        return this.#storage.delete(id);
    }

    async destroy() {
        this.#storage = undefined;
    }

}

export default MemoryBookmarkStorage;
class LocalBookmarkStorage {

    static #name = 'bookmarkTitles';

    static async build() {
        const storage = new LocalBookmarkStorage();

        await storage.#init();

        return storage;
    }

    async #init() {
        await browser.storage.set({bookmarkTitles: {}});
    }

    getById(id) {
        return browser.storage.get(id);
    }

    async destroy() {
        await browser.storage.sync.remove(LocalBookmarkStorage.#name);
    }

}

export default LocalBookmarkStorage;
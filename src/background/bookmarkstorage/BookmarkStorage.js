class BookmarkStorage {
    #storage;

    static async build() {
        const storage = new BookmarkStorage();

        await storage.#init();

        return storage;
    }

    async #init() {
        this.#storage = new Map();
        (await browser.bookmarks.search({})).forEach(bookmark => {
            const {id} = bookmark;

            this.#storage.set(id, bookmark);
        });
        console.log('tree of bookmarks', await browser.bookmarks.getTree());
        console.log('root of bookmarks', await browser.bookmarks.get(['root________']));
        console.debug('init storage state is', this.#storage);
    }

    getAll() {
        return Array.from(this.#storage.values());
    }

    get(id) {
        return this.#storage.get(id);
    }

    getChildrenRecursiveById(id) {
        const bookmark = this.get(id);

        return this.getChildrenRecursiveByParentId([bookmark]);
    }

    getChildrenRecursiveByParentId(children, result = []) {
        const bookmarkChildrenIds = children.map(({id}) => id);
        const bookmarkChildren = this.getAll()
            .filter(({parentId}) => bookmarkChildrenIds.includes(parentId));

        result.push(bookmarkChildren);

        return result;
    }

    save(bookmark) {
        const {id, parentId} = bookmark;

        this.#storage.set(id, bookmark);
    }

    delete(id) {
        return this.#storage.delete(id);
    }

    destroy() {
        this.#storage = undefined;
    }

}

export default BookmarkStorage;
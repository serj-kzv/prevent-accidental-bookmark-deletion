class BookmarkStorage {
    #storage;

    static async build(bookmarks) {
        const storage = new BookmarkStorage();

        await storage.#init(bookmarks);

        return storage;
    }

    async #init(bookmarks) {
        this.#storage = new Map();
        bookmarks.forEach(bookmark => {
            const {id} = bookmark;

            this.#storage.set(id, bookmark);
        });

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
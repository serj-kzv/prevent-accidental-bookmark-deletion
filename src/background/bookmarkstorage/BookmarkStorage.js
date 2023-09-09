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
        console.debug('init storage state is', this.#storage);
    }

    getAll() {
        return Array.from(this.#storage.values());
    }

    get(id) {
        return this.#storage.get(id);
    }

    getChildren(parentId) {
        return this.getAll().find(({parentId: bookmarkParentId}) => parentId === bookmarkParentId);
    }

    getChildrenRecursiveById(id) {
        const bookmark = this.get(id);
        return this.getChildrenRecursiveByParentId(bookmark.parentId, [bookmark]);
    }

    getChildrenRecursiveByParentId(parentId, result = []) {
        const that = this;
        const bookmarks = this.getChildren(parentId);

        if (bookmarkChildren.length < 1) {
            result.push([bookmarks]);
            return result;
        }

        const bookmarkChildren = bookmarks
            .map(({parentId: bookmarkParentId}) => that.getChildrenRecursive(bookmarkParentId));

        if (bookmarkChildren.length > 0) {
            result.push([bookmarks, bookmarkChildren]);
            return result;
        }

        result.push([bookmarks]);

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
import BookmarkTypeEnum from '../utils/BookmarkTypeEnum.js';

export default class BookmarkStorage {
    #storage;

    static async build(bookmarks) {
        const storage = new BookmarkStorage();

        await storage.#init(bookmarks);

        return storage;
    }

    async #init(bookmarks) {
        this.#storage = new Map();
        bookmarks.forEach(bookmark => this.#storage.set(bookmark.id, bookmark));

        console.debug('init storage state is', this.#storage);
    }

    getAll() {
        return Array.from(this.#storage.values());
    }

    get(id) {
        return this.#storage.get(id);
    }

    getFoldersWithChildrenRecursiveById(id) {
        const bookmark = this.get(id);

        return this.#getFoldersWithChildrenRecursiveByParentId([bookmark], [[bookmark]]);
    }

    #getFoldersWithChildrenRecursiveByParentId(children, result = []) {
        const bookmarkChildrenIds = children
            .filter(({type}) => BookmarkTypeEnum.isFolder(type))
            .map(({id}) => id);

        if (bookmarkChildrenIds.length < 1) {
            return result;
        }

        const bookmarkChildren = this.getAll()
            .filter(({type}) => BookmarkTypeEnum.isFolder(type))
            .filter(({parentId}) => bookmarkChildrenIds.includes(parentId));

        result.push(bookmarkChildren);

        return this.#getFoldersWithChildrenRecursiveByParentId(bookmarkChildren, result);
    }

    getBookmarksByFolderIds(ids) {
        return this.getAll()
            .filter(({type}) => BookmarkTypeEnum.isNotFolder(type))
            .filter(({parentId}) => ids.includes(parentId));
    }

    save(bookmark) {
        this.#storage.set(bookmark.id, bookmark);
    }

    delete(id) {
        return this.#storage.delete(id);
    }

    destroy() {
        this.#storage = undefined;
    }

}
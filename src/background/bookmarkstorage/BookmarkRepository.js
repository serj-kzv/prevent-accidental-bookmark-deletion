import BookmarkTypeEnum from '../utils/BookmarkTypeEnum.js';

class BookmarkRepository {
    #dataSource;

    constructor() {
        this.#dataSource = new Map();
    }

    saveAll(bookmarks) {
        bookmarks.forEach(bookmark => this.#dataSource.set(bookmark.id, bookmark));

        console.debug('init storage state is', this.#dataSource);
    }

    getAll() {
        return Array.from(this.#dataSource.values());
    }

    get(id) {
        return this.#dataSource.get(id);
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

        if (bookmarkChildren.length < 1) {
            return result;
        }

        result.push(bookmarkChildren);

        return this.#getFoldersWithChildrenRecursiveByParentId(bookmarkChildren, result);
    }

    getBookmarksByFolderIds(ids) {
        return this.getAll()
            .filter(({type}) => BookmarkTypeEnum.isNotFolder(type))
            .filter(({parentId}) => ids.includes(parentId));
    }

    save(bookmark) {
        this.#dataSource.set(bookmark.id, bookmark);
    }

    delete(id) {
        return this.#dataSource.delete(id);
    }

    deleteAllByIds(ids) {
        return ids.map(id => this.delete(id));
    }

    destroy() {
        this.#dataSource = undefined;
    }

}

const bookmarkRepository = new BookmarkRepository();

export default bookmarkRepository;
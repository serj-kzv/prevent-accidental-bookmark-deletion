import BookmarkTypeEnum from '../utils/BookmarkTypeEnum.js';

class BookmarkRepository {
    #dataSource;

    constructor() {
        this.#dataSource = browser.storage.local;
    }

    async saveAll(bookmarks) {
        const operations = bookmarks.map(bookmark => this.save(bookmark));

        return await Promise.all(operations);
    }

    getAll() {
        return this.get();
    }

    async get(ids) {
        return Object.entries(await this.#dataSource.get(ids)).map(([key, value]) => value);
    }

    async getFoldersWithChildrenRecursiveById(id) {
        const bookmark = await this.get(id);

        return await this.#getFoldersWithChildrenRecursiveByParentId([bookmark], [[bookmark]]);
    }

    async #getFoldersWithChildrenRecursiveByParentId(children, result = []) {
        const bookmarkChildrenIds = children
            .filter(({type}) => BookmarkTypeEnum.isFolder(type))
            .map(({id}) => id);

        if (bookmarkChildrenIds.length < 1) {
            return result;
        }

        const bookmarkChildren = (await this.getAll())
            .filter(({type}) => BookmarkTypeEnum.isFolder(type))
            .filter(({parentId}) => bookmarkChildrenIds.includes(parentId));

        if (bookmarkChildren.length < 1) {
            return result;
        }

        result.push(bookmarkChildren);

        return await this.#getFoldersWithChildrenRecursiveByParentId(bookmarkChildren, result);
    }

    async getBookmarksByFolderIds(ids) {
        return (await this.getAll())
            .filter(({type}) => BookmarkTypeEnum.isNotFolder(type))
            .filter(({parentId}) => ids.includes(parentId));
    }

    async save(bookmark) {
        const item = Object.create(null);

        item[`${bookmark.id}`] = bookmark;

        await this.#dataSource.set(item);

        return await this.get(bookmark.id);
    }

    async delete(id) {
        await this.#dataSource.remove(id);

        return await this.get(id);
    }

    async deleteAllByIds(ids) {
        const operations = ids.map(id => this.delete(id));

        return await Promise.all(operations);
    }

    destroy() {
        this.#dataSource = undefined;
    }

}

const bookmarkRepository = new BookmarkRepository();

export default bookmarkRepository;
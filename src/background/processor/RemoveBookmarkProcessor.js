import BookmarkCreator from '../BookmarkCreator.js';
import BookmarkTypeEnum from '../utils/BookmarkTypeEnum.js';

export default class RemoveBookmarkProcessor {
    #listener;
    #storage;
    #bookmarkCreator = new BookmarkCreator();

    constructor(storage) {
        this.#storage = storage;
    }

    static async build(storage) {
        const processor = new RemoveBookmarkProcessor(storage);

        await processor.#init();

        return processor;
    }

    destroy() {
        browser.bookmarks.onRemoved.removeListener(this.#listener);
        this.#listener = undefined;
    }

    async #init() {
        const that = this;

        this.#listener = async (id, {index, node}) => {
            await that.#recreateBookmarks(id, index, node);
        };
        browser.bookmarks.onRemoved.addListener(this.#listener);
    }

    async #recreateBookmarks(id, index, node) {
        const {parentId} = node;

        console.debug('Recreation is started.', {id, parentId, node});

        if (BookmarkTypeEnum.isFolder(node.type)) {
            console.debug('Recreation is started. Bookmark type is folder starts');

            const folderArrays = this.#storage.getFoldersWithChildrenRecursiveById(id);

            console.debug('folderArrays', folderArrays);

            const folderArraysIds = folderArrays.flat(Infinity)
                .map(id => id);
            const recreatedFolders = await this.#makeRecreateOperations(folderArrays);
            // const bookmarks = this.#storage.getBookmarksByFolderIds(folderArraysIds);
            console.debug('recreatedFolders', recreatedFolders);


            console.debug('Start bookmark recreation');

            console.debug('End bookmark storage clearing', this.#storage);

            console.debug('Recreation is started. Bookmark type is folder ended');
        } else {
            const bookmark = await this.#storage.get(id);

            await this.#bookmarkCreator.create(index, bookmark);
            await this.#storage.delete(id);
        }
    }

    async #makeRecreateOperations(folderArrays) {
        const recreatedFolderArrays = await Promise.all(folderArrays[0].map(async folder => [
            folder.id,
            await this.#bookmarkCreator.create(folder.index, folder)
        ]));
        let oldIdNewIdMap = new Map(recreatedFolderArrays);

        for (const folderArray of folderArrays.slice(1)) {
            const recreatedFolderArrays = await Promise.all(folderArray.map(async folder => {
                const parentId = oldIdNewIdMap.get(folder.parentId).id;

                return [
                    folder.id,
                    await this.#bookmarkCreator.create(folder.index, {...folder, parentId})
                ];
            }));
            oldIdNewIdMap = new Map([...oldIdNewIdMap, ...recreatedFolderArrays]);
        }

        return oldIdNewIdMap;
    }

}
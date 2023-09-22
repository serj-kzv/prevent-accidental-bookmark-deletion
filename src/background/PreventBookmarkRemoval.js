import BookmarkCreator from "./BookmarkCreator.js";
import BookmarkStorage from "./bookmarkstorage/BookmarkStorage.js";
import ChangeBookmarkProcessor from './processor/ChangeBookmarkProcessor.js';
import CreateBookmarkProcessor from './processor/CreateBookmarkProcessor.js';
import MoveBookmarkProcessor from './processor/MoveBookmarkProcessor.js';
import RemoveBookmarkProcessor from './processor/RemoveBookmarkProcessor.js';
import BookmarkTypeEnum from './utils/BookmarkTypeEnum.js';
import BookmarkValidator from './utils/BookmarkValidator.js';

export default class PreventBookmarkRemoval {
    #storage;
    #bookmarkCreator = new BookmarkCreator();
    #processors = [];

    static async build() {
        const command = new PreventBookmarkRemoval();

        await command.#init();

        return command;
    }

    async #init() {
        console.debug('start PreventBookmarkRemoval initialization starts');

        console.debug('start PreventBookmarkRemoval validation starts');
        if (await BookmarkValidator.validate()) {
            console.debug('Web Extension Bookmark API data is valid.');
        } else {
            console.error('Web Extension Bookmark API data is NOT valid.');
        }
        console.debug('start PreventBookmarkRemoval validation ended');

        const bookmarks = await browser.bookmarks.search({});
        console.debug('Non root bookmarks', bookmarks);

        console.debug('start PreventBookmarkRemoval storage initialization starts');
        this.#storage = await BookmarkStorage.build(bookmarks);
        console.debug('start PreventBookmarkRemoval storage initialized');

        this.#processors = [...await Promise.all([
            CreateBookmarkProcessor.build(),
            ChangeBookmarkProcessor.build(),
            MoveBookmarkProcessor.build(),
            RemoveBookmarkProcessor.build(),
        ])];

        console.debug('start PreventBookmarkRemoval initialized');
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
            const bookmarks = this.#storage.getBookmarksByFolderIds(folderArraysIds);

            const recreatedFolders = await this.#makeRecreateOperations(folderArrays);

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
        let oldIdNewIdMap;

        const recreatedFolderArrays = await Promise.all(folderArrays[0].map(async folder => [
            folder.id,
            await this.#bookmarkCreator.create(folder.index, folder)
        ]));
        oldIdNewIdMap = new Map(recreatedFolderArrays);

        for (const folderArray of folderArrays.slice(1)) {
            const recreatedFolderArrays = await Promise.all(folderArray.map(async folder => {
                const parentId = oldIdNewIdMap.get(folder.parentId);

                return [
                    folder.id,
                    await this.#bookmarkCreator.create(folder.index, {...folder, parentId})
                ];
            }));
            oldIdNewIdMap = new Map(recreatedFolderArrays);
        }
    }

    destroy() {
        this.#processors.forEach(processor => processor.destroy());
        this.#storage = undefined;
    }
}
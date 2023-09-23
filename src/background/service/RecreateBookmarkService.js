import BookmarkTypeEnum from '../utils/BookmarkTypeEnum.js';
import bookmarkCreatorService from './BookmarkCreatorService.js';

class RecreateBookmarkService {
    async recreateBookmarks(storage, id, index, node) {
        const {parentId} = node;

        console.debug('Recreation is started.', {id, parentId, node});

        if (BookmarkTypeEnum.isFolder(node.type)) {
            console.debug('Recreation is started. Bookmark type is folder starts');

            const folderArrays = storage.getFoldersWithChildrenRecursiveById(id);

            console.debug('folderArrays', folderArrays);

            const recreatedFoldersMap = await this.#makeRecreateOperations(folderArrays);

            console.debug('recreatedFolders', recreatedFoldersMap);

            const recreatedFolderOldIds = Array.from(recreatedFoldersMap.keys());

            console.debug('recreatedFolderOldIds', recreatedFolderOldIds);

            // const bookmarksToRecreate = storage.getBookmarksByFolderIds(recreatedFolderOldIds)
            //     .map(bookmark => {
            //         const parentId = recreatedFoldersMap.get(bookmark.parentId);
            //         return {...bookmark, parentId};
            //     });
            //
            // console.debug('bookmarksToRecreate', bookmarksToRecreate);

            console.debug('Start bookmark recreation');

            console.debug('End bookmark storage clearing', storage);

            console.debug('Recreation is started. Bookmark type is folder ended');
        } else {
            const bookmark = await storage.get(id);

            await bookmarkCreatorService.create(index, bookmark);
            await storage.delete(id);
        }
    }

    async #makeRecreateOperations(folderArrays) {
        const recreatedFolderArrays = await Promise.all(folderArrays[0].map(async folder => [
            folder.id,
            await bookmarkCreatorService.create(folder.index, folder)
        ]));
        let oldIdNewIdMap = new Map(recreatedFolderArrays);

        for (const folderArray of folderArrays.slice(1)) {
            const recreatedFolderArrays = await Promise.all(folderArray.map(async folder => {
                const parentId = oldIdNewIdMap.get(folder.parentId).id;

                return [
                    folder.id,
                    await bookmarkCreatorService.create(folder.index, {...folder, parentId})
                ];
            }));
            oldIdNewIdMap = new Map([...oldIdNewIdMap, ...recreatedFolderArrays]);
        }

        return oldIdNewIdMap;
    }
}

const recreateBookmarkService = new RecreateBookmarkService();

export default recreateBookmarkService;
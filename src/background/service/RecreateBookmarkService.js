import bookmarkRepository from '../bookmarkstorage/BookmarkRepository.js';
import BookmarkTypeEnum from '../utils/BookmarkTypeEnum.js';
import bookmarkCreatorService from './BookmarkCreatorService.js';

class RecreateBookmarkService {

    async recreateBookmarks(id, index, node) {
        const {parentId} = node;

        console.debug('Recreation is started.', {id, parentId, node});

        if (BookmarkTypeEnum.isFolder(node.type)) {
            console.debug('Recreation is started. Bookmark type is folder starts. Storage state:', await bookmarkRepository.getAll());

            const folderArrays = await bookmarkRepository.getFoldersWithChildrenRecursiveById(id);

            console.debug('folderArrays', folderArrays);

            const recreatedFoldersMap = await this.#makeRecreateFolderOperations(folderArrays);

            console.debug('recreatedFolders', recreatedFoldersMap);

            const recreatedFolderOldIds = Array.from(recreatedFoldersMap.keys());

            console.debug('recreatedFolderOldIds', recreatedFolderOldIds);

            const bookmarksToRecreate = await bookmarkRepository.getBookmarksByFolderIds(recreatedFolderOldIds);

            console.debug('bookmarksToRecreate', bookmarksToRecreate);

            const bookmarksToRecreateOldIds = bookmarksToRecreate.map(({id}) => id);

            console.debug('bookmarksToRecreateOldIds', bookmarksToRecreateOldIds);

            const bookmarksToRecreateOperations = bookmarksToRecreate
                .map(bookmark => {
                    const parentId = recreatedFoldersMap.get(bookmark.parentId).id;
                    return {...bookmark, parentId};
                })
                .map(bookmark => bookmarkCreatorService.create(bookmark.index, bookmark));

            console.debug('bookmarksToRecreateOperations', bookmarksToRecreateOperations);

            const recreatedBookmarks = await Promise.all(bookmarksToRecreateOperations);

            console.debug('recreatedBookmarks', recreatedBookmarks);

            console.debug('Start bookmark storage clearing', bookmarkRepository);

            await bookmarkRepository.deleteAllByIds([...recreatedFolderOldIds, ...bookmarksToRecreateOldIds]);

            console.debug('End bookmark storage clearing', bookmarkRepository);

            console.debug('Recreation is started. Bookmark type is folder ended');
        } else {
            const bookmark = await bookmarkRepository.get(id);

            await bookmarkCreatorService.create(index, bookmark);
            await bookmarkRepository.delete(id);
        }
    }

    async #makeRecreateFolderOperations(folderArrays) {
        const recreatedFolderArrays = await Promise.all(folderArrays[0].map(async folder => [
            folder.id,
            await bookmarkCreatorService.create(folder.index, folder)
        ]));
        let oldIdFolderMap = new Map(recreatedFolderArrays);

        for (const folderArray of folderArrays.slice(1)) {
            const recreatedOldIdFolderMap = await Promise.all(folderArray.map(async folder => {
                const parentId = oldIdFolderMap.get(folder.parentId).id;

                return [
                    folder.id,
                    await bookmarkCreatorService.create(folder.index, {...folder, parentId})
                ];
            }));
            oldIdFolderMap = new Map([...oldIdFolderMap, ...recreatedOldIdFolderMap]);
        }

        return oldIdFolderMap;
    }

}

const recreateBookmarkService = new RecreateBookmarkService();

export default recreateBookmarkService;
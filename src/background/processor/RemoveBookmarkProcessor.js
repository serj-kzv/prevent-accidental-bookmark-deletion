import bookmarkRepository from '../bookmarkstorage/BookmarkRepository.js';
import recreateBookmarkService from '../service/RecreateBookmarkService.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class RemoveBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.bookmarks.onRemoved);
    }

    async process({id, info}) {
        console.debug('RemoveBookmarkProcessor starts');

        const {index, node} = info;

        console.debug('RemoveBookmarkProcessor storage state', await bookmarkRepository.getAll());

        await recreateBookmarkService.recreateBookmarks(id, index, node);

        console.debug('RemoveBookmarkProcessor ends');
    }

}
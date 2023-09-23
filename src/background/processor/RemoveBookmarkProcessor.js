import recreateBookmarkService from '../service/RecreateBookmarkService.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class RemoveBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.bookmarks.onRemoved);
    }

    async process({id, removeInfo}) {
        const {index, node} = removeInfo;

        await recreateBookmarkService.recreateBookmarks(id, index, node);
    }

}
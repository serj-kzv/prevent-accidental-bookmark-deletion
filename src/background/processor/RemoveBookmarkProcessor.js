import recreateBookmarkService from '../service/RecreateBookmarkService.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class RemoveBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.bookmarks.onRemoved);
    }

    async process({id, info}) {
        console.debug('RemoveBookmarkProcessor starts');

        const {index, node} = info;

        await recreateBookmarkService.recreateBookmarks(id, index, node);

        console.debug('RemoveBookmarkProcessor ends');
    }

}
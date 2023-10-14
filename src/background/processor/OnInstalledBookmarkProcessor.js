import bookmarkInitService from '../service/BookmarkInitService.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class OnInstalledBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.runtime.onInstalled);
    }

    async process() {
        console.debug('OnInstalledBookmarkProcessor starts');

        await bookmarkInitService.initBookmarks();

        console.debug('OnInstalledBookmarkProcessor ends');
    }

}
import bookmarkInitService from '../service/BookmarkInitService.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class OnStartupBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.runtime.onStartup);
    }

    async process() {
        console.debug('OnStartupBookmarkProcessor starts');

        await bookmarkInitService.initBookmarks();

        console.debug('OnStartupBookmarkProcessor ends');
    }

}
import BookmarkValidator from '../utils/BookmarkValidator.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class OnInstalledBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.runtime.onInstalled);
    }

    async process() {
        console.debug('OnInstalledBookmarkProcessor starts');

        console.debug('OnInstalledBookmarkProcessor ends');
    }

}
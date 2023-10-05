import BookmarkValidator from '../utils/BookmarkValidator.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class OnEnabledBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.management.onEnabled);
    }

    async process() {
        console.debug('OnEnabledBookmarkProcessor starts');

        console.debug('start PreventBookmarkRemoval validation starts');
        if (await BookmarkValidator.validate()) {
            console.debug('Web Extension Bookmark API data is valid.');
        } else {
            console.error('Web Extension Bookmark API data is NOT valid.');
        }
        console.debug('start PreventBookmarkRemoval validation ended');

        console.debug('OnEnabledBookmarkProcessor ends');
    }

}
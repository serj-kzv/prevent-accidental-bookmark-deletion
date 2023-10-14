import bookmarkInitService from '../service/BookmarkInitService.js';
import BookmarkValidator from '../utils/BookmarkValidator.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class OnEnabledBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.management.onEnabled);
    }

    async process() {
        browser.management.onEnabled.addListener(() => {
            console.debug('test')
        })
        console.debug('OnEnabledBookmarkProcessor starts');

        console.debug('start PreventBookmarkRemoval validation starts');
        if (await BookmarkValidator.validate()) {
            console.debug('Web Extension Bookmark API data is valid.');
        } else {
            console.error('Web Extension Bookmark API data is NOT valid.');
        }
        console.debug('start PreventBookmarkRemoval validation ended');

        await bookmarkInitService.initBookmarks();

        console.debug('OnEnabledBookmarkProcessor ends');
    }

}
import BookmarkProcessor from './BookmarkProcessor.js';

export default class OnStartupBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.runtime.onStartup);
    }

    async process() {
        console.debug('OnStartupBookmarkProcessor starts');



        console.debug('OnStartupBookmarkProcessor ends');
    }

}
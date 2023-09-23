import bookmarkRepository from '../bookmarkstorage/BookmarkRepository.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class CreateBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.bookmarks.onCreated);
    }

    async process({id, info}) {
        console.debug('CreateBookmarkProcessor starts');

        console.debug('Will be added to storage', {id, info});

        bookmarkRepository.save(info);

        console.debug('CreateBookmarkProcessor ends');
    }

}
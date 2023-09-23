import bookmarkRepository from '../bookmarkstorage/BookmarkRepository.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class ChangeBookmarkProcessor extends BookmarkProcessor {

    constructor(storage) {
        super(browser.bookmarks.onChanged);
    }

    async process({id, changeInfo}) {
        console.debug('Will be changed in storage', {id, changeInfo});

        const savedBookmark = bookmarkRepository.get(id);

        console.debug('Will be changed in storage, savedBookmark', savedBookmark);

        const changedBookmark = {...savedBookmark, ...changeInfo};

        console.debug('Will be changed in storage, changedBookmark', changedBookmark);

        bookmarkRepository.save(changedBookmark);
    }

}
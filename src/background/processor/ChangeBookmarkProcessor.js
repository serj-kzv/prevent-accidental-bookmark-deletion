import bookmarkRepository from '../bookmarkstorage/BookmarkRepository.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class ChangeBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.bookmarks.onChanged);
    }

    async process({id, info}) {
        console.debug('ChangeBookmarkProcessor starts');

        console.debug('Will be changed in storage', {id, info});

        const savedBookmark = await bookmarkRepository.get(id);

        console.debug('Will be changed in storage, savedBookmark', savedBookmark);

        const changedBookmark = {...savedBookmark, ...info};

        console.debug('Will be changed in storage, changedBookmark', changedBookmark);

        await bookmarkRepository.save(changedBookmark);

        console.debug('ChangeBookmarkProcessor ends');
    }

}
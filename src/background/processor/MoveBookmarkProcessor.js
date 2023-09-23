import bookmarkRepository from '../bookmarkstorage/BookmarkRepository.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class MoveBookmarkProcessor extends BookmarkProcessor {

    constructor(storage) {
        super(browser.bookmarks.onMoved);
    }

    async process({id, moveInfo}) {
        console.debug('Will be moved in storage', {id, moveInfo});

        const {parentId, index} = moveInfo;

        const savedBookmark = bookmarkRepository.get(id);

        console.debug('Will be moved in storage, savedBookmark', savedBookmark);

        const movedBookmark = {...savedBookmark, parentId, index};

        console.debug('Will be moved in storage, movedBookmark', movedBookmark);

        bookmarkRepository.save(movedBookmark);
    }

}
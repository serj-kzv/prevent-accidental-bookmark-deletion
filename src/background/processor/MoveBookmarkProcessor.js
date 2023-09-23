import bookmarkRepository from '../bookmarkstorage/BookmarkRepository.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class MoveBookmarkProcessor extends BookmarkProcessor {

    constructor(storage) {
        super(browser.bookmarks.onMoved);
    }

    async process({id, info}) {
        console.log('MoveBookmarkProcessor starts');

        console.debug('Will be moved in storage', {id, info});

        const {parentId, index} = info;

        const savedBookmark = bookmarkRepository.get(id);

        console.debug('Will be moved in storage, savedBookmark', savedBookmark);

        const movedBookmark = {...savedBookmark, parentId, index};

        console.debug('Will be moved in storage, movedBookmark', movedBookmark);

        bookmarkRepository.save(movedBookmark);

        console.log('MoveBookmarkProcessor ends');
    }

}
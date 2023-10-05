import bookmarkRepository from '../bookmarkstorage/BookmarkRepository.js';
import BookmarkProcessor from './BookmarkProcessor.js';

export default class MoveBookmarkProcessor extends BookmarkProcessor {

    constructor() {
        super(browser.bookmarks.onMoved);
    }

    async process({id, info}) {
        console.debug('MoveBookmarkProcessor starts');

        console.debug('Will be moved in storage', {id, info});

        const {parentId, index} = info;

        const savedBookmark = await bookmarkRepository.get(id);

        console.debug('Will be moved in storage, savedBookmark', savedBookmark);

        const movedBookmark = {...savedBookmark, parentId, index};

        console.debug('Will be moved in storage, movedBookmark', movedBookmark);

        await bookmarkRepository.save(movedBookmark);

        console.debug('MoveBookmarkProcessor ends');
    }

}
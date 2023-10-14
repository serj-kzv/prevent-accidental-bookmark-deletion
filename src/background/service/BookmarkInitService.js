import bookmarkRepository from '../bookmarkstorage/BookmarkRepository.js';

class BookmarkInitService {
    async initBookmarks() {
        console.debug('start PreventBookmarkRemoval initialization starts', await browser.storage.local.get(null));

        const bookmarks = await browser.bookmarks.search({});
        console.debug('Non root bookmarks', bookmarks);

        console.debug('start PreventBookmarkRemoval storage initialization starts');
        console.debug('bookmarks will be saved', bookmarks);

        await bookmarkRepository.saveAll(bookmarks);

        console.debug('saved bookmarks.', await bookmarkRepository.get(bookmarks.map(({id}) => id)));
    }
}

const bookmarkInitService = new BookmarkInitService();

export default bookmarkInitService;
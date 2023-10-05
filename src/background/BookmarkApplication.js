import bookmarkRepository from './bookmarkstorage/BookmarkRepository.js';
import ChangeBookmarkProcessor from './processor/ChangeBookmarkProcessor.js';
import CreateBookmarkProcessor from './processor/CreateBookmarkProcessor.js';
import MoveBookmarkProcessor from './processor/MoveBookmarkProcessor.js';
import OnEnabledBookmarkProcessor from './processor/OnEnabledBookmarkProcessor.js';
import OnInstalledBookmarkProcessor from './processor/OnInstalledBookmarkProcessor.js';
import OnStartupBookmarkProcessor from './processor/OnStartupBookmarkProcessor.js';
import RemoveBookmarkProcessor from './processor/RemoveBookmarkProcessor.js';
import BookmarkValidator from './utils/BookmarkValidator.js';

export default class BookmarkApplication {
    #processors = [];

    async init() {
        console.debug('start PreventBookmarkRemoval initialization starts', await browser.storage.local.get(null));

        const bookmarks = await browser.bookmarks.search({});
        console.debug('Non root bookmarks', bookmarks);

        console.debug('start PreventBookmarkRemoval storage initialization starts');
        console.debug('bookmarks will be saved', bookmarks);

        await bookmarkRepository.saveAll(bookmarks);

        console.debug('saved bookmarks.', await bookmarkRepository.get(bookmarks.map(({id}) => id)));
        console.debug('start PreventBookmarkRemoval storage initialized.');

        this.#processors = [...await Promise.all([
            new CreateBookmarkProcessor().init(),
            new ChangeBookmarkProcessor().init(),
            new MoveBookmarkProcessor().init(),
            new RemoveBookmarkProcessor().init(),
            new OnStartupBookmarkProcessor().init(),
            new OnInstalledBookmarkProcessor().init(),
            new OnEnabledBookmarkProcessor().init(),
        ])];

        console.debug('end PreventBookmarkRemoval initialized');
    }

    destroy() {
        this.#processors.forEach(processor => processor.destroy());
    }
}
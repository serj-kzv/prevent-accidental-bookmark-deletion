import BookmarkStorage from "./bookmarkstorage/BookmarkStorage.js";
import ChangeBookmarkProcessor from './processor/ChangeBookmarkProcessor.js';
import CreateBookmarkProcessor from './processor/CreateBookmarkProcessor.js';
import MoveBookmarkProcessor from './processor/MoveBookmarkProcessor.js';
import RemoveBookmarkProcessor from './processor/RemoveBookmarkProcessor.js';
import BookmarkValidator from './utils/BookmarkValidator.js';

export default class Main {
    #storage;
    #processors = [];

    static async build() {
        const command = new Main();

        await command.#init();

        return command;
    }

    async #init() {
        console.debug('start PreventBookmarkRemoval initialization starts');

        console.debug('start PreventBookmarkRemoval validation starts');
        if (await BookmarkValidator.validate()) {
            console.debug('Web Extension Bookmark API data is valid.');
        } else {
            console.error('Web Extension Bookmark API data is NOT valid.');
        }
        console.debug('start PreventBookmarkRemoval validation ended');

        const bookmarks = await browser.bookmarks.search({});
        console.debug('Non root bookmarks', bookmarks);

        console.debug('start PreventBookmarkRemoval storage initialization starts');
        this.#storage = await BookmarkStorage.build(bookmarks);
        console.debug('start PreventBookmarkRemoval storage initialized');

        this.#processors = [...await Promise.all([
            CreateBookmarkProcessor.build(this.#storage),
            ChangeBookmarkProcessor.build(this.#storage),
            MoveBookmarkProcessor.build(this.#storage),
            RemoveBookmarkProcessor.build(this.#storage),
        ])];

        console.debug('start PreventBookmarkRemoval initialized');
    }

    destroy() {
        this.#processors.forEach(processor => processor.destroy());
        this.#storage = undefined;
    }
}
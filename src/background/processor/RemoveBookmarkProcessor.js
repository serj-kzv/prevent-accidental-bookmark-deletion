import BookmarkCreatorService from '../service/BookmarkCreatorService.js';
import recreateBookmarkService from '../service/RecreateBookmarkService.js';

export default class RemoveBookmarkProcessor {
    #listener;
    #storage;

    constructor(storage) {
        this.#storage = storage;
    }

    static async build(storage) {
        const processor = new RemoveBookmarkProcessor(storage);

        await processor.#init();

        return processor;
    }

    destroy() {
        browser.bookmarks.onRemoved.removeListener(this.#listener);
        this.#listener = undefined;
    }

    async #init() {
        const that = this;

        this.#listener = async (id, {index, node}) => {
            await recreateBookmarkService.recreateBookmarks(this.#storage, id, index, node);
        };
        browser.bookmarks.onRemoved.addListener(this.#listener);
    }

}
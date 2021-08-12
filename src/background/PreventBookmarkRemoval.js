import BookmarkStorage from "./bookmarkstorage/BookmarkStorage.js";

class BookmarkCreator {
    #queue;

    async create(index, bookmark) {
        const {parentId, type, url, title} = bookmark;

        await browser.bookmarks.create({
            index,
            parentId,
            type,
            url,
            title
        });
    }
}

class PreventBookmarkRemoval {
    #storage;
    #bookmarkCreator = new BookmarkCreator();
    #onRemovedListener;

    static async build() {
        const command = new PreventBookmarkRemoval();

        await command.#init();

        return command;
    }

    async #init() {
        console.debug('start PreventBookmarkRemoval init');
        this.#storage = await BookmarkStorage.build();
        this.#onRemovedListener = async (id, {index, node}) => {
            console.debug('Recreation is started.');
            console.debug('id', id);
            console.debug('node', node);

            const bookmark = await this.#storage.get(id);

            console.debug('index', index);
            console.debug('bookmark', bookmark);

            await this.#storage.delete(id);
            this.#bookmarkCreator.create(index, bookmark);
        };
        browser.bookmarks.onRemoved.addListener(this.#onRemovedListener);
    }

    async destroy() {
        if (this.#onRemovedListener) {
            browser.bookmarks.onRemoved.removeListener(this.#onRemovedListener);
        }
        this.#onRemovedListener = undefined;
        this.#storage = undefined;
    }
}

export default PreventBookmarkRemoval;
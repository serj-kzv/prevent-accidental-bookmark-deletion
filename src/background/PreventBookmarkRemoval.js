import BookmarkCreator from "./BookmarkCreator.js";
import BookmarkStorage from "./bookmarkstorage/BookmarkStorage.js";
import BookmarkStorageUtils from "./bookmarkstorage/BookmarkStorageUtils.js";

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
            const {parentId} = node;
            const key = BookmarkStorageUtils.makeStorageKey(id, parentId);

            console.debug('Recreation is started.');
            console.debug('id', id);
            console.debug('parentId', parentId);
            console.debug('key', key);
            console.debug('node', node);

            const bookmark = await this.#storage.get(key);

            console.debug('index', index);
            console.debug('bookmark', bookmark);

            await this.#storage.delete(key);
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
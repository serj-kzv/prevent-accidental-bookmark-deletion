import BookmarkStorage from "./bookmarkstorage/BookmarkStorage.js";

class BookmarkProducerQueue {
    push
}

class PreventBookmarkRemoval {
    #storage;
    #onRemovedListener = async (id, {index, node}) => {
        console.debug('Recreation is started.');
        console.debug('id', id);
        console.debug('node', node);

        const {parentId, type, url} = node;
        const bookmark = await this.#storage.get(id);
        const {title} = bookmark;

        console.debug('index', index);
        console.debug('bookmark', bookmark);

        await this.#storage.delete(id);
        await browser.bookmarks.create({
            index,
            parentId,
            type,
            url,
            title
        });
    };

    static async build() {
        const command = new PreventBookmarkRemoval();

        await command.#init();

        return command;
    }

    async #init() {
        console.debug('start PreventBookmarkRemoval init');
        this.#storage = await BookmarkStorage.build();
        browser.bookmarks.onRemoved.addListener(this.#onRemovedListener);
    }

    async destroy() {
        browser.bookmarks.onRemoved.removeListener(this.#onRemovedListener);
        this.#onRemovedListener = undefined;
        this.#storage = undefined;
    }
}

export default PreventBookmarkRemoval;
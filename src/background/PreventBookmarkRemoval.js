import BookmarkStorage from "./bookmarkstorage/BookmarkStorage.js";

class PreventBookmarkRemoval {
    #storage;

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

    async #onRemovedListener(id, {node}) {
        console.debug('Recreation is started.');
        console.debug('id', id);
        console.debug('node', node);

        const {index, parentId, type, url} = node;
        const title = await this.#storage.getById(id);

        console.debug('title', title);

        await browser.bookmarks.create({
            index,
            parentId,
            type,
            url,
            title
        });
        await this.#storage.delete(id);
    };

    async destroy() {
        browser.bookmarks.onRemoved.removeListener(this.#onRemovedListener);
    }
}

export default PreventBookmarkRemoval;
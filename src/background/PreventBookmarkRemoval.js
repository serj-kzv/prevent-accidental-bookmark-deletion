import BookmarkStorage from "./bookmarkstorage/BookmarkStorage.js";

class PreventBookmarkRemoval {
    #storage;
    #onRemovedListener = async (id, {index, node}) => {
        console.debug('Recreation is started.');
        console.debug('id', id);
        console.debug('node', node);

        const {parentId, type, url} = node;
        const title = await this.#storage.get(id);

        console.debug('index', index);
        console.debug('title', title);

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
    }
}

export default PreventBookmarkRemoval;
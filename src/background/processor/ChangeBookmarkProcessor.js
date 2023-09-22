export default class ChangeBookmarkProcessor {
    #listener;
    #storage;

    constructor(storage) {
        this.#storage = storage;
    }

    static async build(storage) {
        const processor = new ChangeBookmarkProcessor(storage);

        await processor.#init();

        return processor;
    }

    destroy() {
        browser.bookmarks.onChanged.removeListener(this.#listener);
        this.#listener = undefined;
    }

    async #init() {
        this.#listener = async (id, bookmark) => {
            const {parentId} = bookmark;

            console.debug('Will be changed in storage', {id, parentId, bookmark});

            const savedBookmark = this.#storage.get(id);

            console.debug('Will be changed in storage, savedBookmark', savedBookmark);

            const changedBookmark = {...savedBookmark, ...bookmark};

            console.debug('Will be changed in storage, changedBookmark', changedBookmark);

            this.#storage.save(changedBookmark);
        };
        browser.bookmarks.onChanged.addListener(this.#listener);
    }

}
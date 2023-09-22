export default class CreateBookmarkProcessor {
    #listener;
    #storage;

    constructor(storage) {
        this.#storage = storage;
    }

    static async build(storage) {
        const processor = new CreateBookmarkProcessor(storage);

        await processor.#init()

        return processor;
    }

    destroy() {
        browser.bookmarks.onCreated.removeListener(this.#listener);
        this.#listener = undefined;
    }

    async #init() {
        this.#listener = async (id, bookmark) => {
            const {parentId} = bookmark;

            console.debug('Will be added to storage', {id, parentId, bookmark});

            this.#storage.save(bookmark);
        };
        browser.bookmarks.onCreated.addListener(this.#listener);
    }

}
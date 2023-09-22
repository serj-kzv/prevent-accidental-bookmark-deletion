export default class MoveBookmarkProcessor {
    #listener;
    #storage;

    constructor(storage) {
        this.#storage = storage;
    }

    static async build(storage) {
        const processor = new MoveBookmarkProcessor(storage);

        await processor.#init();

        return processor;
    }

    destroy() {
        browser.bookmarks.onMoved.removeListener(this.#listener);
        this.#listener = undefined;
    }

    async #init() {
        this.#listener = async (id, moveInfo) => {
            const {parentId, index} = moveInfo;

            console.debug('Will be moved in storage', {id, moveInfo});

            const savedBookmark = this.#storage.get(id);

            console.debug('Will be moved in storage, savedBookmark', savedBookmark);

            const movedBookmark = {...savedBookmark, parentId, index};

            console.debug('Will be moved in storage, movedBookmark', movedBookmark);

            this.#storage.save(movedBookmark);
        };
        browser.bookmarks.onMoved.addListener(this.#listener);
    }

}
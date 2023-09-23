export default class BookmarkProcessor {
    #event;
    #listener;

    constructor(event) {
        this.#event = event;
    }

    destroy() {
        this.#event.removeListener(this.#listener);
        this.#listener = undefined;

        return this;
    }

    async init() {
        console.debug('BookmarkProcessor init', this.constructor.name);

        this.#listener = async (id, info) => await this.process({id, info});
        this.#event.addListener(this.#listener);

        return this;
    }

    async process(data) {
        console.debug('Method is not overridden.');
    }

}
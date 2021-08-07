class AbstractBookmarkStorage {
    static #ERR_MSG = 'The method has to be implemented!';

    async init() {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async getById(id) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async save(id, title) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async delete(id) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async destroy() {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }
}

export default AbstractBookmarkStorage;
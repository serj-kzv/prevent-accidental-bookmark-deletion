class AbstractBookmarkStorage {
    static #ERR_MSG = 'The method has to be implemented!';

    async get(id) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async save(id, bookmark) {
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
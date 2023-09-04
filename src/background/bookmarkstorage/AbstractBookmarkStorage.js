class AbstractBookmarkStorage {
    static #ERR_MSG = 'The method has to be implemented!';

    async get(key) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async save(key, bookmark) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async delete(key) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async destroy() {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }
}

export default AbstractBookmarkStorage;
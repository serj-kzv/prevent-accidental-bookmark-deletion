import BookmarkStorage from "./bookmarkstorage/BookmarkStorage";

class PreventBookmarkRemoval {
    #storage;

    static async build() {
        const command = new PreventBookmarkRemoval();

        command.#storage = await BookmarkStorage.build();

        return command;
    }

    run() {

    }
}

export default PreventBookmarkRemoval;
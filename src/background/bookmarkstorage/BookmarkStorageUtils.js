class BookmarkStorageUtils {

    static makeStorageKey(id, parentId) {
        return id + parentId;
    }

}

export default BookmarkStorageUtils;
class BookmarkIdEnum {
    static BOOKMARK_ROOT_ID = 'root________';

    isRoot(id) {
        return BookmarkIdEnum.BOOKMARK_ROOT_ID === id;
    }

}
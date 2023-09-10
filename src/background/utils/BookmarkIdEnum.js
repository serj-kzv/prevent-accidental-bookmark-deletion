export default class BookmarkIdEnum {
    static BOOKMARK_ROOT_ID = 'root________';

    isRootId(id) {
        return BookmarkIdEnum.BOOKMARK_ROOT_ID === id;
    }

}
class BookmarkTypeEnum {
    static BOOKMARK = 'bookmark';
    static FOLDER = 'folder';
    static NONE = '';

    static isBookmark(type) {
        return BookmarkTypeEnum.BOOKMARK === type;
    }

    static isFolder(type) {
        return BookmarkTypeEnum.FOLDER === type;
    }

}

export default BookmarkTypeEnum;
export default class BookmarkTypeEnum {
    static BOOKMARK = 'bookmark';
    static FOLDER = 'folder';
    static SEPARATOR = 'separator';

    static isBookmark(type) {
        return BookmarkTypeEnum.BOOKMARK === type;
    }

    static isFolder(type) {
        return BookmarkTypeEnum.FOLDER === type;
    }

    static isSeparator(type) {
        return BookmarkTypeEnum.SEPARATOR === type;
    }

    static isValidType(type) {
        return BookmarkTypeEnum.isBookmark(type)
            || BookmarkTypeEnum.isFolder(type)
            || BookmarkTypeEnum.isSeparator(type);
    }

    static isNotValidType(type) {
        return !BookmarkTypeEnum.isValidType(type);
    }

}
import BookmarkIdEnum from './BookmarkIdEnum.js';
import BookmarkTypeEnum from './BookmarkTypeEnum.js';
import Utils from './Utils.js';

export default class BookmarkValidator {

    static async validate() {
        const validatorResults = await Promise.allSettled([
            BookmarkValidator.validateIfThereIsBookmarkTree(),
            BookmarkValidator.validateIfThereIsAtLeastBookmarkRoot(),
            BookmarkValidator.validateIfThereIsOnlyOneBookmarkRoot(),
            BookmarkValidator.validateIfBookmarkRootHasAnId(),
            BookmarkValidator.validateIfBookmarkRootHasValidId(),
            BookmarkValidator.validateIfBookmarksHaveTypes(),
            BookmarkValidator.validateIfBookmarksHaveOnlyValidTypes(),
        ]);

        return validatorResults.every(validatorResult => validatorResult === true);
    }

    static async validateIfThereIsBookmarkTree() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const isValid = Utils.isNotUndefinedOrNull(bookmarkTree);

        if (isValid) {
            console.debug('There is bookmarkTree', bookmarkTree);

            return true;
        }

        console.error('There is no bookmarkTree');
        return false;
    }

    static async validateIfThereIsAtLeastBookmarkRoot() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const isValid = bookmarkTree.length > 0;

        if (isValid) {
            console.debug('There is bookmark root or roots', bookmarkTree);

            return true;
        }

        console.error('There is no bookmark root or roots');

        return false;
    }

    static async validateIfThereIsOnlyOneBookmarkRoot() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const isValid = bookmarkTree.length === 1;

        if (isValid) {
            console.debug('There is only one bookmark root');

            return true;
        }

        console.error('There is more then one bookmark root');

        return false;
    }

    static async validateIfBookmarkRootHasAnId() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const rootBookmark = bookmarkTree[0];
        const isValid = Utils.isNotUndefinedOrNull(rootBookmark.id);

        if (isValid) {
            console.debug('There is root bookmark id', rootBookmark);

            return true;
        }

        console.error('There is no root bookmark id');

        return false;
    }

    static async validateIfBookmarkRootHasValidId() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const rootBookmark = bookmarkTree[0];
        const isValid = BookmarkIdEnum.isRootId(rootBookmark.id);

        if (isValid) {
            console.debug('root bookmark has valid id', rootBookmark);

            return true;
        }

        console.error('root bookmark has not valid id');

        return false;
    }

    static async validateIfBookmarksHaveTypes() {
        const bookmarks = (await browser.bookmarks.search({})).map(({type}) => type);
        const rootBookmark = (await browser.bookmarks.getTree())[0];

        bookmarks.push(rootBookmark);

        const bookmarksWithoutTypes = bookmarks.filter(({type}) => Utils.isUndefinedOrNull(type));
        const isValid = bookmarksWithoutTypes.length > 0;

        if (isValid) {
            console.debug('There are no bookmarks without types');

            return true;
        }

        console.error('There are bookmarks without types', bookmarksWithoutTypes);

        return false;
    }

    static async validateIfBookmarksHaveOnlyValidTypes() {
        const bookmarks = (await browser.bookmarks.search({}));
        const rootBookmark = (await browser.bookmarks.getTree())[0];

        bookmarks.push(rootBookmark);

        const bookmarksWithNotValidTypes = bookmarks.filter(({type}) => BookmarkTypeEnum.isNotValidType(type));
        const isValid = bookmarksWithNotValidTypes.length < 1;

        if (isValid) {
            console.debug('bookmarks have valid types');

            return true;
        }

        console.error('bookmarks have not valid types', bookmarksWithNotValidTypes);

        return false;
    }

}
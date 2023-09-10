import BookmarkTypeEnum from './BookmarkTypeEnum.js';
import Utils from './Utils.js';
import BookmarkIdEnum from './BookmarkIdEnum.js';

export default class BookmarkValidator {

    static async validate() {
        await Promise.allSettled([
            BookmarkValidator.validateIfThereIsBookmarkTree(),
            BookmarkValidator.validateIfThereIsAtLeastBookmarkRoot(),
            BookmarkValidator.validateIfThereIsOnlyOneBookmarkRoot(),
            BookmarkValidator.validateIfBookmarkRootHasAnId(),
            BookmarkValidator.validateIfBookmarkRootHasValidId(),
            BookmarkValidator.validateIfBookmarksHaveOnlyValidTypes(),
        ]);
    }

    static async validateIfThereIsBookmarkTree() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const isValid = Utils.isNotUndefinedOrNull(bookmarkTree);

        if (isValid) {
            console.debug('There is bookmarkTree', bookmarkTree);
        } else {
            console.error('There is no bookmarkTree');
        }
    }

    static async validateIfThereIsAtLeastBookmarkRoot() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const isValid = bookmarkTree.length > 0;

        if (isValid) {
            console.debug('There is bookmark root or roots');
        } else {
            console.error('There is no bookmark root or roots');
        }

    }

    static async validateIfThereIsOnlyOneBookmarkRoot() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const isValid = bookmarkTree.length === 1;

        if (isValid) {
            console.debug('There is only one bookmark root');
        } else {
            console.error('There is more then one bookmark root');
        }
    }

    static async validateIfBookmarkRootHasAnId() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const rootBookmark = bookmarkTree[0];
        const isValid = Utils.isNotUndefinedOrNull(rootBookmark.id);

        if (isValid) {
            console.debug('There is root bookmark id', rootBookmark);
        } else {
            console.error('There is no root bookmark id');
        }
    }

    static async validateIfBookmarkRootHasValidId() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const rootBookmark = bookmarkTree[0];
        const isValid = BookmarkIdEnum.isRootId(rootBookmark.id);

        if (isValid) {
            console.debug('root bookmark has valid id', rootBookmark);
        } else {
            console.error('root bookmark has not valid id');
        }
    }

    static async validateIfBookmarksHaveOnlyValidTypes() {
        const types = (await browser.bookmarks.search({})).map(({type}) => type);
        const {type} = (await browser.bookmarks.getTree())[0];

        types.push(type);

        const isNotValidTypes = types.filter(type => BookmarkTypeEnum.isNotValidType(type));
        const isValid = isNotValidTypes.length < 1;

        if (isValid) {
            console.debug('bookmarks have valid types');
        } else {
            console.error('bookmarks have not valid types', isNotValidTypes);
        }
    }
}
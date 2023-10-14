import Utils from '../utils/Utils.js';
import BookmarkValidator from './BookmarkValidator.js';

export default class IfBookmarkRootHasAnIdValidator extends BookmarkValidator {
    async validate() {
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
}
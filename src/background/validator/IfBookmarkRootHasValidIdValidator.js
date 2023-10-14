import BookmarkIdEnum from '../utils/BookmarkIdEnum.js';
import BookmarkValidator from './BookmarkValidator.js';

export default class IfBookmarkRootHasValidIdValidator extends BookmarkValidator {
    async validate() {
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
}
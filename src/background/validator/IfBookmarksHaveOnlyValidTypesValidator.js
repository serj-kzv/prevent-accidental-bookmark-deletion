import BookmarkTypeEnum from '../utils/BookmarkTypeEnum.js';
import BookmarkValidator from './BookmarkValidator.js';

export default class IfBookmarksHaveOnlyValidTypesValidator extends BookmarkValidator {
    async validate() {
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
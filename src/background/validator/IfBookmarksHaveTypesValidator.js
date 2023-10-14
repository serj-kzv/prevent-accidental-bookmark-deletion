import Utils from '../utils/Utils.js';
import BookmarkValidator from './BookmarkValidator.js';

export default class IfBookmarksHaveTypesValidator extends BookmarkValidator {
    async validate() {
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
}
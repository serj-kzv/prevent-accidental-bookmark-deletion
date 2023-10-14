import Utils from '../utils/Utils.js';
import BookmarkValidator from './BookmarkValidator.js';

export default class IfBookmarksHaveTypesValidator extends BookmarkValidator {

    async validate() {
        const bookmarks = (await browser.bookmarks.search({}));
        const rootBookmark = (await browser.bookmarks.getTree())[0];

        bookmarks.push(rootBookmark);

        const isValid = !bookmarks.some(({type}) => Utils.isUndefinedOrNull(type));

        if (isValid) {
            console.debug('There are no bookmarks without types');

            return true;
        }

        console.error('There are bookmarks without types', bookmarksWithoutTypes);

        return false;
    }

}
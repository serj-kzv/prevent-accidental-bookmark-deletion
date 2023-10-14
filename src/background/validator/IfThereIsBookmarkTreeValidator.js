import Utils from '../utils/Utils.js';
import BookmarkValidator from './BookmarkValidator.js';

export default class IfThereIsBookmarkTreeValidator extends BookmarkValidator {

    async validate() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const isValid = Utils.isNotUndefinedOrNull(bookmarkTree);

        if (isValid) {
            console.debug('There is bookmarkTree', bookmarkTree);

            return true;
        }

        console.error('There is no bookmarkTree');
        return false;
    }

}
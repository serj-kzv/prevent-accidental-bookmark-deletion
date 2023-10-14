import BookmarkValidator from './BookmarkValidator.js';

export default class IfThereIsOnlyOneBookmarkRootValidator extends BookmarkValidator {
    async validate() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const isValid = bookmarkTree.length === 1;

        if (isValid) {
            console.debug('There is only one bookmark root');

            return true;
        }

        console.error('There is more then one bookmark root');

        return false;
    }
}
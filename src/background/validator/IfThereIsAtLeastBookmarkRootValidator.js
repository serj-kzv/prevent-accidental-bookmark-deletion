import BookmarkValidator from './BookmarkValidator.js';

export default class IfThereIsAtLeastBookmarkRootValidator extends BookmarkValidator {
    async validate() {
        const bookmarkTree = await browser.bookmarks.getTree();
        const isValid = bookmarkTree.length > 0;

        if (isValid) {
            console.debug('There is bookmark root or roots', bookmarkTree);

            return true;
        }

        console.error('There is no bookmark root or roots');

        return false;
    }
}
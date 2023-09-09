class BookmarkCreator {

    async create(index, bookmark) {
        const {parentId, type, url, title} = bookmark;
        const parentBookmarks = await browser.bookmarks.get(parentId);
        await this.#create(index, parentId, type, url, title);
    }

    async #create(index, parentId, type, url, title) {
        return await browser.bookmarks.create({
            index,
            parentId,
            type,
            url,
            title
        });
    }
}

export default BookmarkCreator;
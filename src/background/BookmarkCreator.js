class BookmarkCreator {

    async create(index, {id, parentId, type, url, title}) {
        const bookmark = await this.#create(index, parentId, type, url, title);

        return {bookmark, oldId: id};
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
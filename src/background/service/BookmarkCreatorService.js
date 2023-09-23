class BookmarkCreatorService {

    async create(index, {id, parentId, type, url, title}) {
        return await this.#create(index, parentId, type, url, title);
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

const bookmarkCreatorService = new BookmarkCreatorService();

export default bookmarkCreatorService;
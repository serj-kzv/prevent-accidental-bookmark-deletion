import BookmarkTypeEnum from "./BookmarkTypeEnum.js";

class BookmarkCreator {
    #queues = new Map();

    async create(index, bookmark) {
        const {parentId, type, url, title} = bookmark;

        await this.#execQueueIfFound(type, bookmark);

        const parentBookmark = await browser.bookmarks.get(parentId);

        if (parentBookmark.length < 1) {
            this.#pushToQueue(index, parentId, type, url, title);
        } else {
            try {
                await browser.bookmarks.create({
                    index,
                    parentId,
                    type,
                    url,
                    title
                });
            } catch (ex) {
                this.#pushToQueue(index, parentId, type, url, title);
            }
        }
    }

    async #execQueueIfFound(type, bookmark) {
        if (type === BookmarkTypeEnum.FOLDER) {
            const {id} = bookmark;
            const queue = this.#queues.get(id);

            if (queue) {
                await Promise.allSettled(queue);
            }
        }
    }

    #pushToQueue(index, parentId, type, url, title) {
        this.#createOrGetQueue(parentId).push(async () => await browser.bookmarks.create({
            index,
            parentId,
            type,
            url,
            title
        }));
    }

    #createOrGetQueue(id) {
        const queues = this.#queues;

        if (queues.has(id)) {
            return queues.get(id);
        } else {
            const queue = [];

            queues.set(id, queue);

            return queue;
        }
    }
}

export default BookmarkCreator;
import BookmarkTypeEnum from "./BookmarkTypeEnum.js";

class BookmarkCreator {
    #queues = new Map();

    async create(index, bookmark) {
        const {parentId, type, url, title} = bookmark;

        await this.#execQueueIfParentFound(type, bookmark);

        const parentBookmark = await browser.bookmarks.get(parentId);

        if (parentBookmark.length < 1) {
            this.#createInQueue(index, parentId, type, url, title);
        } else {
            try {
                await this.#create(index, parentId, type, url, title);
            } catch (ex) {
                this.#createInQueue(index, parentId, type, url, title);
            }
        }
    }

    async #execQueueIfParentFound(type, bookmark) {
        if (type === BookmarkTypeEnum.FOLDER) {
            const {id} = bookmark;
            const queue = this.#queues.get(id);

            if (queue) {
                const queueToExec = [...queue];

                await Promise.allSettled(queueToExec);

                // double check if parallel listener added a create task
                if (queueToExec.length !== queue.length) {
                    const queueToExecDiff = queue
                        .filter(createFn => !queueToExec.includes(createFn))
                        .map(createFn => createFn());

                    await Promise.allSettled(queueToExecDiff);
                }
                this.#queues.delete(id);
            }
        }
    }

    #create(index, parentId, type, url, title) {
        return browser.bookmarks.create({
            index,
            parentId,
            type,
            url,
            title
        });
    }

    #createInQueue(index, parentId, type, url, title) {
        this.#createOrGetQueue(parentId).push(async () => {
            try {
                await browser.bookmarks.create({
                    index,
                    parentId,
                    type,
                    url,
                    title
                });
            } catch (e) {
                console.error('parent folder will be deleted during its bookmark children recreating?', e);
                // what if parent folder will be deleted during its bookmark children recreating?
            }
        });
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
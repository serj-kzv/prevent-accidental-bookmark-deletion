import BookmarkTypeEnum from "./BookmarkTypeEnum.js";
import BookmarkStorageUtils from "./bookmarkstorage/BookmarkStorageUtils.js";

class BookmarkCreator {
    #queues = new Map();

    async create(index, bookmark) {
        const {parentId, type, url, title} = bookmark;
        const parentBookmarks = await browser.bookmarks.get(parentId);
        const createCallbackFn = () => this.#execQueueIfParentFound(type, bookmark);

        if (parentBookmarks.length < 1) {
            this.#createInQueue(index, parentId, type, url, title, createCallbackFn);
        } else {
            try {
                await this.#create(index, parentId, type, url, title, createCallbackFn);
            } catch (ex) {
                this.#createInQueue(index, parentId, type, url, title, createCallbackFn);
            }
        }
    }

    async #execQueueIfParentFound(type, bookmark) {
        if (BookmarkTypeEnum.isFolder(type)) {
            console.debug('execQueueIfParentFound starts', bookmark);
            const {id, parentId} = bookmark;
            const key = BookmarkStorageUtils.makeStorageKey(id, parentId);
            const queue = this.#queues.get(key);

            if (queue) {
                console.debug('execQueueIfParentFound, queue will exec', queue);
                const queueToExec = [...queue];

                await Promise.allSettled(queueToExec);

                // double check if parallel listener added a create task
                if (queueToExec.length !== queue.length) {
                    const queueToExecDiff = queue
                        .filter(createFn => !queueToExec.includes(createFn))
                        .map(createFn => createFn());

                    console.debug('execQueueIfParentFound, queueToExec will exec', queue);

                    await Promise.allSettled(queueToExecDiff);
                } else {
                    console.debug('execQueueIfParentFound, queueToExec will not exec', queue);
                }
                this.#queues.delete(key);
            }
        }
    }

    #create(index, parentId, type, url, title, callbackFn = () => {}) {
        browser.bookmarks.create({
            index,
            parentId,
            type,
            url,
            title
        });
        callbackFn();
    }

    #createInQueue(index, parentId, type, url, title, callbackFn = () => {}) {
        this.#createOrGetQueue(parentId).push(async () => {
            try {
                await browser.bookmarks.create({
                    index,
                    parentId,
                    type,
                    url,
                    title
                });
                callbackFn();
            } catch (e) {
                console.error('parent folder will be deleted during its bookmark children recreating?', e);
                // what if parent folder will be deleted during its bookmark children recreating?
            }
        });
    }

    #createOrGetQueue(key) {
        const queues = this.#queues;

        if (queues.has(key)) {
            return queues.get(key);
        } else {
            const queue = [];

            queues.set(key, queue);

            return queue;
        }
    }
}

export default BookmarkCreator;
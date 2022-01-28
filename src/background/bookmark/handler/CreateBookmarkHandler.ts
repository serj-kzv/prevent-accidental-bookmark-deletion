import {Handler} from "./Handler";

export class CreateBookmarkHandler implements Handler {

    constructor() {
    }

    start(): void {
        browser.bookmarks.onCreated.addListener(this.handle);
    }

    stop(): void {
        browser.bookmarks.onCreated.removeListener(this.handle);
    }

    handle(): void {

    }

}
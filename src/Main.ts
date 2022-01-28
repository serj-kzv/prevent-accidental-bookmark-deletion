import {BookmarkApplication} from "./background/bookmark/BookmarkApplication";

class Main {
    public async run() {
        console.debug('Main run');
        await new BookmarkApplication().run();
    }
}

new Main().run();
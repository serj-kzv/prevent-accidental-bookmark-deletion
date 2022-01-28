import {BookmarkApplication} from "./background/bookmark/BookmarkApplication";

class Main {
    public async run() {
        console.log('run');
        new BookmarkApplication().run();
    }
}

new Main().run();
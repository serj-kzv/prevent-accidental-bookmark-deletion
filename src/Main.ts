import PreventBookmarkRemoval from "./background/PreventBookmarkRemoval";

class Main {
    public async run() {
        console.log('run');

        await PreventBookmarkRemoval.build();
    }
}

new Main().run();
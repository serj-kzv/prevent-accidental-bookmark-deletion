import {Bookmark} from "./lib/bookmark/base/Bookmark";
import {NTreeNode} from "./lib/NTreeNode";

class Main {
    public run() {
        console.log('run');

        let r = new NTreeNode<Bookmark>();

        console.log(r);
    }
}

new Main().run();
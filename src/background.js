import runDebugFn from "./background/runDebugFn.js";
import Cfg from "./background/Cfg.js";
import BookmarkApplication from "./background/BookmarkApplication.js";

console.debug('start');

runDebugFn(Cfg.debug);

const run = async () => {
    const app = await new BookmarkApplication().init();
}

run();
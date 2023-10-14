import runDebugFn from "./background/runDebugFn.js";
import Cfg from "./background/Cfg.js";
import BookmarkApplication from "./background/BookmarkApplication.js";

runDebugFn(Cfg.debug);

const run = () => {
    new BookmarkApplication().init();
}

run();
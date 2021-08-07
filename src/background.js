import runDebugFn from "./background/runDebugFn.js";
import Cfg from "./background/Cfg.js";
import PreventBookmarkRemoval from "./background/PreventBookmarkRemoval.js";

console.debug('start');

runDebugFn(Cfg.debug);

const run = async () => {
    await PreventBookmarkRemoval.build();
}

run();
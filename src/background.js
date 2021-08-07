import runDebugFn from "./background/runDebugFn";
import Cfg from "./background/Cfg";
import PreventBookmarkRemoval from "./background/PreventBookmarkRemoval";

console.debug('start');

runDebugFn(Cfg.debug);

const run = async () => {
    await PreventBookmarkRemoval.build();
}
import runDebugFn from "./background/runDebugFn.js";
import Cfg from "./background/Cfg.js";
import Main from "./background/Main.js";

console.debug('start');

runDebugFn(Cfg.debug);

const run = async () => {
    await Main.build();
}

run();
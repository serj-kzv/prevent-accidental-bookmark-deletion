const runDebugFn = (debugIsActivated) => {
    if (!debugIsActivated) {
        console.debug = () => {
        };
    }
};

export default runDebugFn;
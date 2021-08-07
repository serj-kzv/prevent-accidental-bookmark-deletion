function handleRemoved(id, removeInfo) {
    console.log("Item: " + id + " removed");
    console.log("Title: " + removeInfo.node.title);
    console.log("Url: " + removeInfo.node.url);
}

function handleClick() {
    browser.bookmarks.onRemoved.addListener(handleRemoved);
}

const preventBookmarkRemovalFn = (cfg) => {
    if (!cfg.preventBookmarkRemoval) {
        return;
    }

    handleClick();
};

export default preventBookmarkRemovalFn;
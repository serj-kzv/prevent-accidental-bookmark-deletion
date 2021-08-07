import preventBookmarkMovingFn from "./background/preventBookmarkMovingFn.js";
import preventBookmarkRemovalFn from "./background/preventBookmarkRemovalFn.js";
import preventBookmarkRenamingFn from "./background/preventBookmarkRenamingFn.js";
import preventBookmarkUrlChangingFn from "./background/preventBookmarkUrlChangingFn.js";
import runDebugFn from "./background/runDebugFn";
import Cfg from "./background/Cfg";

console.debug('start');

runDebugFn(Cfg.debug);

preventBookmarkMovingFn(cfg);
preventBookmarkRemovalFn(cfg);
preventBookmarkRenamingFn(cfg);
preventBookmarkUrlChangingFn(cfg);

let currentBookmarkTitle;

const setCurrentBookmarkTitleFn = title => {
    currentBookmarkTitle = title;
};
const clearCurrentBookmarkTitleFn = () => {
    currentBookmarkTitle = undefined;
};

browser.bookmarks.onRemoved.addListener(async (id, info) => {
    console.debug('onRemoved starts');
    console.debug('id', id);
    console.debug('info', info);

    const {index, parentId, node} = info;
    const {type, url} = node;

    await browser.bookmarks.create({
        index,
        parentId,
        title: `${currentBookmarkTitle}`,
        type,
        url
    });

    clearCurrentBookmarkTitleFn();
});

browser.menus.onShown.addListener(async ({bookmarkId}) => {
    console.debug('onShown', bookmarkId);
    if (bookmarkId !== undefined) {
        const items = await browser.bookmarks.get(bookmarkId);
        console.debug('items', items);

        if (items.length === 1) {
            setCurrentBookmarkTitleFn(items[0].title);
        }
    }
});
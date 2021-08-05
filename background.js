'use strict';

console.debug('start');

let currentBookmarkTitle;

const setCurrentBookmarkTitleFn = title => {
    currentBookmarkTitle = title;
};
const clearCurrentBookmarkTitleFn = () => {
    currentBookmarkTitle = undefined;
};

browser.bookmarks.onRemoved.addListener(async (id, {parentId, index, node}) => {
    console.debug('onRemoved starts');
    console.debug('parentId', parentId);
    console.debug('index', index);
    console.debug('node', node);

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
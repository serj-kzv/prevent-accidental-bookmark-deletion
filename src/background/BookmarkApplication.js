import ChangeBookmarkProcessor from './processor/ChangeBookmarkProcessor.js';
import CreateBookmarkProcessor from './processor/CreateBookmarkProcessor.js';
import MoveBookmarkProcessor from './processor/MoveBookmarkProcessor.js';
import OnEnabledBookmarkProcessor from './processor/OnEnabledBookmarkProcessor.js';
import OnInstalledBookmarkProcessor from './processor/OnInstalledBookmarkProcessor.js';
import OnStartupBookmarkProcessor from './processor/OnStartupBookmarkProcessor.js';
import RemoveBookmarkProcessor from './processor/RemoveBookmarkProcessor.js';

export default class BookmarkApplication {
    #processors = [];

    init() {
        console.debug('start PreventBookmarkRemoval storage initialized.');

        this.#processors = [
            new CreateBookmarkProcessor().init(),
            new ChangeBookmarkProcessor().init(),
            new MoveBookmarkProcessor().init(),
            new RemoveBookmarkProcessor().init(),
            new OnStartupBookmarkProcessor().init(),
            new OnInstalledBookmarkProcessor().init(),
            new OnEnabledBookmarkProcessor().init(),
        ];

        console.debug('end PreventBookmarkRemoval initialized');
    }

    destroy() {
        this.#processors.forEach(processor => processor.destroy());
        this.#processors = undefined;
    }
}
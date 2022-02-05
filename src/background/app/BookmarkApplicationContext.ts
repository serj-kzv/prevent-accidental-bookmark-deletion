import BookmarkApiService from "./bookmark/service/BookmarkApiService";
import BookmarkDao from "./bookmark/repository/BookmarkDao";
import PouchDBFind from "pouchdb-find";
import {Constants} from "./utils/Constants";
import BookmarkTxModificationDao from "./bookmarktxmodification/repository/BookmarkTxModificationDao";
import BookmarkHandlerService from "./bookmark/service/BookmarkHandlerService";
import BookmarkTxModificationService from "./bookmarktxmodification/service/BookmarkTxModificationService";
import BookmarkRestoreService from "./bookmark/service/BookmarkRestoreService";
import BrowserHandlerService from "./browser/service/BrowserHandlerService";
import BookmarkStore from "./bookmark/store/BookmarkStore";

const PouchDB = require('pouchdb-browser').default;

PouchDB.plugin(PouchDBFind);

const bookmarkStore: BookmarkStore = new BookmarkStore();
const bookmarkHandlerService: BookmarkHandlerService = new BookmarkHandlerService();
const bookmarkTxModificationService: BookmarkTxModificationService = new BookmarkTxModificationService();
const bookmarkRestoreService: BookmarkRestoreService = new BookmarkRestoreService();
const browserHandlerService: BrowserHandlerService = new BrowserHandlerService();
const bookmarkApiService: BookmarkApiService = new BookmarkApiService();
const bookmarkDao: BookmarkDao = new BookmarkDao(new PouchDB(Constants.BOOKMARK_DATABASE_NAME));
const bookmarkTxModificationDao: BookmarkTxModificationDao = new BookmarkTxModificationDao(new PouchDB(Constants.BOOKMARK_TX_MODIFICATION_DATABASE_NAME));

export {
    bookmarkStore,
    bookmarkHandlerService,
    bookmarkTxModificationService,
    browserHandlerService,
    bookmarkApiService,
    bookmarkDao,
    bookmarkTxModificationDao,
    bookmarkRestoreService
};
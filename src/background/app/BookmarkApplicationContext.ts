import BookmarkApiService from "./bookmark/service/BookmarkApiService";
import BookmarkDao from "./bookmark/repository/BookmarkDao";
import PouchDBFind from "pouchdb-find";
import {Constants} from "./utils/Constants";
import BookmarkTxModificationDao from "./bookmarktxmodification/repository/BookmarkTxModificationDao";

const PouchDB = require('pouchdb-browser').default;

PouchDB.plugin(PouchDBFind);

const bookmarkApi: BookmarkApiService = new BookmarkApiService();
const bookmarkDao: BookmarkDao = new BookmarkDao(new PouchDB(Constants.BOOKMARK_DATABASE_NAME));
const bookmarkTxModificationDao: BookmarkTxModificationDao = new BookmarkTxModificationDao(new PouchDB(Constants.BOOKMARK_TX_MODIFICATION_DATABASE_NAME));

export {bookmarkApi, bookmarkDao, bookmarkTxModificationDao};
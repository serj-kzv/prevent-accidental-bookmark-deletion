import BookmarkDataSource from "./repository/BookmarkDataSource";
import BookmarkApiService from "./service/BookmarkApiService";
import BookmarkDao from "./repository/BookmarkDao";


const bookmarkDataSource: BookmarkDataSource = BookmarkDataSource.build();
const bookmarkApi: BookmarkApiService = new BookmarkApiService();
const bookmarkDao: BookmarkDao = new BookmarkDao();

export {bookmarkDataSource, bookmarkApi, bookmarkDao};
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/background/BookmarkCreator.js":
/*!*******************************************!*\
  !*** ./src/background/BookmarkCreator.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BookmarkTypeEnum_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BookmarkTypeEnum.js */ "./src/background/BookmarkTypeEnum.js");


class BookmarkCreator {
    #queues = new Map();

    async create(index, bookmark) {
        const {parentId, type, url, title} = bookmark;
        const parentBookmark = await browser.bookmarks.get(parentId);
        const createCallbackFn = () => this.#execQueueIfParentFound(type, bookmark);

        if (parentBookmark.length < 1) {
            this.#createInQueue(index, parentId, type, url, title, createCallbackFn);
        } else {
            try {
                await this.#create(index, parentId, type, url, title, createCallbackFn);
            } catch (ex) {
                this.#createInQueue(index, parentId, type, url, title, createCallbackFn);
            }
        }
    }

    async #execQueueIfParentFound(type, bookmark) {
        if (type === _BookmarkTypeEnum_js__WEBPACK_IMPORTED_MODULE_0__["default"].FOLDER) {
            console.debug('execQueueIfParentFound starts', bookmark);
            const {id} = bookmark;
            const queue = this.#queues.get(id);

            if (queue) {
                console.debug('execQueueIfParentFound, queue will exec', queue);
                const queueToExec = [...queue];

                await Promise.allSettled(queueToExec);

                // double check if parallel listener added a create task
                if (queueToExec.length !== queue.length) {
                    const queueToExecDiff = queue
                        .filter(createFn => !queueToExec.includes(createFn))
                        .map(createFn => createFn());

                    console.debug('execQueueIfParentFound, queueToExec will exec', queue);

                    await Promise.allSettled(queueToExecDiff);
                } else {
                    console.debug('execQueueIfParentFound, queueToExec will not exec', queue);
                }
                this.#queues.delete(id);
            }
        }
    }

    #create(index, parentId, type, url, title, callbackFn = () => {}) {
        browser.bookmarks.create({
            index,
            parentId,
            type,
            url,
            title
        });
        callbackFn();
    }

    #createInQueue(index, parentId, type, url, title, callbackFn = () => {}) {
        this.#createOrGetQueue(parentId).push(async () => {
            try {
                await browser.bookmarks.create({
                    index,
                    parentId,
                    type,
                    url,
                    title
                });
                callbackFn();
            } catch (e) {
                console.error('parent folder will be deleted during its bookmark children recreating?', e);
                // what if parent folder will be deleted during its bookmark children recreating?
            }
        });
    }

    #createOrGetQueue(id) {
        const queues = this.#queues;

        if (queues.has(id)) {
            return queues.get(id);
        } else {
            const queue = [];

            queues.set(id, queue);

            return queue;
        }
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BookmarkCreator);

/***/ }),

/***/ "./src/background/BookmarkTypeEnum.js":
/*!********************************************!*\
  !*** ./src/background/BookmarkTypeEnum.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class BookmarkTypeEnum {
    static BOOKMARK = 'bookmark';
    static FOLDER = 'folder';
    static NONE = '';
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BookmarkTypeEnum);

/***/ }),

/***/ "./src/background/PreventBookmarkRemoval.js":
/*!**************************************************!*\
  !*** ./src/background/PreventBookmarkRemoval.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _BookmarkCreator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BookmarkCreator.js */ "./src/background/BookmarkCreator.js");
/* harmony import */ var _bookmarkstorage_BookmarkStorage_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./bookmarkstorage/BookmarkStorage.js */ "./src/background/bookmarkstorage/BookmarkStorage.js");



class PreventBookmarkRemoval {
    #storage;
    #bookmarkCreator = new _BookmarkCreator_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
    #onRemovedListener;

    static async build() {
        const command = new PreventBookmarkRemoval();

        await command.#init();

        return command;
    }

    async #init() {
        console.debug('start PreventBookmarkRemoval init');
        this.#storage = await _bookmarkstorage_BookmarkStorage_js__WEBPACK_IMPORTED_MODULE_1__["default"].build();
        this.#onRemovedListener = async (id, {index, node}) => {
            console.debug('Recreation is started.');
            console.debug('id', id);
            console.debug('node', node);

            const bookmark = await this.#storage.get(id);

            console.debug('index', index);
            console.debug('bookmark', bookmark);

            await this.#storage.delete(id);
            this.#bookmarkCreator.create(index, bookmark);
        };
        browser.bookmarks.onRemoved.addListener(this.#onRemovedListener);
    }

    async destroy() {
        if (this.#onRemovedListener) {
            browser.bookmarks.onRemoved.removeListener(this.#onRemovedListener);
        }
        this.#onRemovedListener = undefined;
        this.#storage = undefined;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PreventBookmarkRemoval);

/***/ }),

/***/ "./src/background/bookmarkstorage/AbstractBookmarkStorage.js":
/*!*******************************************************************!*\
  !*** ./src/background/bookmarkstorage/AbstractBookmarkStorage.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class AbstractBookmarkStorage {
    static #ERR_MSG = 'The method has to be implemented!';

    async get(id) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async save(id, bookmark) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async delete(id) {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }

    async destroy() {
        throw AbstractBookmarkStorage.#ERR_MSG;
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AbstractBookmarkStorage);

/***/ }),

/***/ "./src/background/bookmarkstorage/BookmarkStorage.js":
/*!***********************************************************!*\
  !*** ./src/background/bookmarkstorage/BookmarkStorage.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _AbstractBookmarkStorage_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractBookmarkStorage.js */ "./src/background/bookmarkstorage/AbstractBookmarkStorage.js");
/* harmony import */ var _BookmarkStorageMode_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BookmarkStorageMode.js */ "./src/background/bookmarkstorage/BookmarkStorageMode.js");
/* harmony import */ var _LocalBookmarkStorage_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./LocalBookmarkStorage.js */ "./src/background/bookmarkstorage/LocalBookmarkStorage.js");
/* harmony import */ var _MemoryBookmarkStorage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MemoryBookmarkStorage.js */ "./src/background/bookmarkstorage/MemoryBookmarkStorage.js");





class BookmarkStorage extends _AbstractBookmarkStorage_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    #mode;
    #storage;
    #onCreatedListener;
    #onChangedListener;

    static async build() {
        const bookmarkStorage = new BookmarkStorage();

        await bookmarkStorage.#init();

        return bookmarkStorage;
    }

    async #init() {
        await this.activateMemoryStorageMode();
        this.#onCreatedListener = async (id, bookmark) => {
            console.debug('Will be added to storage', bookmark);
            await this.save(id, bookmark);
        };
        this.#onChangedListener = async (id, bookmark) => {
            console.debug('Will be added to storage', bookmark);
            await this.save(id, bookmark);
        };
        browser.bookmarks.onCreated.addListener(this.#onCreatedListener);
        browser.bookmarks.onChanged.addListener(this.#onChangedListener);
    }

    async get(id) {
        return await this.#storage.get(id);
    }

    async save(id, bookmark) {
        return await this.#storage.save(id, bookmark);
    }

    async delete(id) {
        return await this.#storage.delete(id);
    }

    async activateLocalStorageMode() {
        await this.destroy();
        this.#storage = await _LocalBookmarkStorage_js__WEBPACK_IMPORTED_MODULE_2__["default"].build();
        this.#mode = _BookmarkStorageMode_js__WEBPACK_IMPORTED_MODULE_1__["default"].LOCAL_STORAGE;
    }

    async activateMemoryStorageMode() {
        await this.destroy();
        this.#storage = await _MemoryBookmarkStorage_js__WEBPACK_IMPORTED_MODULE_3__["default"].build();
        this.#mode = _BookmarkStorageMode_js__WEBPACK_IMPORTED_MODULE_1__["default"].MEMORY_STORAGE;
    }

    async destroy() {
        if (this.#onCreatedListener) {
            browser.bookmarks.onCreated.removeListener(this.#onCreatedListener);
        }
        if (this.#onChangedListener) {
            browser.bookmarks.onChanged.removeListener(this.#onChangedListener);
        }
        this.#onCreatedListener = undefined;
        this.#onChangedListener = undefined;
        if (this.#storage) {
            await this.#storage.destroy();
        }
        this.#storage = undefined;
        this.#mode = undefined;
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BookmarkStorage);

/***/ }),

/***/ "./src/background/bookmarkstorage/BookmarkStorageMode.js":
/*!***************************************************************!*\
  !*** ./src/background/bookmarkstorage/BookmarkStorageMode.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class BookmarkStorageMode {
    static LOCAL_STORAGE = 0;
    static MEMORY_STORAGE = 1;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BookmarkStorageMode);

/***/ }),

/***/ "./src/background/bookmarkstorage/LocalBookmarkStorage.js":
/*!****************************************************************!*\
  !*** ./src/background/bookmarkstorage/LocalBookmarkStorage.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class LocalBookmarkStorage {

    static #name = 'bookmarkTitles';

    static async build() {
        const storage = new LocalBookmarkStorage();

        await storage.#init();

        return storage;
    }

    async #init() {
        await browser.storage.set({bookmarkTitles: {}});
    }

    async get(id) {
        return browser.storage.get(id);
    }

    async destroy() {
        await browser.storage.sync.remove(LocalBookmarkStorage.#name);
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LocalBookmarkStorage);

/***/ }),

/***/ "./src/background/bookmarkstorage/MemoryBookmarkStorage.js":
/*!*****************************************************************!*\
  !*** ./src/background/bookmarkstorage/MemoryBookmarkStorage.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
class MemoryBookmarkStorage {
    #storage;

    static async build() {
        const storage = new MemoryBookmarkStorage();

        await storage.#init();

        return storage;
    }

    async #init() {
        this.#storage = new Map();
        (await browser.bookmarks.search({}))
            .forEach(bookmark => {
                const {id} = bookmark;

                this.#storage.set(id, bookmark);
            });
        console.debug('init storage state is', this.#storage);
    }

    async get(id) {
        return this.#storage.get(id);
    }

    async save(id, bookmark) {
        return this.#storage.set(id, bookmark);
    }

    async delete(id) {
        return this.#storage.delete(id);
    }

    async destroy() {
        this.#storage = undefined;
    }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MemoryBookmarkStorage);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/Main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _background_PreventBookmarkRemoval__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./background/PreventBookmarkRemoval */ "./src/background/PreventBookmarkRemoval.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};

var Main = /** @class */ (function () {
    function Main() {
    }
    Main.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('run');
                        return [4 /*yield*/, _background_PreventBookmarkRemoval__WEBPACK_IMPORTED_MODULE_0__["default"].build()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return Main;
}());
new Main().run();

})();

/******/ })()
;
//# sourceMappingURL=Main.js.map
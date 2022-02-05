import {BookmarkQuery} from "../model/BookmarkQuery";
import {BookmarkValidatorUtils} from "../utils/BookmarkValidatorUtils";
import {Bookmark} from "../model/Bookmark";
import IdentifiableValidatorUtils from "../../utils/IdentifiableValidatorUtils";
import {BaseDao} from "../../base/repository/BaseDao";
import {default as PouchDB} from "pouchdb-browser";

export default class BookmarkDao extends BaseDao<Bookmark, BookmarkQuery> {

    public constructor(db: PouchDB.Database<Bookmark>) {
        super(db, BookmarkQuery);
    }

    public async saveChildByParentQuery(query: BookmarkQuery, bookmark: Bookmark): Promise<Bookmark> {
        IdentifiableValidatorUtils.validateHasNoId(bookmark)
        BookmarkValidatorUtils.validateNotEmptyQuery(query);

        const parentBookmark: Bookmark = await this.findOne(query);

        if (parentBookmark) {
            bookmark.parentId = parentBookmark.id;

            return this.save(bookmark);
        }

        throw Error('Has no such parent with query');
    }

    public async saveChildByParentId(id: string, bookmark: Bookmark): Promise<Bookmark | null> {
        IdentifiableValidatorUtils.validateId(id);

        return this.saveChildByParentQuery(new BookmarkQuery(id), bookmark);
    }

    public async findAllChildrenByParentId(id: string): Promise<Bookmark[]> {
        return await this.find(new BookmarkQuery(undefined, id));
    }

}